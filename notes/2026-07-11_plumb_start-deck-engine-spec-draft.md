# Plumb — the start-deck: engine-side spec, draft 1
### the start register · the two-phase creation flow · the seeded deal · the orientation signal captured where it already lives · linter rules · the invariants audit
*From: Plumb (engine seat) · carried by Dean · 2026-07-11 · the spec-round draft — Loom (questions & prose), Concordance (the register), Armature (review), Azimuth (§6 fence), Slate (§6 is your ask), Dean (rulings marked ⚑)*

This is the paper for the spec round v3.3 §7 called for — the piece that turns four corners into one game you can *start*. Everything here is additive and backfill-safe: a pack with no start register behaves exactly as today. I've kept type sketches minimal; the shapes are for arguing with, not for wiring yet.

## §1 — What it folds in (the asks, so nothing gets lost)
Loom's creation vision (~3–5 common questions + ~3–5 specialized, qualifiers, a seeded deal) · the reunion's own qualifiers ("Explorer sector, solo — deal only when the answers don't call for a partner") · the origin seeds already wired (`origin_fresh_start`/`origin_last_door`) · Dean's per-start locations · the corners' need to seat their characters in their own towns from turn zero · edge-midpoint starts (the "eight experiences" — a coordinate between corners, already legal since the diamond is continuous floats) · Slate's creation-orientation signal with Azimuth's endorsement (the attune argument reused) · Azimuth's determinism note (the deal consumes the run's seed).

## §2 — What exists today (the seam we're extending, as-built)
Creation is already a working seam, just single-path: `db.questionnaire` (optional) with answers that set archetype/stats/flags **and seed index-0 coordLog entries** — coordinate, lensFlavor, and `attune` all flow through the one `coordEntry` builder, so creation and play can't drift in shape. `openingQueue` mounts the scripted cold-open (db-level, per-run overridable). `townId` and `tier` are per-run inputs. Cross-run seeds land *before* creation so creation state may read or overwrite them. The start-deck generalizes exactly this: today's flow is "one implicit start"; the register makes starts *data* and adds the deal that picks one.

## §3 — The start register
```ts
// Content-side. A start is a card in the creation deck, not a menu entry.
interface StartDef {
  id: string;                    // "start_explorer_reunion"
  townId: string;                // seats the run — Dean's per-start locations
  tier: Tier;                    //   (both replace today's per-run opts for dealt runs)
  qualifiers?: Condition;        // deal eligibility, evaluated against the PROFILE (§4)
  weight?: number;               // deal weight among eligible starts (default 1)
  questions?: CreationQuestion[];// the start's SPECIALIZED questions (phase two)
  seedFlags?: Record<string, boolean | number | string>;  // origin_* etc.
  openingQueue: string[];        // the start's cold-open beats
  coord?: DiamondCoord;          // the START's address in the diamond — read by
                                 // NOTHING at runtime; it's register metadata for
                                 // Concordance's coverage view + the linter's
                                 // corner/edge accounting. Never written to state.
}
```
`CreationQuestion` is today's questionnaire question shape unchanged (label / archetype / base / patch / flag / diamondCoord / lensFlavor / attune) plus one addition: answers may write **profile keys** (`profile?: Record<string, …>`) — see §4. The register lives beside decks in the ContentDB (`db.starts?: StartDef[]`); Concordance's start-register document is its source of truth, the code its wiring.

## §4 — The creation flow: two phases, one deal between them
1. **Common questions** (db-level `db.creationCommon?: CreationQuestion[]` — Loom's 3–5). Answers accumulate the **qualifier profile**: a scratch flag-map (NOT `g.flags` — it exists before the game does) plus the usual index-0 seeds held pending.
2. **The deal** (§5) selects one eligible start from the register.
3. **Specialized questions** — the dealt start's own 3–5. Same shape, same accumulation.
4. **`newGame` finalizes**: profile + both phases' stats/flags/index-0 entries apply exactly as today's questionnaire does; the start's `seedFlags` land; `townId`/`tier` come from the StartDef; the start's `openingQueue` mounts. Cross-run seeds still arrive first.

API sketch: a small `CreationSession` (mirroring SceneRunner's screen shape — prose + numbered options) that the consoles drive, ending in the `NewGameOpts` we already have plus `startId`. Harnesses and bots can skip straight to `newGame({ …, startId, answers })` — scripted, replayable, no interactivity required. **Legacy path untouched:** no register → today's behavior verbatim.

## §5 — The deal: deterministic, qualified, never a catalog
- **Eligibility**: `evalCondition(start.qualifiers, profileView)` — the same Condition grammar the whole engine speaks, evaluated against the profile scratch-map. The reunion's "solo" rule is just `{ noflag: "wants_partner" }`.
- **Determinism**: the deal is a weighted draw consuming the run's seeded RNG stream — same seed + same answers ⇒ same start, byte-identical run. (Azimuth's note, honored by construction; replays and resume-by-replay work unchanged.)
- **The fallback rule** (linter-enforced): every register must contain at least one start with **no qualifiers**, so no profile can deal into an empty set. Cheap totality guarantee; no combinatorial checking needed.
- **No-catalog at the surface**: the deal is invisible. The reader answers questions and *a life begins* — no start names, no "you drew…", no count of what else exists. The dealt start is simply the game. (The register is exactly the kind of structure no-catalog forbids showing.)

## §6 — The orientation signal: captured where it already lives (Slate's ask, Azimuth's fence)
The finding that shapes this section: **the capture mechanism already exists.** Questionnaire answers have carried `attune` since Phase 2a, and creation answers write **index-0 coordLog entries** through the one entry builder. So orientation-at-creation — the volition shape the player's creation implies — is the aggregate of the index-0 entries' `attune` (and, if an ending ever wants it, their coordinates), *distinguishable from all play entries by index 0 alone*, persisted for the life of the run, reconstructible never if not annotated.

**The spec therefore asks for annotation, not machinery**: Loom's creation questions (both phases) carry `attune` leans on answers where the fiction implies them — exactly the sweep already done for the introspectives. **No new field, no second fence idiom**: the existing attune wall covers it verbatim (*read only by the narrow-door ending-selector and telemetry; a third reader requires a ruling; never the draw*). No derived reader ships until an authored deep ending knocks — then `orientationAtCreation(g)` filters index-0 entries, and it is that reader that gets reviewed at the door, not the data.

*Alternative considered and set aside*: a dedicated `orientation` scalar seeded at creation. Rejected because it duplicates the attune fence (two walls to audit instead of one) and stores a derived judgment where we otherwise store only events. If Azimuth's telemetry wants a different aggregation than the ending-selector, both derive from the same entries — which is the point. ⚑ *If Dean or Slate feel orientation is semantically distinct from attune-at-birth (not just "attune, earlier"), say so in this round — that's the one thing that would justify the second scalar.*

## §7 — The consoles
`LoopSession` grows a creation phase: the questions present as ordinary screens (prose + numbered options, `card: "__creation__"`), picks record as reader records, the deal happens silently between the phases, then `enterMorning()` as today. v0.3's Run Read then genuinely starts at creation, as the pack already says it should. Bots pass scripted `answers` and never see screens. The relay's resume-by-replay covers creation picks like any others.

## §8 — Linter rules (all mechanical)
Register refs resolve (`openingQueue` events exist; `townId` in the towns registry) · fallback start exists (§5) · every `qualifiers` key is written by some creation answer's `profile` (no dead gates) · every `profile` key is read by some `qualifiers` (orphan warning, same spirit as the flag-web pass) · attune ranges on creation answers (existing check extends) · `weight > 0` · specialized questions only on starts (no db-level strays).

## §9 — The invariants audit
- **No-truth-state**: starts seed flags and coordinates — events, not meanings. Unchanged.
- **No-catalog**: §5's invisible deal; the register never surfaces; `coord` on StartDef is register metadata, never rendered. The Surface type doesn't change.
- **No-stored-disposition**: the profile is pre-game scratch, discarded after the deal (qualifier flags that should persist go through `seedFlags` deliberately); position stays derived from the log; §6 stores annotations on events, not a judgment.
- **No-meta-reveal**: the deal never acknowledges the deck; orientation waits behind the narrow door.

## §10 — Migration
The Explorer reunion becomes `start_explorer_reunion` — first entry in the register, qualifiers per Loom's "solo" rule, `openingQueue` = today's opening, `seedFlags` = the origin pair, town = `town_edge`. The current hardcoded path keeps working throughout (harnesses pin `startId`), so this is a soft cutover with the green bar watching.

## §11 — Open questions for the round (owners named)
1. **Loom** — question order confirmed as common-then-specialized? And do any *specialized* answers need to write profile keys (only matters if a future deal re-reads them — my lean: no, keep the profile a phase-one artifact).
2. **Concordance** — the profile vocabulary wants a registry section (keys, writers, readers) beside the flag registry; and does the start register document want `coord` accounting per corner/edge from day one?
3. **Armature** — the `CreationSession`/`newGame` seam: separate object (my lean, mirrors SceneRunner) or fold into `newGame` with a callback? And where does the deal's RNG draw sit in the stream order relative to the first day's draws (I propose: first, always, even for `startId`-pinned runs — burn one draw for stream stability so pinned and dealt runs stay comparable)?
4. **Dean ⚑** — §6's one ruling (orientation = attune-at-birth, or its own thing?); and whether the spec round runs parallel to the retune or after it.

— Plumb
