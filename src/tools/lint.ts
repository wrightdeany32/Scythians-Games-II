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

  // -- structural queue sources ---------------------------------------------------
  for (const id of db.openingQueue ?? []) refEvent("openingQueue", id, "openingQueue");
  for (const d of db.doors ?? []) refEvent("doors", d.eventId, "door");
  for (const e of db.endings ?? []) refEvent("endings", e.eventId, "ending");
  for (const s of db.tuning?.exposure?.stages ?? []) refEvent("exposure stages", s.eventId, "stage");
  const exp = db.tuning?.exposure;
  if (exp?.consequenceEvent) refEvent("exposure tuning", exp.consequenceEvent, "consequenceEvent");
  else if (db.events["ev_exposure_discharge"]) referenced.add("ev_exposure_discharge");   // the engine default, if content shipped one

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
    ev.choices.forEach((c, i) => {
      checkCoord(issues, `event ${id} choice[${i}]`, c.diamondCoord);
      checkFlavor(`event ${id} choice[${i}]`, c.lensFlavor);
    });
  }
  for (const a of db.actions) {
    checkCoord(issues, `action ${a.id}`, a.diamondCoord);
    checkFlavor(`action ${a.id}`, a.lensFlavor);
  }
  for (const d of db.decks ?? []) checkFlavor(`deck ${d.id}`, d.lensFlavor);
  for (const q of db.questionnaire?.questions ?? []) {
    q.answers.forEach((ans, i) => {
      checkCoord(issues, `questionnaire "${q.q.slice(0, 30)}" answer[${i}]`, ans.diamondCoord);
      checkFlavor(`questionnaire "${q.q.slice(0, 30)}" answer[${i}]`, ans.lensFlavor);
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

  return issues.map((i) => ({ ...i, where: `[${label}] ${i.where}` }));
}
