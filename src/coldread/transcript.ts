// ============================================================================
// coldread/transcript.ts — the trivial renderer: the canonical typed stream ->
// human-readable markdown, for burned team members to eyeball. Presentation +
// reader are the reader-facing flow; the compact `> trace:` line is an analyst
// annotation (the reader never saw it). Telemetry consumes the raw stream
// directly and ignores this renderer.
// ============================================================================

import type { Stream, StreamRecord } from "./recorder";

export function transcriptFilename(contentId: string, buildTag: string, seed: number, readerLabel: string): string {
  return `coldread_${contentId}_${buildTag}_${seed}_${readerLabel}.md`;
}

function fmtDeltas(d: Record<string, number>): string {
  const keys = Object.keys(d);
  if (!keys.length) return "—";
  return keys.map((k) => `${k} ${d[k] >= 0 ? "+" : ""}${d[k]}`).join(", ");
}
function fmtFlags(f: Record<string, boolean | number | string>): string {
  const keys = Object.keys(f);
  if (!keys.length) return "—";
  return keys.map((k) => `${k}=${f[k]}`).join(", ");
}

function renderStep(recs: StreamRecord[]): string {
  const out: string[] = [];
  const pres = recs.find((r) => r.type === "presentation");
  const reader = recs.find((r) => r.type === "reader");
  const trace = recs.find((r) => r.type === "trace");

  if (pres && pres.type === "presentation") {
    if (pres.card === "__end__") {
      out.push(`## — end of scene —\n`);
      if (pres.prose) out.push(pres.prose + "\n");
      return out.join("\n");
    }
    out.push(`## Step ${pres.step} — \`${pres.card}\`\n`);
    out.push(pres.prose + "\n");
    if (pres.options.length) {
      out.push("Options:");
      // Lock STYLE is provenance, not decoration (Vigil, ratified). The label the author
      // wrote carries the grammar: structural locks read as greyed readable labels;
      // grip-illegible options are ▓▓ blocks (you can't read what they'd say); inserted
      // options (far future) get a distinct silhouette/? costume. The renderer only marks
      // availability — it never restyles the label, so the three provenances never blur.
      // Numbers are POSITIONS in the presented list — exactly what the reader
      // saw (options carry engine indices, and hidden-locked choices are
      // absent, so index and position can diverge).
      pres.options.forEach((o, pos) => {
        out.push(`${pos + 1}. ${o.label}${o.available ? "" : o.lockedReason ? `  — *${o.lockedReason}*` : "  *(unavailable)*"}`);
      });
      out.push("");
    }
  }
  if (reader && reader.type === "reader") {
    out.push(`**Reader:** ${reader.note || "_(no note)_"}`);
    // reader.pick is the engine index; render the POSITION the reader typed.
    const pos = pres && pres.type === "presentation"
      ? pres.options.findIndex((o) => o.index === reader.pick) : -1;
    out.push(`**Picked:** ${pos >= 0 ? pos + 1 : reader.pick + 1}. ${reader.pickLabel}\n`);
  }
  if (trace && trace.type === "trace") {
    const roll = trace.roll
      ? ` · roll ${trace.roll.tag} d20 ${trace.roll.die}${trace.roll.mod >= 0 ? "+" : ""}${trace.roll.mod}=${trace.roll.total} vs ${trace.roll.target} → ${trace.roll.success ? "WIN" : "LOSE"}`
      : "";
    out.push(`> trace: day ${trace.day} · stats ${fmtDeltas(trace.statDeltas)} · flags ${fmtFlags(trace.flagsChanged)}${roll}\n`);
  }
  return out.join("\n");
}

export function renderTranscript(stream: Stream): string {
  const { stamp, records } = stream;
  const out: string[] = [];
  out.push(`# Cold read — ${stamp.contentId} · build \`${stamp.buildTag}\` · seed ${stamp.seed}`);
  out.push(`*schema v${stamp.schemaVersion} · reader-facing prose + numbered options; \`> trace\` lines are analyst-only (never shown to the reader)*\n`);

  // Group consecutive records by step (presentation opens a step; reader/trace attach).
  let bucket: StreamRecord[] = [];
  const flush = () => { if (bucket.length) { out.push(renderStep(bucket)); bucket = []; } };
  for (const r of records) {
    if (r.type === "debrief") {
      flush();
      out.push(`## Debrief\n`);
      r.qa.forEach((qa, i) => { out.push(`**Q${i + 1}.** ${qa.q}`); out.push(`${qa.a || "_(unanswered)_"}\n`); });
      if (r.operatorNotes) out.push(`_Operator notes: ${r.operatorNotes}_\n`);
      continue;
    }
    if (r.type === "presentation") flush();
    bucket.push(r);
  }
  flush();
  return out.join("\n");
}
