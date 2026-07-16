// ============================================================================
// app/explorer-boot.ts — the app-side bootstrap for the Explorer campaign.
// Owns the ContentDB and the start seat so the renderer never touches either:
// a renderer-scoped file asks this module for a session and receives only
// WebScreen / Surface data ever after. (The ContentDB carries the events'
// coordinate metadata — legal for app code, but nothing a renderer should
// even hold a reference to.)
// ============================================================================

import { explorerDb } from "../content/explorer";
import { WebSession } from "./websession";
import type { WebSave } from "./websession";

const START = { tier: "outer" as const, townId: "town_edge" };

export function newExplorerSession(seed: number): WebSession {
  return new WebSession(explorerDb, { ...START, seed });
}

export function restoreExplorerSession(save: WebSave): WebSession | undefined {
  return WebSession.restore(explorerDb, START, save);
}
