// ============================================================================
// tools/lint.ts — the content linter (pure library; the runner is lint.run.ts).
// Catches authoring accidents mechanically, before a playthrough — or a cold
// reader — trips over them. The checks the content wave asked for:
//   · every event-ref resolves (queueEvent/queueEvents, scheduleEvent,
//     advanceClock.onFull, openingQueue, doors, endings, exposure stages +
//     an explicitly-set consequenceEvent)
//   · trait/item/npc refs resolve
//   · diamondCoord components in [-1, 1] (events, actions, choices, decks,
//     questionnaire answers)
//   · attune in [-1, 1] (events, actions, choices, questionnaire answers) —
//     range only; the two-reader fence is the engine's, by type
//   · lensFlavor ∈ the declared vocabulary (tuning.lens.vocabulary; skipped
//     when content declares none), nullFlavor ∈ vocabulary
//   · the intent-note leak: *…* in any `log` string (author-facing italics
//     must never reach a player-facing log — the pre-Batch-A echo-leak, as a
//     mechanical rule)
//   · once-flag advice for doors/stages/endings events ("fires once" reads
//     the once flag)
//   · unreachable events (no tags to draw by, referenced by nothing) and
//     tags matching no registered deck — warnings, not errors
//   · dead terminal flags (listed in tuning.terminal.flags, set by nothing)
//   · the flag-web (Phase 2): boolean flag reads cross-referenced against
//     writes — a gate on a flag nothing writes warns per-flag (a typo'd gate
//     can never open); writes nothing reads warn as one aggregate line
// Errors fail the run; warnings inform it. The engine stays agnostic — the
// linter is where content's declared conventions get enforced.
// ============================================================================

import type { Condition, ContentDB, DiamondCoord, Outcome } from "../engine/types";

export interface LintIssue {
  level: "error" | "warning";
  where: string;
  message: string;
}

interface OutcomeSite { where: string; outcome: Outcome }

// Every outcome in the db, with a human-readable location — including the
// nested roll branches (win/lose carry no further roll, per the type contract).
function collectOutcomes(db: ContentDB): OutcomeSite[] {
  const sites: OutcomeSite[] = [];
  const add = (where: string, o: Outcome | undefined): void => {
    if (!o) return;
    sites.push({ where, outcome: o });
    if (o.roll) {
      sites.push({ where: `${where} → roll.win`, outcome: o.roll.win });
      sites.push({ where: `${where} → roll.lose`, outcome: o.roll.lose });
    }
  };
  for (const id in db.events) {
    db.events[id].choices.forEach((c, i) => add(`event ${id} choice[${i}] "${c.label.slice(0, 30)}"`, c.outcome));
  }
  for (const a of db.actions) add(`action ${a.id}`, a.outcome);
  return sites;
}

function checkCoord(issues: LintIssue[], where: string, c?: DiamondCoord): void {
  if (!c) return;
  if (Math.abs(c.sanction) > 1 || Math.abs(c.vertical) > 1) {
    issues.push({ level: "error", where, message: `diamondCoord out of range [-1, 1]: {sanction: ${c.sanction}, vertical: ${c.vertical}}` });
  }
}

// attune (the option-3 X-volition scalar): −1 grounded … +1 attuned. Range is
// the linter's to enforce; the READER fence (telemetry + the narrow-door
// ending-selector only) is the engine's, by type — attune never enters
// DiamondCoord, so no weight/dice path can reach it.
function checkAttune(issues: LintIssue[], where: string, a?: number): void {
  if (a == null) return;
  if (Math.abs(a) > 1 || Number.isNaN(a)) {
    issues.push({ level: "error", where, message: `attune out of range [-1, 1]: ${a}` });
  }
}

// Conditions referencing flags/traits are content-shaped and unverifiable
// statically (flags are set at play time) — but a counter condition on a flag
// nothing ever adds to is worth a warning. Collected via the walkers below.
function conditionCounterFlags(c: Condition | undefined, out: Set<string>): void {
  if (!c) return;
  switch (c.kind) {
    case "counter": out.add(c.flag); return;
    case "all": case "any": c.of.forEach((x) => conditionCounterFlags(x, out)); return;
    case "count": c.of.forEach((x) => conditionCounterFlags(x, out)); return;
    case "not": conditionCounterFlags(c.of, out); return;
    default: return;
  }
}

// The flag-web walker (Phase 2): boolean flag READS in a condition tree —
// {kind:"flag"} and {kind:"noflag"} only. Counter reads stay with the ghost-
// counter check above (one finding per accident, never two).
function conditionFlagReads(c: Condition | undefined, out: Set<string>): void {
  if (!c) return;
  switch (c.kind) {
    case "flag": case "noflag": out.add(c.flag); return;
    case "all": case "any": c.of.forEach((x) => conditionFlagReads(x, out)); return;
    case "count": c.of.forEach((x) => conditionFlagReads(x, out)); return;
    case "not": conditionFlagReads(c.of, out); return;
    default: return;
  }
}

export function lintContent(db: ContentDB, label: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: "error", where, message });
  const warn = (where: string, message: string) => issues.push({ level: "warning", where, message });

  const outcomes = collectOutcomes(db);
  const eventIds = new Set(Object.keys(db.events));
  const referenced = new Set<string>();   // events some queue source can reach
  const refEvent = (where: string, id: string | undefined, kind: string): void => {
    if (!id) return;
    referenced.add(id);
    if (!eventIds.has(id)) err(where, `${kind} references unknown event "${id}"`);
  };

  // -- id/key coherence ---------------------------------------------------------
  for (const key in db.events) if (db.events[key].id !== key) err(`event ${key}`, `id "${db.events[key].id}" does not match its key`);
  const deckIds = new Set<string>();
  for (const d of db.decks ?? []) {
    if (deckIds.has(d.id)) err(`deck ${d.id}`, "duplicate deck id");
    deckIds.add(d.id);
    checkCoord(issues, `deck ${d.id}`, d.diamondCoord);
  }

  // -- outcome-level refs, coords on sources, the intent-note leak ---------------
  const setFlags = new Set<string>();
  const addedFlags = new Set<string>();
  for (const { where, outcome: o } of outcomes) {
    refEvent(where, o.queueEvent, "queueEvent");
    for (const id of o.queueEvents ?? []) refEvent(where, id, "queueEvents");
    refEvent(where, o.scheduleEvent?.eventId, "scheduleEvent");
    refEvent(where, o.advanceClock?.onFull, "advanceClock.onFull");
    for (const t of [...(o.grantTraits ?? []), ...(o.removeTraits ?? [])]) {
      if (!db.traits[t]) err(where, `references unknown trait "${t}"`);
    }
    for (const it of [...(o.grantItems ?? []), ...(o.removeItems ?? [])]) {
      if (!db.items[it]) err(where, `references unknown item "${it}"`);
    }
    for (const n of [o.introduceNpc, o.addToCircle, o.setRelationship?.npcId]) {
      if (n && !db.npcs?.[n]) err(where, `references unknown npc "${n}"`);
    }
    if (o.log && /\*[^*\n]+\*/.test(o.log)) {
      err(where, `log carries an *intent-note* — author-facing italics must never reach a player log: "${o.log.slice(0, 60)}"`);
    }
    for (const f in o.setFlags ?? {}) setFlags.add(f);
    for (const f in o.addFlags ?? {}) { setFlags.add(f); addedFlags.add(f); }
  }

  // -- the journal mapping: same intent-note fence as logs (lines are player-facing)
  (db.journal ?? []).forEach((j, i) => {
    if (/\*[^*\n]+\*/.test(j.line)) {
      err(`journal[${i}]`, `journal line carries an *intent-note* — author-facing italics must never reach the surface: "${j.line.slice(0, 60)}"`);
    }
  });

  // -- structural queue sources ---------------------------------------------------
  for (const id of db.openingQueue ?? []) refEvent("openingQueue", id, "openingQueue");
  for (const d of db.doors ?? []) refEvent("doors", d.eventId, "door");
  for (const e of db.endings ?? []) refEvent("endings", e.eventId, "ending");
  for (const s of db.tuning?.exposure?.stages ?? []) refEvent("exposure stages", s.eventId, "stage");
  for (const id of db.tuning?.calendar?.deferForScheduled ?? []) refEvent("calendar.deferForScheduled", id, "deferForScheduled");
  const exp = db.tuning?.exposure;
  if (exp?.consequenceEvent) refEvent("exposure tuning", exp.consequenceEvent, "consequenceEvent");
  else if (db.events["ev_exposure_discharge"]) referenced.add("ev_exposure_discharge");   // the engine default, if content shipped one

  // -- the creation deck (the start-deck) -----------------------------------------
  const creationCommon = db.creationCommon ?? [];
  const starts = db.starts ?? [];
  const allCreationQs = [...creationCommon, ...starts.flatMap((s) => s.questions ?? [])];
  allCreationQs.forEach((question, qi) => {
    question.answers.forEach((a, ai) => {
      checkCoord(issues, `creation q${qi} a${ai}`, a.diamondCoord);
      checkAttune(issues, `creation q${qi} a${ai}`, a.attune);
      if (a.flag) setFlags.add(a.flag);   // creation answers set flags too — keep the flag-web honest
      // reply narrations are log-analog (the pick's reply, not body prose) —
      // same intent-note fence as logs and journal lines
      if (a.narration && /\*[^*\n]+\*/.test(a.narration)) {
        err(`creation q${qi} a${ai}`, `narration carries an *intent-note* — author-facing italics must never reach the surface: "${a.narration.slice(0, 60)}"`);
      }
    });
  });
  if (starts.length) {
    // Fallback totality (deal safety): at least one start must be unqualified,
    // so no profile can deal into an empty set.
    if (!starts.some((s) => !s.qualifiers)) {
      err("starts", "no fallback start — every start carries qualifiers, so a profile could deal into an empty set; give at least one start no qualifiers");
    }
    const startIds = new Set<string>();
    for (const s of starts) {
      if (startIds.has(s.id)) err(`start ${s.id}`, "duplicate start id");
      startIds.add(s.id);
      if (s.weight != null && s.weight <= 0) err(`start ${s.id}`, `weight must be > 0 (got ${s.weight})`);
      if (!s.openingQueue.length) warn(`start ${s.id}`, "empty openingQueue — the run begins with no cold-open");
      for (const id of s.openingQueue) refEvent(`start ${s.id}`, id, "start openingQueue");
      for (const k in s.seedFlags ?? {}) setFlags.add(k);
      checkCoord(issues, `start ${s.id} coord`, s.coord);
    }
    // Profile flag-web: qualifiers READ profile keys; common answers WRITE them.
    const profileWritten = new Set<string>();
    for (const q of creationCommon) for (const a of q.answers) for (const k in a.profile ?? {}) profileWritten.add(k);
    const profileRead = new Set<string>();
    for (const s of starts) { conditionFlagReads(s.qualifiers, profileRead); conditionCounterFlags(s.qualifiers, profileRead); }
    for (const k of profileRead) if (!profileWritten.has(k)) warn("starts", `qualifier reads profile key "${k}" that no common answer writes — a gate that can never pass`);
    for (const k of profileWritten) if (!profileRead.has(k)) warn("creationCommon", `profile key "${k}" written but no start's qualifiers read it (fine if held for a future start)`);
  }

  // -- once-flag advice: "fires once" reads the once flag --------------------------
  const wantsOnce: [string, string | undefined][] = [
    ...(db.doors ?? []).map((d): [string, string | undefined] => ["door", d.eventId]),
    ...(db.endings ?? []).map((e): [string, string | undefined] => ["ending", e.eventId]),
    ...(db.tuning?.exposure?.stages ?? []).map((s): [string, string | undefined] => ["exposure stage", s.eventId]),
  ];
  for (const [kind, id] of wantsOnce) {
    if (id && db.events[id] && !db.events[id].once) {
      warn(`event ${id}`, `${kind} event has no \`once\` flag — it can refire every qualifying morning`);
    }
  }

  // -- per-source coordinate + lens checks ------------------------------------------
  const vocab = db.tuning?.lens?.vocabulary;
  const nullFlavor = db.tuning?.lens?.nullFlavor;
  if (nullFlavor && vocab && !vocab.includes(nullFlavor)) {
    err("tuning.lens", `nullFlavor "${nullFlavor}" is not in the declared vocabulary`);
  }
  const checkFlavor = (where: string, flavor?: string): void => {
    if (flavor && vocab && !vocab.includes(flavor)) err(where, `lensFlavor "${flavor}" is not in the declared vocabulary [${vocab.join(", ")}]`);
  };
  for (const id in db.events) {
    const ev = db.events[id];
    checkCoord(issues, `event ${id}`, ev.diamondCoord);
    checkFlavor(`event ${id}`, ev.lensFlavor);
    checkAttune(issues, `event ${id}`, ev.attune);
    ev.choices.forEach((c, i) => {
      checkCoord(issues, `event ${id} choice[${i}]`, c.diamondCoord);
      checkFlavor(`event ${id} choice[${i}]`, c.lensFlavor);
      checkAttune(issues, `event ${id} choice[${i}]`, c.attune);
    });
    // Duplicate-label twins (Courier's dry-run catch): same-label choices are
    // the legal requires-gated-variant pattern ONLY while at most one can ever
    // be VISIBLE — the screen hides a locked twin, but (a) two unconditional
    // copies are both live at once, and (b) a showWhenLocked twin renders
    // greyed BESIDE its live sibling, which reads as a meaningful locked door.
    const byLabel = new Map<string, typeof ev.choices>();
    for (const c of ev.choices) {
      const list = byLabel.get(c.label) ?? [];
      list.push(c);
      byLabel.set(c.label, list);
    }
    for (const [label, twins] of byLabel) {
      if (twins.length < 2) continue;
      if (twins.filter((c) => !c.requires).length > 1) {
        err(`event ${id}`, `duplicate-label choices "${label.slice(0, 40)}" with no requires — both render live at once`);
      }
      if (twins.some((c) => c.showWhenLocked)) {
        warn(`event ${id}`, `duplicate-label twin "${label.slice(0, 40)}" has showWhenLocked — when locked it renders greyed beside its live sibling (the dry-run bug, opted back in)`);
      }
    }
  }
  for (const a of db.actions) {
    checkCoord(issues, `action ${a.id}`, a.diamondCoord);
    checkFlavor(`action ${a.id}`, a.lensFlavor);
    checkAttune(issues, `action ${a.id}`, a.attune);
  }
  for (const d of db.decks ?? []) checkFlavor(`deck ${d.id}`, d.lensFlavor);
  for (const q of db.questionnaire?.questions ?? []) {
    q.answers.forEach((ans, i) => {
      checkCoord(issues, `questionnaire "${q.q.slice(0, 30)}" answer[${i}]`, ans.diamondCoord);
      checkFlavor(`questionnaire "${q.q.slice(0, 30)}" answer[${i}]`, ans.lensFlavor);
      checkAttune(issues, `questionnaire "${q.q.slice(0, 30)}" answer[${i}]`, ans.attune);
    });
  }

  // -- reachability (warnings): a card nothing can reach is usually a typo ---------
  for (const id in db.events) {
    const ev = db.events[id];
    const drawable = !!ev.tags && ev.tags.length > 0;
    if (!drawable && !referenced.has(id)) {
      warn(`event ${id}`, "unreachable: no deck tags and no queue source references it");
    }
    for (const t of ev.tags ?? []) {
      if ((db.decks ?? []).length && !deckIds.has(t)) {
        warn(`event ${id}`, `tag "${t}" matches no registered deck (deck-scoped drawEvent can still reach it)`);
      }
    }
  }

  // -- dead terminals: a terminal flag nothing ever sets -----------------------------
  for (const f of db.tuning?.terminal?.flags ?? []) {
    if (!setFlags.has(f)) warn("tuning.terminal", `terminal flag "${f}" is set by no outcome in this db`);
  }

  // -- counters compared but never added -----------------------------------------------
  const comparedCounters = new Set<string>();
  for (const id in db.events) {
    const ev = db.events[id];
    conditionCounterFlags(ev.condition, comparedCounters);
    ev.choices.forEach((c) => conditionCounterFlags(c.requires, comparedCounters));
    for (const v of [...(ev.bodyVariants ?? []), ...(ev.bodyExtras ?? [])]) conditionCounterFlags(v.when, comparedCounters);
  }
  for (const a of db.actions) conditionCounterFlags(a.requires, comparedCounters);
  for (const d of db.doors ?? []) conditionCounterFlags(d.when, comparedCounters);
  for (const e of db.endings ?? []) conditionCounterFlags(e.when, comparedCounters);
  for (const f of comparedCounters) {
    if (!addedFlags.has(f) && !setFlags.has(f)) {
      warn("counters", `{kind:"counter"} compares flag "${f}" but no outcome ever sets or adds to it`);
    }
  }

  // -- the flag-web (Phase 2): boolean reads cross-referenced against writes --------
  // Writes: outcome setFlags/addFlags (collected above), every event's `once`
  // (engine-written at fire), questionnaire answer flags. Reads: every condition
  // tree (events, choices, variants/extras, actions, doors, endings), deck
  // mountFlags, and crossRun.harvestFlags (the harvest reads the run's flags).
  // Terminal flags are excluded here — the dead-terminal check above owns them —
  // and counter reads live with the ghost-counter check. Warnings, not errors:
  // a read-never-written gate is almost always a typo (it can never open), while
  // written-never-read is often legitimate (journal percepts, telemetry, a
  // cross-pack hook) and reports as ONE aggregate line, not a flood.
  const onceFlags = new Set<string>();
  const flagWrites = new Set<string>(setFlags);
  for (const id in db.events) {
    const once = db.events[id].once;
    if (once) { onceFlags.add(once); flagWrites.add(once); }
  }
  for (const q of db.questionnaire?.questions ?? []) {
    for (const ans of q.answers) if (ans.flag) flagWrites.add(ans.flag);
  }
  const flagReads = new Set<string>();
  for (const id in db.events) {
    const ev = db.events[id];
    conditionFlagReads(ev.condition, flagReads);
    ev.choices.forEach((c) => conditionFlagReads(c.requires, flagReads));
    for (const v of [...(ev.bodyVariants ?? []), ...(ev.bodyExtras ?? [])]) conditionFlagReads(v.when, flagReads);
  }
  for (const a of db.actions) conditionFlagReads(a.requires, flagReads);
  for (const d of db.doors ?? []) conditionFlagReads(d.when, flagReads);
  for (const e of db.endings ?? []) conditionFlagReads(e.when, flagReads);
  for (const j of db.journal ?? []) conditionFlagReads(j.when, flagReads);   // journal lines read flags too
  for (const d of db.decks ?? []) if (d.mountFlag) flagReads.add(d.mountFlag);
  for (const f of db.tuning?.crossRun?.harvestFlags ?? []) flagReads.add(f);
  const terminalFlags = new Set(db.tuning?.terminal?.flags ?? []);
  for (const f of [...flagReads].sort()) {
    if (!flagWrites.has(f) && !terminalFlags.has(f)) {
      warn("flag-web", `flag "${f}" is read (gates something) but never written by any outcome, once-flag, or questionnaire answer in this db`);
    }
  }
  const orphans = [...flagWrites]
    .filter((f) => !flagReads.has(f) && !comparedCounters.has(f) && !onceFlags.has(f) && !terminalFlags.has(f))
    .sort();
  if (orphans.length) {
    warn("flag-web", `written but never read in this db (fine if journal/telemetry/cross-pack): ${orphans.join(", ")}`);
  }

  return issues.map((i) => ({ ...i, where: `[${label}] ${i.where}` }));
}
