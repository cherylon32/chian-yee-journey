// Explore Mode extras: the Skills Tree, day/night lighting, the skills list
// and the hidden retro Snake game.

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data/profile";
import type { FullScene } from "./scenes";
import { useDialog } from "./ui";

/* ── Skills Tree: badges hang on the tree, drop one by one and stack up ── */

export const TREE = { x: 1000, y: 1000 };
const G = 1600; // gravity, px/s²
const CHIP_W = 98;
const CHIP_H = 22;
export const groupColor: Record<string, string> = { Product: "#1f6f5c", "Data & ML": "#3a7fb0", Tools: "#6b5fb5" };

type Phase = "hang" | "fall" | "land";
interface Chip {
  phase: Phase;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
}

function pileSlots(n: number) {
  // a little pyramid in front of the trunk, bottom row first
  let rows = 1;
  while ((rows * (rows + 1)) / 2 < n) rows++;
  const slots: { x: number; y: number }[] = [];
  for (let r = 0; r < rows && slots.length < n; r++) {
    const count = rows - r;
    for (let i = 0; i < count && slots.length < n; i++) {
      slots.push({ x: TREE.x + (i - (count - 1) / 2) * (CHIP_W + 2), y: TREE.y + 76 - r * (CHIP_H + 1) });
    }
  }
  return slots;
}

function hangSpots(n: number) {
  // spread around the canopy (deterministic)
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.4;
    const ring = i % 2 ? 0.5 : 0.95;
    return { x: TREE.x + Math.cos(a) * 100 * ring, y: TREE.y - 150 + Math.sin(a) * 70 * ring };
  });
}

export function SkillsTree({ shake }: { shake: number }) {
  const skills = profile.treeSkills;
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const hang = useMemo(() => hangSpots(skills.length), [skills.length]);
  const slots = useMemo(() => pileSlots(skills.length), [skills.length]);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const chips = useRef<Chip[]>(hang.map((h) => ({ phase: "hang", x: h.x, y: h.y, vx: 0, vy: 0, tx: 0, ty: 0 })));
  const next = useRef(0);
  const [cycle, setCycle] = useState(0); // bumps when the tree regrows

  const place = (i: number) => {
    const c = chips.current[i];
    const el = els.current[i];
    if (!el) return;
    el.style.transform = `translate3d(${c.x - CHIP_W / 2}px, ${c.y - CHIP_H}px, 0)`;
    el.style.zIndex = String(c.phase === "hang" ? TREE.y + 1 : TREE.y + 100 + i);
    el.dataset.phase = c.phase;
  };

  const drop = (i: number) => {
    const c = chips.current[i];
    if (c.phase !== "hang") return;
    const slot = slots[next.current++];
    c.tx = slot.x;
    c.ty = slot.y;
    if (reduced) {
      Object.assign(c, { phase: "land", x: slot.x, y: slot.y });
      place(i);
      return;
    }
    const t = Math.sqrt((2 * Math.max(10, slot.y - c.y)) / G);
    Object.assign(c, { phase: "fall", vx: (slot.x - c.x) / t, vy: 0 });
    els.current[i]?.querySelector(".chip-hang")?.classList.remove("chip-hang");
  };

  // physics loop for falling chips
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      chips.current.forEach((c, i) => {
        if (c.phase !== "fall") return;
        c.vy += G * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.y >= c.ty) {
          Object.assign(c, { phase: "land", x: c.tx, y: c.ty });
          const inner = els.current[i]?.querySelector(".chip-badge");
          inner?.classList.remove("chip-land");
          void (inner as HTMLElement | undefined)?.offsetWidth; // restart the bounce
          inner?.classList.add("chip-land");
        }
        place(i);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    chips.current.forEach((_, i) => place(i));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  // ambient: one badge drops every few seconds; when all have fallen, the tree regrows them
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      const hanging = chips.current.map((c, i) => (c.phase === "hang" ? i : -1)).filter((i) => i >= 0);
      if (hanging.length) drop(hanging[Math.floor(Math.random() * hanging.length)]);
      else if (chips.current.every((c) => c.phase === "land")) {
        chips.current = hang.map((h) => ({ phase: "hang", x: h.x, y: h.y, vx: 0, vy: 0, tx: 0, ty: 0 }));
        next.current = 0;
        setCycle((n) => n + 1);
      }
    }, 2600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, hang]);

  // shaking the tree drops everything that's still hanging
  useEffect(() => {
    if (!shake) return;
    chips.current.forEach((c, i) => c.phase === "hang" && setTimeout(() => drop(i), (i % 6) * 90 + Math.random() * 120));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shake]);

  return (
    <>
      {skills.map((s, i) => (
        <div
          key={`${cycle}-${s.label}`}
          ref={(el) => {
            els.current[i] = el;
          }}
          data-phase={chips.current[i].phase}
          className="group pointer-events-none absolute top-0 left-0 flex items-end justify-center"
          style={{ width: CHIP_W, height: CHIP_H }}
          aria-hidden
        >
          {/* on the tree: a round "fruit" with a short tag */}
          <div
            className={`grid size-[30px] shrink-0 place-items-center rounded-full border-2 bg-white text-[10px] font-bold text-ink shadow-soft group-data-[phase=land]:hidden ${
              chips.current[i].phase === "hang" ? "chip-hang" : ""
            }`}
            style={{ borderColor: groupColor[s.group], animationDelay: `${i * 0.05}s, ${0.6 + (i % 5) * -0.6}s` }}
          >
            {s.short}
          </div>
          {/* on the pile: the full badge */}
          <div className="chip-badge hidden h-full w-full items-center gap-1.5 rounded-full border border-white/80 bg-white px-2.5 text-[11px] font-semibold whitespace-nowrap text-ink shadow-soft group-data-[phase=land]:flex">
            <span className="size-2 shrink-0 rounded-full" style={{ background: groupColor[s.group] }} />
            {s.label}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── day / night ── */

export type Light = "day" | "dusk" | "night";
export type LightSetting = "auto" | Light;

export function lightFromClock(d = new Date()): Light {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 20 || h < 6) return "night";
  if ((h >= 17.5 && h < 20) || (h >= 6 && h < 7.5)) return "dusk";
  return "day";
}

export function useLight(setting: LightSetting): Light {
  const [clock, setClock] = useState(lightFromClock);
  useEffect(() => {
    const t = setInterval(() => setClock(lightFromClock()), 60_000);
    return () => clearInterval(t);
  }, []);
  return setting === "auto" ? clock : setting;
}

/** Tint + glowing lamps/windows, drawn inside the world so it moves with the camera. */
export function Lighting({ light, scene }: { light: Light; scene: FullScene }) {
  if (light === "day") return null;
  const night = light === "night";
  const indoor = !!scene.year;
  const tint = indoor
    ? night
      ? "rgb(70 80 130 / 0.16)"
      : "rgb(255 190 140 / 0.10)"
    : night
      ? "rgb(48 60 118 / 0.52)"
      : "rgb(255 168 112 / 0.24)";
  return (
    <>
      {/* oversized so it also tints anything visible around the scene's edges */}
      <div className="pointer-events-none absolute -inset-[3000px]" style={{ background: tint, mixBlendMode: "multiply", zIndex: 99990 }} />
      {(scene.windows ?? []).map((w, i) => (
        <div
          key={`w${i}`}
          className="pointer-events-none absolute rounded-md"
          style={{ left: w.x, top: w.y, width: w.w, height: w.h, background: "rgb(255 214 150 / 0.45)", mixBlendMode: "screen", opacity: night ? 1 : 0.5, zIndex: 99991 }}
        />
      ))}
      {(scene.lights ?? []).map((l, i) => (
        <div
          key={`l${i}`}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: l.x - l.r,
            top: l.y - l.r,
            width: l.r * 2,
            height: l.r * 2,
            background: "radial-gradient(closest-side, rgb(255 222 160 / 0.75), rgb(255 200 120 / 0.25) 55%, transparent)",
            mixBlendMode: "screen",
            opacity: night ? 1 : 0.55,
            zIndex: 99992,
          }}
        />
      ))}
    </>
  );
}

/* ── skills list (from the tree) ── */

export function SkillsPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ink/25" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="skills-title" tabIndex={-1} className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-lift outline-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="skills-title" className="text-xl font-semibold">
              My Skills Tree
            </h2>
            <p className="mt-1 text-sm text-ink-soft">Everything in my toolbox, grouped.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-icon shrink-0" aria-label="Close">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {profile.skills.map((g) => (
            <section key={g.group}>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="size-2.5 rounded-full" style={{ background: groupColor[g.group] }} />
                {g.group}
              </h3>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li key={s} className="chip !text-xs">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── hidden retro console: a tiny game of Snake ── */

const N = 16;
const CELL = 18;
type P = { x: number; y: number };

export function RetroGame({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pad = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useDialog(ref, onClose);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<"ready" | "play" | "over">("ready");
  const game = useRef({ snake: [{ x: 7, y: 8 }] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 11, y: 8 } as P });

  const steer = (x: number, y: number) => {
    const g = game.current;
    if (g.dir.x === -x && g.dir.y === -y) return;
    g.next = { x, y };
    setStatus((s) => (s === "ready" ? "play" : s));
  };
  const restart = () => {
    game.current = { snake: [{ x: 7, y: 8 }], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 11, y: 8 } };
    setScore(0);
    setStatus("ready");
  };

  // keyboard (native listener so it runs before the dialog's key handling)
  useEffect(() => {
    const el = pad.current!;
    const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] };
    const onKey = (e: KeyboardEvent) => {
      if (dirs[e.code]) {
        e.preventDefault();
        steer(...dirs[e.code]);
      } else if (e.code === "Space" && status === "over") {
        e.preventDefault();
        restart();
      }
    };
    el.addEventListener("keydown", onKey);
    el.focus();
    return () => el.removeEventListener("keydown", onKey);
  }, [status]);

  // game loop + drawing
  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    const draw = () => {
      const g = game.current;
      ctx.fillStyle = "#1d2b23";
      ctx.fillRect(0, 0, N * CELL, N * CELL);
      ctx.fillStyle = "rgba(155,227,165,0.06)";
      for (let i = 0; i < N; i++) for (let j = (i % 2); j < N; j += 2) ctx.fillRect(i * CELL, j * CELL, CELL, CELL);
      ctx.fillStyle = "#f4a29a";
      ctx.fillRect(g.food.x * CELL + 4, g.food.y * CELL + 4, CELL - 8, CELL - 8);
      g.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#d9f7dc" : "#9be3a5";
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
    };
    draw();
    if (status !== "play") return;
    const t = setInterval(() => {
      const g = game.current;
      g.dir = g.next;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || g.snake.some((s) => s.x === head.x && s.y === head.y)) {
        setStatus("over");
        setBest((b) => Math.max(b, g.snake.length - 1));
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        setScore(g.snake.length - 1);
        do g.food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        while (g.snake.some((s) => s.x === g.food.x && s.y === g.food.y));
      } else g.snake.pop();
      draw();
    }, 120);
    return () => clearInterval(t);
  }, [status]);

  const btn = "grid size-11 place-items-center rounded-lg bg-[#3b4a40] text-[#d9f7dc] active:bg-[#4d5f52]";
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="retro-title" tabIndex={-1} className="relative rounded-3xl border-4 border-[#958670] bg-[#b9a993] p-5 shadow-lift outline-none">
        <div className="flex items-center justify-between gap-6">
          <h2 id="retro-title" className="font-mono text-sm font-bold tracking-widest text-[#3b3328] uppercase">
            Cheryl's retro corner
          </h2>
          <button type="button" onClick={onClose} className="rounded-md bg-[#3b3328] px-2.5 py-1 font-mono text-xs font-bold text-[#efe6d6]">
            ESC
          </button>
        </div>
        <div ref={pad} tabIndex={0} aria-label="Snake game. Use the arrow keys to steer." className="relative mt-3 rounded-xl bg-[#1d2b23] p-2 outline-none focus-visible:ring-2 focus-visible:ring-[#9be3a5]">
          <canvas ref={canvas} width={N * CELL} height={N * CELL} className="block max-w-full" style={{ width: N * CELL }} />
          {status !== "play" && (
            <div className="absolute inset-0 grid place-items-center text-center font-mono text-[#d9f7dc]">
              <div className="rounded-lg bg-[#1d2b23]/85 px-4 py-3">
                <p className="text-sm font-bold">{status === "over" ? "GAME OVER" : "SNAKE"}</p>
                <p className="mt-1 text-xs opacity-80">{status === "over" ? "Press Space or tap ↻" : "Press an arrow key to start"}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-xs font-bold text-[#3b3328]">
          <span>SCORE {String(score).padStart(3, "0")}</span>
          <span>BEST {String(Math.max(best, score)).padStart(3, "0")}</span>
        </div>
        {/* on-screen pad for touch */}
        <div className="mt-3 grid grid-cols-3 justify-items-center gap-1.5 sm:hidden">
          <span />
          <button type="button" className={btn} aria-label="Up" onClick={() => steer(0, -1)}>▲</button>
          <span />
          <button type="button" className={btn} aria-label="Left" onClick={() => steer(-1, 0)}>◀</button>
          <button type="button" className={btn} aria-label="Restart" onClick={restart}>↻</button>
          <button type="button" className={btn} aria-label="Right" onClick={() => steer(1, 0)}>▶</button>
          <span />
          <button type="button" className={btn} aria-label="Down" onClick={() => steer(0, 1)}>▼</button>
          <span />
        </div>
      </div>
    </div>
  );
}
