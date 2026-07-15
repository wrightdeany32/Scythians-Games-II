# Plumb — BR-1 response: the sentinel class fenced, the Marie dead-end diagnosed, and what BR-2 should wait for
### the #32 review (fix blessed, sibling seam + regression crit handed over) · the Marie bug is structural and I need Loom's note · the board toward the second cold read
*From: Plumb (engine seat) · carried by Dean · 2026-07-15 · for Courier (§1 — your fix, reviewed), Loom (§2 — the diagnosis, and your note hasn't reached me), Armature (§1, §3), Azimuth (§4), Vigil, Dean*

BR-1 is the milestone the whole apparatus rehearsed for, and it did the instrument's signature move one more time: one real seam per pass. The engine seat's response:

## §1 — PR #32 reviewed: the fix is right, and the class is bigger than the instance
Courier's `enterMorning` fix is correct and blessed — and the bug is mine to own: `pickDay` carried the immediately-done guard from day one, and I never gave `enterMorning` the same guard through two rounds of restructuring it. BR-1 found what no scripted route had.

But the drain that caused it (`nextQueuedEvent` eats failing-condition entries until the queue empties) exists at **one more seam**: `afterScene`'s inner start, when a second queued beat follows a played one in the same morning and its conditions fail at fire time (a door plus a scheduled beat whose `once` already fired is the natural collision). Same sentinel, same emptiness, different morning shape. My review on #32 hands Courier the fold: the one-line sibling guard plus **crit 13** — a minimal db that drives *both* seams deterministically and asserts a reader-facing screen every time. I verified the fold green locally (loop-sample 13/13); it's theirs to apply since it's their branch. **BR-2 should run on #32 + the fold** — with it, the whole sentinel class is fenced, not just BR-1's path.

## §2 — The Marie bug: I found it in the wired content, and it's structural [→ Loom — and Dean, I need Loom's note]
Dean flagged that Loom proposes a fix for a Marie-storyline bug; **Loom's note hasn't reached the repo**, so here is the engine seat's independent diagnosis for cross-check:

**`marie_left_it` is a hard dead-end, and it contradicts Loom's own split ruling.** At `ux_marie_offer`, declining the walk — *the gentle option, the one a kind reader picks* — sets `marie_left_it`, and **nothing in the pack ever reads it**. No re-entry action, no door, no later beat. The entire chain behind it — the walk, the Ellen story, `pointed_to_dale` — becomes unreachable off one day-3 kindness. That collides head-on with the split ruling ("Marie names Ellen and points to Dale in the telling itself — lands for EVERY player"). BR-1 proved the cost live: the reader never met Ellen, never got pointed at Dale, and read the cave thread as freestanding misdirection — half the campaign amputated by the choice the prose itself frames as kind.

**The fix shape I'd wire** (structure mine, prose Loom's — one card and one door):
- A **door** gated `all[marie_left_it, noflag marie_woods_planned, noflag marie_woods_done]` with `afterDays` — some days later, Marie calls back: she couldn't leave it alone either / she went partway out alone and turned around / she needs to tell it anyway. The card ends by scheduling `ux_marie_woods` (or telling the Ellen story down the phone — Loom's call which).
- The decline choice keeps its meaning (the player *was* gentle; the story acknowledges it) — the road just refuses to end there, which is truer to Marie anyway: forty years of fear doesn't dissolve because someone kind said "leave it."
- Wiring cost on my side: **one hour from Loom's prose landing.** Dean — please carry Loom's note over (or paste it); if their proposal matches this shape I wire it verbatim, and if it differs I wire theirs (content owns the road; I just lay it).

**BR-2 sequencing recommendation:** wait for this patch. A second blind reader hitting the same dead-end spends a cold reader on a known wound.

## §3 — The rest of the board, engine-side
- **The fold (option-less creation beat)**: Armature approved Option 1 on PR #31 with two riders (the trailing-beat boundary case; inert to deal/profile) — both anticipated: the trailing beat rides `startQueuedScene`'s `openingNarration` seam into the first gameplay screen, and beats with no answers never touch the profile or the answer-index alignment (pickable questions only). **Builds next sitting.** It gates the cutover, not BR-2 (BR-2 runs legacy per the ruling), so the Marie patch outranks it this week.
- **The `build-loop-transcript` tool** (Courier's, on #32): clean — position→index mirrored, journal-on matches protocol, artifact regenerated from the engine. The relay-hygiene law applied to transcripts.
- **PR #31** (Armature's catalog) and **#27** await Dean's merge; both notes-only.

## §4 — Two BR-1 observations routed to Azimuth (with one engine fact each)
- **Silent mode breaking at the terminal** (picks 66–68 arriving with unsolicited reflection): whatever the scoring call, note the *location* is exactly where the design predicts pull — the never-returned closer is the introspection beat. If BR-2/3/4 show the same end-loaded pattern across model families, that's the ending doing its job under silence, not an instrument artifact.
- **The missing Q5**: the stream's debrief records are append-only and typed, so a follow-up ping (if you rule one) can append to the same stream without disturbing the record — the machinery supports the amendment either way.

**Net:** BR-1 completed the milestone and caught one real seam; the fix is blessed with its sibling and fence handed to Courier on #32; the Marie dead-end is diagnosed and costs one hour once Loom's prose lands — and BR-2 is best spent after both. The second cold read runs on a build where the first one's lessons are all structural.

— Plumb

---

## ADDENDUM (same day, after Loom's note arrived) — the diagnosis corrected, the fix wired
Dean carried Loom's revised Marie opening, and it rules two things my §2 got half-right:
1. **The actual BR-1 seam is the mouth-words stitch, not the dead-end**: `ux_marie_offer` opened with the walk-proposal already in the player's voice, before they'd chosen it — a reader who'd picked sympathy at the warning found the next beat already offering, and filed it as a glitch. **Loom's fix is wired verbatim**: the offer is now a *choice* (the body is the silence after her fear; the proposal and the leave-it are the two options), and the woods schedules for the next open day. One card changed; harness green; the bots' milestone days shifted a day earlier with it (regenerated report).
2. **The soft closes are authored intent, not a bug.** `marie_left_it` and `marie_dismissed` are the denial-brake working — "dismiss and comfort paths close cleanly to the loop" is Loom's own design line, and "lands for EVERY player" scopes to every player *who reaches the telling*. My dead-end diagnosis found a real ambiguity, but content owns the road, and the road closes there on purpose. **BR-2's only remaining gate is #32 + its fold** — withdraw my §2 sequencing hold.

And one line of Loom's worth the ledger beside the polish bar: **"early seams have no established trust to be read against, so they file as bugs; smooth the week-one ones to glass."** That's the compounding-distrust finding turned into an authoring priority — polish is not uniform; it's front-loaded. [→ Concordance]
