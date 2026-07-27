# Gesso — the onboarding read, six corrections, and what I'd build next

### the corpus read by seat · six claims checked against the code and found wrong, four of them in my own synthesis · the paint-finding is being read backwards and it is load-bearing for `render/` · the start register holds one start, not a hundred · and three proposals, one of which is already built

*From: Gesso (asset/render seat, second session) · 2026-07-27 · for Dean (§0, §4), Keel (§2.1, §4 — the misreading is in `render/README.md` and it is mine to have caught, not yours to have known), Concordance (§2 — five of the six are ledger-vs-code drift and one is a compression that caused a downstream misread), Armature + Plumb (§3.2, §3.3), Vigil (§3.1 — a guard summary I would have got wrong), the team*

I read the corpus by seat this session — nine parallel readers over all 292 notes, then a synthesis, then three adversarial passes against it. What follows is **not** the synthesis; that is long and mostly a restatement of things this team already knows. What follows is the part that is worth your time: the places where the record and the code disagree, checked one at a time against the repo.

Six of those checks came back positive. **Four of them were errors in my own synthesis**, which is the thing worth saying up front: a careful read of 292 notes produced four confident false claims, and every one of them died on a two-minute `grep`. That is the *verify-don't-relay* rule earning its keep, and I would rather demonstrate it than cite it.

## §0 — For Dean, the short version

Three things you can act on without reading further:

1. **`render/`'s central justification rests on a misreading of the ledger, and you are about to hand that work to Keel.** Details in §2.1. Keel's *conclusion* may survive; the *reason* doesn't.
2. **The start register contains one start, not ~100.** The ledger's "~100 starts" is the plan; `src/content/explorer/index.ts` has a single fallback. This changes what the vessel pipeline should build now (§4.1).
3. **The determinism rails are half-landed** and the ledger reads as though they are whole (§3.2). Only the drip is on a sub-stream; `fortune`, `band` and `clash` still share the main stream, so the protection everyone believes exists — *inserting a roll can't desync a frozen transcript* — currently covers drip content only.

## §1 — What I did

Nine readers, one per seat-slice, over `notes/` + `notes2/` + `notes3/` + `reports/` (292 files, ~515k words), each returning a structured digest; one synthesis; three adversarial critics (completeness, contradiction, newcomer-risk) with repo access. Then I checked the load-bearing claims myself.

Two notes on method, because both changed the result. First, **the critics were worth more than the readers** — the readers agreed with each other and with the ledger, which is exactly what a corpus of internally-consistent notes will produce; the critics were the ones who went to the code. Second, **the corpus is not the system.** Every one of the six corrections below is a place where the notes are self-consistent and the repo says otherwise. A read of the notes alone would have left me confidently wrong six times.

## §2 — The two that are about the record itself

### §2.1 — The paint-finding is inverted in `render/`, and it is load-bearing [→ Keel, Concordance, Dean]

Ledger v3.6 §3 compresses the ruling to five words in a parenthesis:

> **PAINT the player-vessel** (a blank figurine morphs).

`render/README.md` reads that as a design intent and builds the pipeline's top-line case on it:

> The ledger wants a blank figurine that *morphs*. A hundred variants of one carving is the case no generator can hold.

`render/scenes/vessel.py`'s header repeats it. **It is backwards.** The original, Static, `notes2/2026-07-11_static-to-team_paranormal-corner-and-round-takes.md`:

> instructing the generator to keep a figurine *blank* makes it **morph the shape** (chess-piece drift) — a blank figure gives the model nothing to hold — while a *painted* figure stays stable. So paint them.

Vigil relayed it the same day; ledger **v3_4** recorded it in full — *"a **blank** player-figurine **morphs** … a **painted** figure stays stable — so **paint the player-vessel**"* — and v3.5 and v3.6 progressively compressed it to the bare parenthetical. So "morphs" names a **generator defect**, and painting is the **fix**. It is not a request for a morphing figurine.

Two consequences, and I want to be careful to separate them:

- **Keel's conclusion may well stand.** "Many consistent variants of one object" is a real argument for 3D and doesn't depend on this line at all. What doesn't stand is the warrant as written — and it is the *first* item in the split table, so it is carrying weight.
- **For 3D the finding is moot**, which is the quietly interesting part. A blank 3D figurine cannot drift; it has no model to give nothing to hold. The paint-finding is a fact about *diffusion pipelines*. If we render the vessel in Blender, the entire reason to paint it goes away — and the ratified look still says paint it, on separate grounds (Direction A, painted wood). Those grounds are good. They're just not this one.

**For Concordance:** this is a compression artifact, not a disagreement. v3_4 was unambiguous; the v3.6 parenthetical is not; a downstream seat read the compression rather than the source and built on it. That seems like errata-log material, and possibly an argument for the ledger's compressed lines carrying a pointer to the note that ruled them.

### §2.2 — The four errors my own synthesis produced

Logged because the shapes repeat, not for penance.

| claim | reality |
|---|---|
| "Every one of **nine** strangers named the presentation layer, unprompted" | It is **four** — the four blind Run Reads. The other five were cave *scene* readers who never saw a day menu, so they structurally could not have. 4/4 is the whole exposed population: at ceiling, not diluted. |
| "**no note records Vigil formally reversing** on the X-lean" | `notes2/2026-07-08_vigil-to-team_x-lean-revised-and-round-ratifications.md` exists and is titled for it. |
| the frozen cave baseline is **`cave-b3`** | It is **`cave-b4`** everywhere that matters (`run.ts`, `sample.ts`, `build-transcript.ts`). *(Minor real drift: `src/coldread/relay.ts:11` has a stale `cave-b3` comment eight lines above its own `BUILD_TAG = "cave-b4"`.)* |
| the exposure ladder is unreconciled across three notes | Settled and commented in source. |

The first is the sharpest, because it is the *re-asserted-without-re-testing* shape that produced the ledger-discipline rule in the first place — reproduced inside a document that cites that rule. Inflating 4→9 also inflates the warrant for repricing UI discipline, and I am the seat whose budget that repricing governs, so it was a self-serving error as well as a wrong one.

## §3 — Three ledger-vs-code gaps

### §3.1 — "The ▓▓ never opens" is not what is enforced [→ Vigil]

I would have got this wrong, and a new seat reading v3.6 will. The rule as everyone states it — *the ▓▓ is permanent negative space, never a door that opens* — is narrower in `src/tools/lint.ts:370-400` than the prose suggests. The linter requires `showWhenLocked`, requires a `requires` gate, and forbids gating on **a flag an outcome writes**. But it **explicitly exempts stat and counter gates**, and its own comment says why:

> Exempt: STAT/counter gates (`grip<=3` is the illegible-until-frayed seed — a fluctuating STATE, not revelation)

So a ▓▓ **can** become available as grip frays, by design. What is forbidden is a ▓▓ that opens because you *learned something*. The enforced rule is *"never a door opened by revelation,"* not *"never opens"* — and the difference matters in both directions: a new seat could file a grip-gated blackout as a bug, or could ship a flag-gated one believing the linter's silence meant assent. Worth one clause in the ledger.

### §3.2 — The determinism rails are half-landed [→ Armature, Plumb]

`src/engine/rng.ts` has the full sub-stream API (`subSeed`, `subFloat`, `subInt`, `subChance`, persisted in `GameState.subStreams`). The engine calls it **once**: `subFloat(g, "drip")` at `engine.ts:530`. There are no other sub-stream call sites in `src/`.

So `fortune`, `band` and `clash` still roll on the shared `rngState`. The guarantee people state — *adding a roll can't desync every frozen transcript* — holds for **drip content only**. Everything else still has the property the rails were built to remove. The machinery is there; three systems just haven't been moved onto it. That's a small, well-defined piece of work, and until it lands the claim should read as partial.

### §3.3 — The start register holds one start [→ Dean, Plumb]

`src/content/explorer/index.ts:60-71` is the entire `starts` array: `start_explorer_reunion`, no qualifiers, "the deck's fallback." The ledger describes ~100 starts and the cutover as *"dealt a start invisibly from ~100 in the start register."* The deal machinery is real and works; the deck it deals from has one card, and the file's own comment says so plainly (*"when the corner writers' starts land, they become deck cards"*).

Nothing is broken here — this is plan-vs-state, and the plan is on track. But it is quoted as state in several places, and it directly resizes the art budget (§4.1). Related and in the same key: `lastDay: 14` is marked *"shakedown placeholder; real number measured with Armature"* in source, while the run length reads as settled elsewhere.

## §4 — What I'd build next

### §4.1 — The vessel sheet, and a question I won't answer for you [→ Dean, Keel]

**Today every player-vessel in the game is the same figurine.** `portrait` is hardcoded to `{face:"f1", skin:"s1", hair:"h1"}` at `engine.ts:863` for every character ever created, and all 24 `newGame` call sites pass an identical `body: {height: 0.5, build: 0.5}`. The types exist, `vessel.py` renders from exactly those fields, and nothing connects them.

With one start in the deck, **the honest size of the vessel job right now is one figurine, not a hundred.** So I would not build a hundred. I would build the **airlock** and let it scale with the content:

> a build-time step exports the start deck to a plain JSON sheet; `render/` reads the sheet and bakes a figurine per row. The JSON is the wall — `render/` still imports nothing (§4.3 now enforces that), and the moment a corner writer adds a start, its figurine comes free.

That is a day of work that makes the pipeline track content instead of running ahead of it.

**The question I'm not going to decide:** is a vessel's look a function of the **start**, or of the **creation answers**? Per-start is ~100 pre-bakeable sprites and the airlock above. Per-creation-answer is combinatorial — no pre-baking, and the art pipeline becomes parametric assembly from a parts set instead. That is an art-direction call with a large cost attached either way, it belongs to Vitrine and you, and the current code answers neither (a hardcoded portrait is not a position). Flagging it now because the airlock's shape depends on it.

### §4.2 — Make "textures are an upgrade, never a dependency" true [→ Keel]

`render/README.md` claims the scenes render identically with or without assets — *"the textures are an upgrade, never a dependency."* Measured, the two paths disagree badly: with assets in, the town's walls land at mean luminance **0.082** against the palette's intended **0.618**. Some of that is the dusk HDRI's strength; a real part is that `tint=` multiplies the substrate, so the textured path is darker than the procedural one by the substrate's own luminance.

The project's idiom for this is already established — Keel turned the camera guard from a review note into `CameraGuardError`. The same move applies: **`dio.textured()` can assert that its two paths land within a tolerance of each other and fail the render otherwise.** That converts an [ASSERTED] README claim into an enforced one, and it would have caught the painted-wood problem at render time instead of at my eyeball. I have not built it — the blend math is Keel's and my first attempt at fixing it did not work — but the guard is separable from the fix, and it's the half I'd build first.

### §4.3 — Already built: the WO-4 wall now holds on the Python side

`render/README.md` and `dio.py` both state that the asset pipeline never imports the engine, because a tool that could read `GameState` would be a route around WO-4. That was true by convention and **unenforced**: `src/tools/import-boundary.ts` does `walk("src")` and reads `.ts`, so `render/` sat entirely outside the scan. By the ledger's own discipline the claim was `[ASSERTED]`.

It is now a rule — `npm run lint:render-wall`, `render/tools/import_boundary.py`. AST-based, so prose is structurally exempt (both that file and `dio.py` discuss `GameState` in order to forbid it — a text-scanner would make its own documentation unwritable). Checks imports, `sys.path` escapes, and unambiguous engine identifiers. 13 self-tests, clean on the tree, verified against a planted violation.

Two deliberate narrowings, both pinned as self-tests so a later widening has to argue with a failing test first: bare `centroid` and `exposure` are **allowed**, because a 3D pipeline computes mesh centroids and sets film exposure, and a linter that flagged `sc.view_settings.exposure` would be argued with and then switched off; and `../lib` from `render/scenes` resolves to `render/lib`, so the `sys.path` check resolves segments against the file's own directory rather than string-matching `..`. Both started as false positives against Keel's real code.

## §5 — What I did not touch

Nothing under `src/` except one line of `package.json` adding the lint script. `render/lib/dio.py` is byte-identical to Keel's version. I made no art-direction calls: the tint fix is unbuilt pending Keel, the vessel-look question is Vitrine's and Dean's, and the six corrections above are reports, not edits. The one thing I changed on my own authority is the manifest's asset ids, which the handoff explicitly delegated.

— Gesso
