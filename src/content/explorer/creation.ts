// ============================================================================
// content/explorer/creation.ts — THE CREATION RIDE (Loom's v2, FINALIZED
// 2026-07-16: the three notes3 packs + the v2 four-doors note + the v1 scenes
// v2 carried unchanged). The shared phase every character rides through:
//
//   the frame (the ride) → the rain (disposition + orientation) → the lit
//   house (observer / belonger / worker) → the radio (the watcher's first
//   touch — the game's ONE option-less creation beat, ever) → the four
//   corner-affinity forks (Explorer / Detective / Paranormal / Operative).
//
// The deal then seats the life. Today only the Explorer reunion exists,
// unqualified — every profile deals there (fallback totality); the affinity
// keys are recorded for the corner starts to read the day they land.
//
// WIRED, NOT LIVE: the deck flips ON as its own named milestone AFTER BR-4
// (Azimuth's comparability ruling — BR-1/2 ran the legacy opening, so the
// cross-family set must too). Until the flip, nothing reads this unless a
// caller opts in (LoopSession opts.startDeck / newGame startId).
//
// COORDINATE AND ATTUNE NUMBERS ARE PROVISIONAL. Loom's packs fixed the
// DIRECTIONS (which way each answer leans); the exact weights are the spec
// round with Concordance. Directions are encoded here at origin-scale
// magnitudes — change the numbers freely, the directions are the content.
//
// Profile keys (pre-game scratch, read only by the deal — the profile-key
// registry is Concordance's):
//   affinity_explorer / affinity_detective / affinity_paranormal /
//   affinity_operative — seat corners as their starts land;
//   settled_urban   — the away-from-Explorer lean the sanctioned corners read;
//   anti_institutional — the thumb-past lean the fringe corners read;
//   open_read       — the police scene's open/sanctioned lean;
//   home_worker     — Stave's office-type tag (diamond-null, tagged only).
// ============================================================================

import type { CreationQuestion } from "../../engine/types";

export const explorerCreationCommon: CreationQuestion[] = [
  // -- the frame: the ride (Loom's FINALIZED frame, 2026-07-17 retexts pack;
  // replaces the one-line-spec draft) ---------------------------------------------
  // The mode choice is coordinate-silent — pure flavor, so the scene fits
  // whoever they turn out to be. Mechanically it writes ONE profile key
  // (mode_walking) that the rain and radio read to select their retext
  // (qVariants — the route-neutral rule applied at the door: the disposition
  // each scene reads is identical across modes; only the dressing changes).
  // Driving and riding share the car text (a cab still has a windshield and
  // a radio), so only walking carries a key.
  {
    q: `Rain, and a while yet to go. It's been coming down since you set out — steady, the kind that settles in for the night — and the world's gone soft and smeared at the edges of it. There's somewhere behind you and somewhere ahead, and in between there's only this: the wet dark, the going, and the particular honesty of a mind with nothing to do but drift.`,
    answers: [
      { label: `You're driving — your hands on the wheel, the wipers keeping their patient time.` },
      { label: `You're riding — a back seat, someone else's hands on the wheel, your forehead near the cold glass.` },
      { label: `You're walking — hood up, the long way home on foot, the streetlights smearing in the wet.`, profile: { mode_walking: true } },
    ],
  },

  // -- common scene 1: the rain (disposition + orientation; v1 verbatim, v2
  // "unchanged"; walking retext from the 2026-07-17 pack) — the four-way read
  // across the diamond's shades. The darker and the open leans seed attune at
  // index 0 (the creation-orientation signal, the one fence reused);
  // ready-for-home is the first-class null. The four answers are shared
  // across modes — they read the same disposition; only the setup line varies.
  // [PROVISIONAL: the elsewhere answer's "slight grounded read" is encoded as
  // a small negative attune — the grounded pole of the one orientation
  // channel; sign and magnitude are Concordance's spec pass.]
  {
    q: `The rain hasn't let up since you started out. It blurs the lights ahead into long smears, and the wipers keep their patient time, and there's a while yet to go.`,
    qVariants: [
      {
        when: { kind: "flag", flag: "mode_walking" },
        text: `The rain hasn't let up since you started out. It's soaked through the shoulders of your coat, and the streetlights smear long and gold in it, and there's a good way yet to walk.`,
      },
    ],
    answers: [
      {
        label: `You've never minded the gray. There's a kind of comfort in it.`,
        narration: `Some people need the sun. You've always been easiest in weather like this — the world turned down low, softened, kept at arm's length. It suits you. You don't examine why.`,
        diamondCoord: { sanction: 0.8, vertical: 0 },   // right-of-Explorer, toward the attuned/fringe dark
        attune: 0.3,
      },
      {
        label: `It'll be nicer tomorrow. It usually is.`,
        narration: `You've always been able to see past the gray to the clear day on the other side of it. It's gotten you through worse than rain.`,
        diamondCoord: { sanction: 0, vertical: 0.5 },   // upward — exposure, the enable pole
        attune: 0.15,
      },
      {
        label: `You're just ready to be home.`,
        narration: `You're not thinking about the rain one way or another. You're thinking about your own front door, and the rain is just the thing between you and it.`,
      },
      {
        label: `You're barely watching it. Your mind's a long way from the road.`,
        narration: `The rain, the road, the smears of light — it's all just happening at you while you think about something else entirely. You couldn't say what, after. Just: elsewhere.`,
        attune: -0.2,
      },
    ],
  },

  // -- common scene 2: the lit house (ux_creation_house, FINALIZED) — observer
  // versus belonger, with Stave's worker-read. The worker and the pure null
  // are BOTH diamond-null; the difference is only the worker's profile tag,
  // which a Detective start reads later (no coordinate, no attune — exactly
  // the pack's wiring note).
  {
    q: `Coming through the edge of town, you pass a house with every window lit — a whole family's worth of warm gold against the dark and the wet, moving behind the glass.`,
    answers: [
      {
        label: `Hm. You wonder what the story is in there.`,
        diamondCoord: { sanction: 0.6, vertical: 0 },   // the curious one — half an explorer already
      },
      {
        label: `It looks like where you're headed. More or less.`,
        diamondCoord: { sanction: -0.4, vertical: 0 },  // the belonger — grounded, a life to go home to
      },
      {
        label: `You clock it and go back to the problem you were chewing on.`,
        profile: { home_worker: true },                 // the worker — Stave's office-type signal, tagged only
      },
      { label: `Just a house on a wet night.` },        // pure indifference — first-class null
    ],
  },

  // -- the one that lands too personal: the radio (ux_creation_radio,
  // FINALIZED) — the watcher's first touch, the meta-layer's first appearance,
  // at the door. THE GAME'S ONE OPTION-LESS CREATION BEAT, EVER (ledger §3).
  // Inert by the beat contract: no coordinate, no flavor, no flag, no answer
  // slot — the prickle must leave no mechanical fingerprint, because being
  // unaccountable is the whole point. Its far end is the deep ending's
  // watcher-recognition; the player will never connect the two.
  {
    q: `The radio's been on low the whole drive — some call-in show you stopped listening to a while ago, just voices under the rain. And then the host says a thing. An ordinary thing. Something about how the ones who go looking are never the ones who find, or how some doors only open the once — you couldn't say exactly, after. Because for half a second it didn't land like a voice on the radio. It landed like it was meant for *you*. Specifically. And then it's just the radio again, some ad, the wipers, the road, and you couldn't repeat the line if someone asked.`,
    // The walking variant (Loom, finalized): the too-personal line drifts
    // from a passing radio instead of the dashboard — the prickle and its
    // unaccountability preserved exactly; the watcher's touch was never
    // about the car.
    qVariants: [
      {
        when: { kind: "flag", flag: "mode_walking" },
        text: `Somewhere close as you walk — a window cracked against the warm inside, or a car idling at the curb, or the open door of a bar you pass — there's a radio going, some call-in show under the rain. And the voice says a thing. An ordinary thing. Something about how the ones who go looking are never the ones who find, or how some doors only open the once — you couldn't say exactly, after. Because for half a second it didn't land like a voice from a doorway. It landed like it was meant for *you*. Specifically. And then you're past it — the rain, the walk, your own footsteps — and you couldn't repeat the line if someone asked.`,
      },
    ],
    answers: [],
  },

  // -- the affinity fork: the instinct that decides a life ------------------------
  // Weft's table, one scene per corner: the Explorer GOES TO SEE, the
  // Detective PUTS IT ON THE RECORD, the Paranormal REACHES TOWARD IT, the
  // Operative KEEPS AND MANAGES IT. Affinity answers write PROFILE keys (the
  // deal's scratch), never coordinates — disposition seats where, affinity
  // seats which corner.

  // Explorer — the thing you haven't done (v1 verbatim, v2 "unchanged").
  {
    q: `It occurs to you, somewhere on the long wet straightaway, that you haven't gone *out* anywhere in a long while. Not town-to-town. Out. You used to. There was a version of you that was always about to be somewhere with no cell signal.`,
    answers: [
      {
        label: `You could put a pack together this weekend and have everything you need.`,
        narration: `The thought lands with a small pull you weren't expecting — boots, a bag, a place on the map you've never put a boot on. You could. You actually could.`,
        profile: { affinity_explorer: true },
      },
      {
        label: `You've come to like the known streets. The city fits you now.`,
        narration: `That was a younger person's restlessness. You like knowing where the coffee is. There's no shame in it.`,
        profile: { settled_urban: true },
      },
    ],
  },

  // Detective — the video (v2, refined per Stave: this character isn't DRAWN
  // to the strange, they ASSESS the solvable — the professional's reflex).
  {
    q: `At a long light you thumb your phone awake, and a video's queued — a channel you half-follow, paused on what's plainly a crime scene: tape, cones, the flat particular light of it.`,
    answers: [
      {
        label: `You're reading it before you've hit play — the angle of the tape, what's missing from the frame, what got walked through.`,
        profile: { affinity_detective: true },
      },
      {
        label: `You thumb past it. The police never learn anything anyway.`,
        profile: { anti_institutional: true },
      },
    ],
  },

  // Paranormal — the doctor (v1, v2 "unchanged"; Static's experiencer builds
  // on exactly this scene). The withheld-unease continuation rides the reply
  // fold — the uncanny enters in the player's own withheld voice, never as
  // stated fact. [LOOM/STATIC: v1 authored this as a two-step interior; the
  // second step is carried here by the answer's reply narration. If the
  // experiencer's start wants the fuller version, it lives in that start's
  // own opening.]
  {
    q: `A flash from earlier today rides along with you: the doctor's office, the paper on the table, the specific way she'd said it — "Everything appears to be in order. Did you have any questions you wanted to ask me?"`,
    answers: [
      {
        label: `You'd said no. You always say no. But there was a thing you didn't say.`,
        narration: `The things you've been noticing. That you haven't told anyone. That you didn't have a word for and didn't want to say out loud in a doctor's office.`,
        profile: { affinity_paranormal: true },
      },
      { label: `You'd said no, and you'd meant it. Nothing to tell.` },
    ],
  },

  // Operative — the lights outside (ux_creation_police, FINALIZED; Weft's
  // keeper disposition, Dean's police-lights scene). Scrupulously mundane —
  // no uncanny, no crime-to-solve — just the small cold reflex of a person
  // who keeps things, caught in the flashing light. The keeper answer seeds
  // attune at index 0 (the pack's wiring note: toward the containing shape;
  // the orientation signal the deep ending reads — a keeper is attuned to the
  // kept thing). No lensFlavor: `clandestine` isn't live until Weft's content
  // arrives. This is a seed, not a tag.
  // [PROVISIONAL: attune +0.25 — sign and magnitude are Concordance's call.]
  {
    q: `It's late, and there's light moving on your ceiling that shouldn't be — red and blue, sliding, the color of a bad night. You go to the window. Police, down your street or the next one over, hard to say, a car or two, somebody's night coming apart in a way you can't quite make out from here. You stand a moment in the dark of your own front room, watching the light slide over the walls.`,
    answers: [
      {
        label: `Huh — wonder what that's about. Maybe you'll step out, see if anybody knows.`,
        profile: { open_read: true },                   // the reflex that trusts the world enough to walk into it
      },
      {
        label: `It's fine. They're not here for you. …They're not, are they?`,
        profile: { affinity_operative: true },          // the keeper's flinch — guilty of nothing; checks anyway
        attune: 0.25,
      },
      { label: `Probably a neighbor thing. You let the blind fall and go back to what you were doing.` },
    ],
  },
];
