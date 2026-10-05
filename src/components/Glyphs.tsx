import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

// Faint tech/AI symbols scattered through each section (decorative, aria-hidden).
// Each one bobs gently and drifts at its own speed while scrolling (parallax).

const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontWeight: 600 } as const;
const txt = (t: string, size = 18) => (
  <text x="24" y="24" dominantBaseline="central" textAnchor="middle" fontSize={size} fill="currentColor" stroke="none" style={mono}>
    {t}
  </text>
);

// 48×48 outline drawings
const art: Record<string, ReactNode> = {
  code: <path d="M18 14 8 24l10 10M30 14l10 10-10 10M27 10l-6 28" />,
  braces: txt("{ }", 20),
  lambda: txt("λ", 26),
  arrow: txt("=>", 18),
  hash: txt("#", 24),
  sigma: txt("Σ", 26),
  sql: txt("SQL", 14),
  version: txt("v1.0", 13),
  binary: txt("0101", 12),
  matrix: txt("[ ]", 20),
  terminal: (
    <>
      <rect x="6" y="10" width="36" height="28" rx="4" />
      <path d="M6 17h36M13 25l4 3-4 3M21 31h8" />
    </>
  ),
  cursor: <path d="M14 10v28l8-8 5 11 4-2-5-11h11L14 10Z" />,
  bars: <path d="M10 38V26m9 12V16m9 22V22m9 16V10M6 38h36" />,
  line: (
    <>
      <path d="M6 36l9-10 8 5 9-14 10 6" />
      <circle cx="15" cy="26" r="1.8" fill="currentColor" />
      <circle cx="23" cy="31" r="1.8" fill="currentColor" />
      <circle cx="32" cy="17" r="1.8" fill="currentColor" />
    </>
  ),
  scatter: (
    <>
      <path d="M8 38 40 12" strokeDasharray="3 3" />
      {[
        [12, 32],
        [17, 29],
        [20, 33],
        [25, 24],
        [29, 25],
        [33, 18],
        [37, 19],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="currentColor" stroke="none" />
      ))}
    </>
  ),
  neural: (() => {
    const layers = [
      [
        [10, 16],
        [10, 32],
      ],
      [
        [24, 9],
        [24, 24],
        [24, 39],
      ],
      [[38, 24]],
    ];
    const links = layers.slice(1).flatMap((layer, li) =>
      layer.flatMap(([x2, y2]) => layers[li].map(([x1, y1]) => `M${x1} ${y1}L${x2} ${y2}`)),
    );
    return (
      <>
        <path d={links.join("")} opacity="0.6" />
        {layers.flat().map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="var(--paper)" />
        ))}
      </>
    );
  })(),
  database: (
    <>
      <ellipse cx="24" cy="12" rx="13" ry="5" />
      <path d="M11 12v24c0 2.8 5.8 5 13 5s13-2.2 13-5V12M11 24c0 2.8 5.8 5 13 5s13-2.2 13-5" />
    </>
  ),
  branch: (
    <>
      <path d="M14 8v32M14 30c0-8 20-6 20-16" />
      <circle cx="14" cy="8" r="3" fill="var(--paper)" />
      <circle cx="14" cy="40" r="3" fill="var(--paper)" />
      <circle cx="34" cy="12" r="3" fill="var(--paper)" />
    </>
  ),
  flag: <path d="M12 42V8m0 2h22l-5 7 5 7H12" />,
  check: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="m17 24 5 5 9-10" />
    </>
  ),
  pin: (
    <>
      <path d="M24 42s-12-10.5-12-19a12 12 0 0 1 24 0c0 8.5-12 19-12 19Z" />
      <circle cx="24" cy="23" r="4" />
    </>
  ),
  cloud: <path d="M14 34a8 8 0 0 1-1-15.9A11 11 0 0 1 34 16a9 9 0 0 1 1 18H14Z" />,
  sparkle: <path d="M24 6c1.5 9 4 11.5 13 13-9 1.5-11.5 4-13 13-1.5-9-4-11.5-13-13 9-1.5 11.5-4 13-13Z" />,
  chip: (
    <>
      <rect x="14" y="14" width="20" height="20" rx="3" />
      <path d="M19 14V8m5 6V8m5 6V8M19 40v-6m5 6v-6m5 6v-6M14 19H8m6 5H8m6 5H8M40 19h-6m6 5h-6m6 5h-6" />
    </>
  ),
};

type Tone = "faint" | "accent" | "blue" | "violet";
const toneClass: Record<Tone, string> = {
  faint: "text-ink-faint opacity-[0.38]",
  accent: "text-accent opacity-[0.45]",
  blue: "text-y2024 opacity-[0.45]",
  violet: "text-y2026 opacity-[0.45]",
};

interface Item {
  g: keyof typeof art;
  top: string;
  left?: string;
  right?: string;
  size: number;
  tone: Tone;
  rot?: number;
  /** parallax drift in px across the section (negative = moves up faster) */
  drift: number;
  /** keep visible on phones */
  mobile?: boolean;
}

export const glyphSets: Record<"hero" | "about" | "skills" | "journey", Item[]> = {
  hero: [
    { g: "braces", top: "14%", left: "3%", size: 44, tone: "faint", rot: -8, drift: -50 },
    { g: "cursor", top: "78%", left: "40%", size: 30, tone: "blue", rot: -12, drift: -30 },
    { g: "sparkle", top: "20%", right: "36%", size: 26, tone: "violet", drift: -70, mobile: true },
  ],
  about: [
    { g: "code", top: "6%", right: "6%", size: 56, tone: "accent", rot: 6, drift: -60, mobile: true },
    { g: "lambda", top: "12%", right: "24%", size: 40, tone: "violet", rot: -10, drift: -30 },
    { g: "terminal", top: "64%", left: "1.5%", size: 54, tone: "faint", rot: -6, drift: 40 },
    { g: "arrow", top: "30%", left: "2%", size: 42, tone: "blue", drift: -40 },
    { g: "hash", top: "90%", right: "8%", size: 38, tone: "faint", rot: 12, drift: 30 },
    { g: "binary", top: "86%", right: "30%", size: 54, tone: "accent", drift: -20 },
  ],
  skills: [
    { g: "bars", top: "5%", right: "8%", size: 58, tone: "accent", drift: -50, mobile: true },
    { g: "neural", top: "3%", right: "28%", size: 60, tone: "violet", rot: -4, drift: -80 },
    { g: "sigma", top: "26%", left: "2%", size: 42, tone: "faint", rot: -8, drift: -30 },
    { g: "database", top: "48%", right: "1.5%", size: 50, tone: "blue", drift: 50 },
    { g: "scatter", top: "64%", left: "1.5%", size: 56, tone: "accent", drift: -40 },
    { g: "sql", top: "84%", right: "3%", size: 52, tone: "violet", rot: 8, drift: -30 },
    { g: "line", top: "94%", left: "38%", size: 56, tone: "blue", drift: 30 },
    { g: "matrix", top: "40%", left: "3%", size: 40, tone: "violet", drift: 60 },
    { g: "chip", top: "96%", right: "22%", size: 58, tone: "faint", rot: 10, drift: -50 },
  ],
  journey: [
    { g: "branch", top: "8%", right: "8%", size: 58, tone: "accent", drift: -50, mobile: true },
    { g: "flag", top: "14%", right: "26%", size: 44, tone: "violet", rot: 6, drift: -30 },
    { g: "version", top: "50%", left: "2%", size: 54, tone: "blue", rot: -8, drift: -40 },
    { g: "check", top: "72%", right: "3%", size: 46, tone: "accent", drift: 40 },
    { g: "pin", top: "30%", left: "3%", size: 42, tone: "faint", drift: 30 },
    { g: "cloud", top: "88%", left: "12%", size: 52, tone: "blue", drift: -30 },
  ],
};

function Glyph({ item, progress, still, index }: { item: Item; progress: MotionValue<number>; still: boolean; index: number }) {
  const y = useTransform(progress, [0, 1], still ? [0, 0] : [item.drift, -item.drift]);
  return (
    <m.div
      className={`absolute ${item.mobile ? "" : "hidden lg:block"}`}
      style={{ top: item.top, left: item.left, right: item.right, y }}
    >
      <div
        className={`glyph-bob ${toneClass[item.tone]}`}
        style={{ rotate: `${item.rot ?? 0}deg`, animationDelay: `${-index * 1.7}s`, animationDuration: `${7 + (index % 4)}s` }}
      >
        <svg
          viewBox="0 0 48 48"
          width={item.size}
          height={item.size}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {art[item.g]}
        </svg>
      </div>
    </m.div>
  );
}

export function Glyphs({ set }: { set: keyof typeof glyphSets }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {glyphSets[set].map((item, i) => (
        <Glyph key={item.g + item.top} item={item} progress={scrollYProgress} still={still} index={i} />
      ))}
    </div>
  );
}
