// ============================================================================
// coldread/scripts.ts — the Cold Reader Protocol operator scripts (pack v0.1
// §2/§3), verbatim and locked. Operators copy-paste; nobody improvises — the
// scripts are the firewall that lets a compass-burned operator run a read
// without contaminating it. Embedded here so a session surfaces them inline.
// ============================================================================

export const FRAMING_SCRIPT =
`You're going to play a short interactive story. Play it however feels natural — there are no right answers. After each passage, before you choose, tell me briefly: what do you make of what's happening, and why are you picking what you're picking? Then give the number of your choice.`;

// Used verbatim if the reader asks the operator anything ("is this horror?" etc.). Log the question.
export const LOCKED_NON_ANSWER = `Whatever you make of it is fine — just keep going.`;

// One nudge, usable once per session, if the reader goes minimal/silent.
export const SINGLE_NUDGE = `What's your read on where things stand?`;

// Neutral locked-option wording (Azimuth's proposal). Loom's final string swaps in later (§5 open item).
export const LOCKED_OPTION_MARKER = `(unavailable)`;
export const LOCKED_OPTION_REFUSAL = `That option isn't available.`;

// The debrief instrument (§3) — fixed order, verbatim, asked one at a time after the session ends.
// This is the SCENE-READ list (v0.2, unchanged): Q6 is "what would you do next"
// because a scene read ends mid-life. Run Reads use RUN_DEBRIEF_QUESTIONS below.
export const DEBRIEF_QUESTIONS: string[] = [
  `In a few sentences — what story do you think you just played?`,
  `What kind of story would you call it? And when did you first start thinking of it that way?`,
  `Was there a moment that stuck with you most? What was it, and what do you think was going on there?`,
  `Some things may not have been fully explained. What do you believe was actually happening — your best theory, even if you're unsure? And how confident are you: not at all, somewhat, quite, or very?`,
  `Was there anything you noticed that you couldn't quite account for — something small that didn't fit?`,
  `If you could keep playing, what would you do next, and why?`,
  `Last one — did anything about the experience itself, the way choices appeared or behaved, strike you as unusual?`,
];

// The RUN-SCALE debrief (Protocol pack v0.3 §3, active per Azimuth's 07-11
// ruling): Q1–Q5 carry; Q6 becomes the REPLAY question (the replay-pull metric
// the cross-run design bets on); Q7 stays last. The PER-THREAD WALK-BACK sits
// between Q3 and Q4 and is deliberately NOT a constant — the operator names
// each thread in the READER'S OWN WORDS ("the aunt," "the man on the porch"):
//   "Tell me about ___ — what was going on there, and how did it end up?"
// Silent-mode runs insert the per-choice walk-back there too, keyed to the
// trace's decision points.
export const RUN_DEBRIEF_QUESTIONS: string[] = [
  DEBRIEF_QUESTIONS[0],
  DEBRIEF_QUESTIONS[1],
  DEBRIEF_QUESTIONS[2],
  DEBRIEF_QUESTIONS[3],
  DEBRIEF_QUESTIONS[4],
  `If you played again from the start, what would you do differently, and why?`,
  DEBRIEF_QUESTIONS[6],
];

// Two-vessel chained reads ONLY, dead last after everything above — the
// lightest possible probe for collision-noticing; anything heavier plants it.
export const VESSEL_QUESTION = `Anything about this story feel connected to anything outside it?`;
