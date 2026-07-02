// ============================================================================
// calendar.ts — a thin date model over GameState.day (the canonical season-day
// counter). Week and weekday are DERIVED from g.day (single source of truth, so
// they can never desync), kept here so the UI can render "where you are in time"
// and so this is easy to extend toward a real season later.
// ============================================================================
export const DAYS_PER_WEEK = 7;
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface GameDate {
  day: number;          // absolute season-day (== GameState.day)
  week: number;         // 1-based week number
  weekdayIndex: number; // 0..6
  weekday: string;      // e.g. "Thu"
  label: string;        // e.g. "Week 2 · Thu"
}

export function dateOf(day: number): GameDate {
  const d = Math.max(1, Math.floor(day));
  const week = Math.floor((d - 1) / DAYS_PER_WEEK) + 1;
  const weekdayIndex = (d - 1) % DAYS_PER_WEEK;
  const weekday = WEEKDAYS[weekdayIndex];
  return { day: d, week, weekdayIndex, weekday, label: `Week ${week} · ${weekday}` };
}
