// ============================================================================
// render/web/main.ts — the browser shell (Phase 1: the full game playable with
// placeholder chrome; generated art drops into these slots in Phase 2).
//
// RENDERER-SCOPED (lives under src/render/): imports nothing from the engine
// at runtime — screens and the ambient surface arrive as data from the
// app-side WebSession driver, and the one engine type used here is type-only.
// The presentation guards are honored by construction: money/energy/items are
// the "have" surface, grip renders as its felt word, the circle is names, the
// journal is percept lines — no meter, no trajectory, nowhere.
// ============================================================================

import type { WebSession, WebSave, WebScreen, WebDayAction } from "../../app/websession";
import { newExplorerSession, restoreExplorerSession } from "../../app/explorer-boot";
import "./style.css";

const SAVE_KEY = "sg2-explorer-save-v1";

// The surface tabs of the day screen, in display order. Only tabs with
// actions render; "here" is the default landing.
const TABS: { key: string; label: string }[] = [
  { key: "here", label: "Here" },
  { key: "map", label: "The Map" },
  { key: "phone", label: "The Phone" },
  { key: "home", label: "Home" },
];

let session: WebSession;
let activeTab = "here";
let journalOpen = false;

const app = document.getElementById("app")!;

// ---- persistence -----------------------------------------------------------

function loadSave(): WebSave | undefined {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as WebSave) : undefined;
  } catch {
    return undefined;
  }
}

function persist(): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(session.save()));
  } catch {
    /* storage full/blocked — the run continues unsaved */
  }
}

function newSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

function startNewGame(): void {
  localStorage.removeItem(SAVE_KEY);
  session = newExplorerSession(newSeed());
  activeTab = "here";
  journalOpen = false;
  persist();
  render();
}

function boot(): void {
  const save = loadSave();
  if (save) {
    const restored = restoreExplorerSession(save);
    if (restored) {
      session = restored;
      render();
      return;
    }
    localStorage.removeItem(SAVE_KEY);   // stale record — content moved on
  }
  startNewGame();
}

// ---- interaction -----------------------------------------------------------

function doPick(idx: number): void {
  const res = session.pick(idx);
  if (!res.ok) return;   // greyed/refused — the screen stands
  persist();
  render();
}

// ---- rendering -------------------------------------------------------------

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function render(): void {
  const scr = session.current;
  app.replaceChildren();
  const frame = el("div", "frame");
  frame.appendChild(renderHud(scr));
  const stage = el("main", "stage");
  if (journalOpen) stage.appendChild(renderJournal());
  switch (scr.kind) {
    case "day": stage.appendChild(renderDay(scr)); break;
    case "end": stage.appendChild(renderEnd(scr)); break;
    default: stage.appendChild(renderScene(scr));   // scene + creation share a shape
  }
  frame.appendChild(stage);
  app.appendChild(frame);
}

function renderHud(scr: WebScreen): HTMLElement {
  const hud = el("header", "hud");
  const s = session.surface();

  const left = el("div", "hud-left");
  left.appendChild(el("span", "hud-date", scr.dateLabel ?? (scr.kind === "creation" ? "" : `Day ${scr.day}`)));
  hud.appendChild(left);

  const mid = el("div", "hud-mid");
  if (s) {
    mid.appendChild(el("span", "hud-money", `$${s.have.money}`));
    const pips = el("span", "hud-energy");
    pips.title = "energy";
    for (let i = 0; i < s.have.energyMax; i++) {
      pips.appendChild(el("i", i < s.have.energy ? "pip on" : "pip", ""));
    }
    mid.appendChild(pips);
    mid.appendChild(el("span", `hud-grip grip-${s.grip}`, s.grip));
  }
  hud.appendChild(mid);

  const right = el("div", "hud-right");
  if (s) {
    const jbtn = el("button", "hud-btn" + (journalOpen ? " active" : ""), "What you know");
    jbtn.onclick = () => { journalOpen = !journalOpen; render(); };
    right.appendChild(jbtn);
  }
  const nbtn = el("button", "hud-btn subtle", "Start over");
  nbtn.onclick = () => { if (confirm("Abandon this run and start a new one?")) startNewGame(); };
  right.appendChild(nbtn);
  hud.appendChild(right);

  return hud;
}

function renderJournal(): HTMLElement {
  const s = session.surface();
  const panel = el("aside", "journal");
  panel.appendChild(el("h2", "panel-title", "What you know"));
  const known = s?.known ?? [];
  if (!known.length) panel.appendChild(el("p", "journal-empty", "Nothing yet worth writing down."));
  else {
    const ul = el("ul", "journal-list");
    known.forEach((line) => ul.appendChild(el("li", "", line)));
    panel.appendChild(ul);
  }
  if (s?.circle.length) {
    panel.appendChild(el("h2", "panel-title", "Your people"));
    const row = el("div", "circle-row");
    s.circle.forEach((f) => row.appendChild(el("span", "circle-chip", f.name)));
    panel.appendChild(row);
  }
  if (s?.have.items.length) {
    panel.appendChild(el("h2", "panel-title", "What you have"));
    const ul = el("ul", "journal-list");
    s.have.items.forEach((it) => ul.appendChild(el("li", "", it.label)));
    panel.appendChild(ul);
  }
  return panel;
}

function proseBlock(prose: string): HTMLElement {
  const block = el("div", "prose");
  prose.split(/\n{2,}/).forEach((para) => {
    if (!para.trim()) return;
    const p = el("p");
    para.trim().split("\n").forEach((line, li) => {
      if (li > 0) p.appendChild(document.createElement("br"));
      // The content convention: *emphasis* renders italic, never as asterisks.
      line.split(/(\*[^*\n]+\*)/).forEach((seg) => {
        if (/^\*[^*\n]+\*$/.test(seg)) p.appendChild(el("em", "", seg.slice(1, -1)));
        else if (seg) p.appendChild(document.createTextNode(seg));
      });
    });
    block.appendChild(p);
  });
  return block;
}

function renderScene(scr: WebScreen): HTMLElement {
  const card = el("section", "card scene-card");
  card.appendChild(proseBlock(scr.prose));
  const list = el("div", "choices");
  scr.options.forEach((o) => {
    const btn = el("button", "choice" + (o.available ? "" : " locked"), o.label) as HTMLButtonElement;
    if (o.available) btn.onclick = () => doPick(o.index);
    else {
      btn.disabled = true;
      if (o.lockedReason) btn.appendChild(el("span", "locked-reason", o.lockedReason));
    }
    list.appendChild(btn);
  });
  card.appendChild(list);
  return card;
}

function renderDay(scr: WebScreen): HTMLElement {
  const wrap = el("section", "day");
  // A finished scene's closing narration rides atop the day, then the date.
  wrap.appendChild(proseBlock(scr.prose));

  const actions = scr.dayActions ?? [];
  const bySurface = new Map<string, WebDayAction[]>();
  actions.forEach((a) => {
    const list = bySurface.get(a.surface) ?? [];
    list.push(a);
    bySurface.set(a.surface, list);
  });

  const tabs = TABS.filter((t) => bySurface.has(t.key));
  // Any surface the content invents beyond the known four still renders.
  for (const key of bySurface.keys()) {
    if (!tabs.some((t) => t.key === key)) tabs.push({ key, label: key });
  }
  if (tabs.length && !tabs.some((t) => t.key === activeTab)) activeTab = tabs[0].key;

  if (tabs.length > 1) {
    const bar = el("nav", "tabs");
    tabs.forEach((t) => {
      const b = el("button", "tab" + (t.key === activeTab ? " active" : ""), t.label);
      b.onclick = () => { activeTab = t.key; render(); };
      bar.appendChild(b);
    });
    wrap.appendChild(bar);
  }

  const panel = el("div", `surface-panel surface-${tabs.length ? activeTab : "here"}`);
  const shown = bySurface.get(activeTab) ?? actions;
  shown.forEach((a) => {
    const btn = el("button", "action" + (a.available ? "" : " locked"), a.label) as HTMLButtonElement;
    // the energy price, shown so the player can budget (Dean's ruling) — a
    // separate chip, never folded into the diegetic label
    if (a.cost != null) btn.appendChild(el("span", "action-cost", `${a.cost} energy`));
    if (a.available) btn.onclick = () => doPick(a.index);
    else {
      btn.disabled = true;
      if (a.lockedReason) btn.appendChild(el("span", "locked-reason", a.lockedReason));
    }
    panel.appendChild(btn);
  });
  if (!shown.length) panel.appendChild(el("p", "surface-empty", "Nothing calls for you here today."));
  wrap.appendChild(panel);

  const endBtn = el("button", "end-day", "Call it a day.");
  endBtn.onclick = () => doPick(scr.endIndex!);
  wrap.appendChild(endBtn);

  return wrap;
}

function renderEnd(scr: WebScreen): HTMLElement {
  const card = el("section", "card end-card");
  card.appendChild(proseBlock(scr.prose));
  const btn = el("button", "choice", "Begin again.");
  btn.onclick = () => startNewGame();
  card.appendChild(btn);
  return card;
}

boot();
