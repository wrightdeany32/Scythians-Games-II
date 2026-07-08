// ============================================================================
// tools/lint.run.ts — the linter's runner: lints every ContentDB in the repo,
// prints the findings, exits 1 on any error (warnings inform, never fail).
// Run: npm run lint:content
// New content dbs register themselves in the TARGETS list as they land.
// ============================================================================

import { caveDb } from "../content/cave.db";
import { explorerDb } from "../content/explorer";
import { db as smokeDb } from "../smoke/content";
import { loopDb } from "../smoke/loopworld";
import { lintContent } from "./lint";
import type { ContentDB } from "../engine/types";

const TARGETS: [string, ContentDB][] = [
  ["cave", caveDb],
  ["explorer", explorerDb],
  ["smoke", smokeDb],
  ["loopworld", loopDb],
];

let errors = 0;
let warnings = 0;
for (const [label, db] of TARGETS) {
  const issues = lintContent(db, label);
  for (const i of issues) {
    if (i.level === "error") errors++;
    else warnings++;
    console.log(`  ${i.level === "error" ? "ERROR" : "warn "}  ${i.where} — ${i.message}`);
  }
}

console.log(`\nlint:content — ${TARGETS.length} dbs, ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exit(1);
