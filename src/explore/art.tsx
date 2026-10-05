// Flat, muted SVG art for Explore Mode. Every piece is original.
// Props are drawn in their own little box with the "feet" at the bottom edge,
// so the engine can depth-sort them against the player by their baseline.

import type { ReactNode } from "react";
import { Icon } from "../components/icons";

export const C = {
  grass: "#d6e8cd",
  grassDeep: "#c4ddb9",
  tuft: "#b7d4aa",
  path: "#e8eff4",
  pathEdge: "#cfdbe5",
  road: "#5f6771",
  roadLine: "#eef0ee",
  sidewalk: "#efe9dd",
  floor: "#f7f5f0",
  wood: "#e6cfad",
  woodDark: "#c9a880",
  woodFloor: "#efe5d5",
  plank: "#e6d8c4",
  wall: "#f5f2ec",
  wallFace: "#edf1f4",
  line: "#d3dbe3",
  glass: "rgba(206, 226, 242, 0.5)",
  trunk: "#9d7c5e",
  leaf1: "#9fcd9b",
  leaf2: "#88bf89",
  leaf3: "#b9dcb2",
  metal: "#c5ced7",
  screen: "#2c3a4d",
  pot: "#d8a891",
  shadow: "rgba(30, 40, 50, 0.08)",
};

/* ── props (drawn in a w×h box, baseline at the bottom) ── */

export interface PropArt {
  w: number;
  h: number;
  node: ReactNode;
}

export const tree = (): PropArt => ({
  w: 240,
  h: 280,
  node: (
    <>
      <ellipse cx="120" cy="268" rx="92" ry="13" fill={C.shadow} />
      <path d="M110 268 L113 180 L127 180 L130 268 Z" fill={C.trunk} />
      <path d="M120 200 L100 172 M120 210 L144 180" stroke={C.trunk} strokeWidth="7" strokeLinecap="round" />
      <circle cx="120" cy="118" r="96" fill={C.leaf2} />
      <circle cx="70" cy="150" r="58" fill={C.leaf1} />
      <circle cx="172" cy="148" r="60" fill={C.leaf1} />
      <circle cx="104" cy="72" r="54" fill={C.leaf3} opacity="0.75" />
      <circle cx="150" cy="96" r="30" fill={C.leaf3} opacity="0.5" />
    </>
  ),
});

export const smallTree = (): PropArt => ({
  w: 120,
  h: 150,
  node: (
    <>
      <ellipse cx="60" cy="142" rx="44" ry="7" fill={C.shadow} />
      <rect x="55" y="96" width="10" height="46" rx="3" fill={C.trunk} />
      <circle cx="60" cy="64" r="46" fill={C.leaf2} />
      <circle cx="44" cy="48" r="24" fill={C.leaf3} opacity="0.7" />
    </>
  ),
});

export const bench = (): PropArt => ({
  w: 96,
  h: 54,
  node: (
    <>
      <ellipse cx="48" cy="50" rx="44" ry="5" fill={C.shadow} />
      <rect x="8" y="6" width="80" height="12" rx="3" fill={C.woodDark} />
      <rect x="4" y="22" width="88" height="16" rx="3" fill={C.wood} stroke={C.woodDark} strokeWidth="1.5" />
      <path d="M14 38v10M82 38v10" stroke="#8a96a3" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
});

export const lamp = (): PropArt => ({
  w: 30,
  h: 120,
  node: (
    <>
      <ellipse cx="15" cy="116" rx="11" ry="3.5" fill={C.shadow} />
      <rect x="12.5" y="18" width="5" height="98" rx="2" fill="#8a96a3" />
      <rect x="4" y="6" width="22" height="16" rx="5" fill="#fff8e1" stroke="#8a96a3" strokeWidth="2" />
    </>
  ),
});

export const bush = (): PropArt => ({
  w: 80,
  h: 50,
  node: (
    <>
      <ellipse cx="40" cy="46" rx="36" ry="5" fill={C.shadow} />
      <circle cx="24" cy="30" r="18" fill={C.leaf2} />
      <circle cx="54" cy="30" r="18" fill={C.leaf2} />
      <circle cx="40" cy="22" r="20" fill={C.leaf1} />
    </>
  ),
});

export const flowerbed = (colors: string[]): PropArt => ({
  w: 150,
  h: 52,
  node: (
    <>
      <rect x="4" y="14" width="142" height="34" rx="8" fill={C.woodDark} />
      <rect x="8" y="10" width="134" height="30" rx="7" fill="#b9d6a8" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={20 + i * 14} cy={i % 2 ? 22 : 30} r="5" fill={colors[i % colors.length]} opacity="0.85" />
      ))}
    </>
  ),
});

export const pottedPlant = (variant = 0): PropArt => ({
  w: 54,
  h: 80,
  node: (
    <>
      <ellipse cx="27" cy="76" rx="20" ry="4" fill={C.shadow} />
      <path d="M14 50h26l-4 26H18Z" fill={C.pot} />
      <rect x="12" y="46" width="30" height="7" rx="2" fill="#c99681" />
      {variant === 0 ? (
        <>
          <path d="M27 48C14 40 10 22 16 10c8 10 12 22 11 38Z" fill={C.leaf2} />
          <path d="M27 48c10-12 20-16 24-26-2 14-10 22-24 26Z" fill={C.leaf1} />
          <path d="M27 48C26 34 30 20 36 14c2 12-2 26-9 34Z" fill={C.leaf3} />
        </>
      ) : (
        <>
          <ellipse cx="18" cy="30" rx="8" ry="16" fill={C.leaf2} transform="rotate(-24 18 30)" />
          <ellipse cx="36" cy="30" rx="8" ry="16" fill={C.leaf1} transform="rotate(24 36 30)" />
          <ellipse cx="27" cy="24" rx="8" ry="20" fill={C.leaf3} />
        </>
      )}
    </>
  ),
});

export const welcomeSign = (): PropArt => ({
  w: 220,
  h: 130,
  node: (
    <>
      <ellipse cx="110" cy="126" rx="80" ry="5" fill={C.shadow} />
      <path d="M40 70v56M180 70v56" stroke="#8a96a3" strokeWidth="6" strokeLinecap="round" />
      <rect x="6" y="6" width="208" height="76" rx="12" fill="#ffffff" stroke={C.line} strokeWidth="2" />
      <rect x="6" y="6" width="208" height="8" rx="4" fill="var(--accent)" />
      <text x="110" y="40" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f1b2d" fontFamily="'Plus Jakarta Sans Variable', sans-serif">
        Chian Yee's Campus
      </text>
      <text x="110" y="62" textAnchor="middle" fontSize="11" fill="#4a5567" fontFamily="'Inter Variable', sans-serif">
        One classroom per year · walk in!
      </text>
    </>
  ),
});

export const bookshelf = (): PropArt => ({
  w: 150,
  h: 120,
  node: (
    <>
      <rect x="4" y="4" width="142" height="114" rx="4" fill={C.woodDark} />
      <rect x="10" y="10" width="130" height="102" rx="2" fill="#f1e7d8" />
      {[0, 1, 2].map((row) =>
        Array.from({ length: 8 }, (_, i) => (
          <rect
            key={`${row}-${i}`}
            x={14 + i * 15.5}
            y={16 + row * 33}
            width="11"
            height={24 - ((i * 7 + row * 3) % 8)}
            rx="1.5"
            fill={["#9fb7cc", "#c9b8e6", "#a9d4bd", "#e8c6a7", "#d7dde3"][(i + row * 2) % 5]}
            transform={`translate(0 ${(i * 7 + row * 3) % 8})`}
          />
        )),
      )}
      <path d="M10 44h130M10 77h130" stroke={C.woodDark} strokeWidth="3" />
    </>
  ),
});

/* ── project stations (inside classrooms) ── */

export const desk = (icon: string, color: string): PropArt => ({
  w: 190,
  h: 150,
  node: (
    <>
      <ellipse cx="95" cy="146" rx="86" ry="6" fill={C.shadow} />
      {/* chair behind the desk */}
      <rect x="70" y="30" width="50" height="40" rx="10" fill="#9fb0c2" />
      <rect x="76" y="36" width="38" height="28" rx="7" fill="#b7c5d3" />
      {/* desk */}
      <rect x="10" y="74" width="170" height="40" rx="5" fill={C.wood} />
      <rect x="10" y="108" width="170" height="26" rx="4" fill={C.woodDark} />
      <rect x="18" y="132" width="8" height="12" fill={C.woodDark} />
      <rect x="164" y="132" width="8" height="12" fill={C.woodDark} />
      {/* monitor */}
      <rect x="86" y="68" width="18" height="14" fill="#8a96a3" />
      <rect x="54" y="20" width="82" height="54" rx="6" fill={C.screen} />
      <rect x="58" y="24" width="74" height="46" rx="3" fill="#ffffff" />
      <Icon name={icon} x={77} y={29} width={36} height={36} color={color} strokeWidth={2} className="" />
      {/* keyboard + mug */}
      <rect x="66" y="86" width="58" height="12" rx="3" fill="#ffffff" stroke={C.line} />
      <rect x="146" y="80" width="14" height="16" rx="3" fill={color} opacity="0.8" />
    </>
  ),
});

export const whiteboard = (icon: string, color: string): PropArt => ({
  w: 230,
  h: 190,
  node: (
    <>
      <ellipse cx="115" cy="184" rx="96" ry="6" fill={C.shadow} />
      <path d="M50 120 L36 184 M180 120 L194 184 M115 120 V184" stroke="#8a96a3" strokeWidth="5" strokeLinecap="round" />
      <rect x="14" y="8" width="202" height="122" rx="8" fill="#ffffff" stroke={C.line} strokeWidth="3" />
      <rect x="14" y="8" width="202" height="10" rx="5" fill={color} />
      <Icon name={icon} x={30} y={34} width={58} height={58} color={color} strokeWidth={1.8} className="" />
      <path d="M104 44h88M104 62h70M104 80h80M104 98h52" stroke="#c9d2db" strokeWidth="5" strokeLinecap="round" />
      <path d="M190 104 l6 12 13 2 -10 9 3 13 -12-7 -12 7 3-13 -10-9 13-2Z" fill="#f5c451" transform="translate(-12 -14) scale(0.9)" />
      <rect x="40" y="124" width="150" height="7" rx="3" fill="#b9c3cd" />
    </>
  ),
});

export const constructionDesk = (): PropArt => ({
  w: 190,
  h: 150,
  node: (
    <>
      <ellipse cx="95" cy="146" rx="86" ry="6" fill={C.shadow} />
      <rect x="10" y="74" width="170" height="60" rx="6" fill="none" stroke="#b9c3cd" strokeWidth="3" strokeDasharray="8 7" />
      <path d="M40 132 L56 70 L72 132 Z" fill="#f2a65a" />
      <path d="M46 108h20M50 92h12" stroke="#ffffff" strokeWidth="5" />
      <rect x="34" y="128" width="44" height="8" rx="2" fill="#e08c3e" />
      <rect x="92" y="88" width="76" height="34" rx="6" fill="#ffffff" stroke={C.line} strokeWidth="2" />
      <text x="130" y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b7686" fontFamily="'Inter Variable', sans-serif">
        Coming soon
      </text>
    </>
  ),
});

/* ── a classroom building as seen on the campus (background layer) ── */

export function Building({ x, y, w, h, color, year, desks }: { x: number; y: number; w: number; h: number; color: string; year: number; desks: number }) {
  const cx = x + w / 2;
  const door = 110;
  const front = y + h;
  const cols = Math.min(desks, 4);
  return (
    <g>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx="8" fill={C.shadow} />
      {/* floor + back wall */}
      <rect x={x} y={y} width={w} height={h} rx="6" fill={C.floor} />
      <rect x={x} y={y} width={w} height={46} rx="6" fill={C.wallFace} />
      <rect x={x} y={y} width={w} height={5} rx="2.5" fill={color} />
      <rect x={cx - 70} y={y + 12} width="140" height="24" rx="3" fill="#ffffff" stroke={C.line} />
      <path d={`M${cx - 54} ${y + 24}h70`} stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* rug + mini desks seen through the glass */}
      <rect x={x + 40} y={y + 80} width={w - 80} height={h - 140} rx="16" fill={color} opacity="0.12" />
      {Array.from({ length: cols }, (_, i) => {
        const dx = x + 60 + ((w - 120) / cols) * (i + 0.5);
        return (
          <g key={i}>
            <rect x={dx - 18} y={y + 92} width="36" height="22" rx="8" fill="#b7c5d3" />
            <rect x={dx - 40} y={y + 112} width="80" height="28" rx="4" fill={C.wood} />
            <rect x={dx - 16} y={y + 100} width="32" height="20" rx="3" fill={C.screen} />
          </g>
        );
      })}
      <circle cx={x + 36} cy={y + h - 52} r="16" fill={C.leaf2} />
      <circle cx={x + w - 36} cy={y + h - 52} r="16" fill={C.leaf2} />
      {/* glass walls */}
      <rect x={x + 6} y={y + 46} width={w - 12} height={h - 56} fill={C.glass} opacity="0.35" />
      <rect x={x} y={y} width="8" height={h} fill="#ffffff" stroke={C.line} />
      <rect x={x + w - 8} y={y} width="8" height={h} fill="#ffffff" stroke={C.line} />
      <rect x={x} y={front - 10} width={w / 2 - door / 2} height="12" fill="#ffffff" stroke={C.line} />
      <rect x={cx + door / 2} y={front - 10} width={w / 2 - door / 2} height="12" fill="#ffffff" stroke={C.line} />
      {/* glass panes + door */}
      {[0.15, 0.32, 0.68, 0.85].map((t) => (
        <rect key={t} x={x + w * t - 1} y={y + 46} width="2" height={h - 56} fill="#ffffff" opacity="0.7" />
      ))}
      <rect x={cx - door / 2} y={front - 6} width={door} height="14" rx="3" fill={color} opacity="0.75" />
      {/* door sign */}
      <rect x={cx + door / 2 + 10} y={front - 48} width="64" height="32" rx="5" fill="#ffffff" stroke={C.line} />
      <rect x={cx + door / 2 + 10} y={front - 48} width="5" height="32" rx="2" fill={color} />
      <text x={cx + door / 2 + 46} y={front - 27} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f1b2d" fontFamily="'Plus Jakarta Sans Variable', sans-serif">
        {year}
      </text>
    </g>
  );
}

/** Deterministic pseudo-random so the scenery never shuffles between renders. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── ambient life ── */

/** "Byte", Cheryl's AI teammate, typing at a laptop on a little table. */
export const byteAtTable = (): PropArt => ({
  w: 160,
  h: 150,
  node: (
    <>
      <ellipse cx="80" cy="146" rx="66" ry="6" fill={C.shadow} />
      {/* robot (sits behind the table) */}
      <path d="M80 20v-10" stroke="#8a96a3" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="8" r="5" fill="var(--accent)" />
      <rect x="52" y="20" width="56" height="44" rx="14" fill="#ffffff" stroke="#c5ced7" strokeWidth="2.5" />
      <rect x="59" y="28" width="42" height="28" rx="9" fill="#24324a" />
      <g className="byte-eyes">
        <rect x="66" y="36" width="8" height="8" rx="4" fill="#7fe0d0" />
        <rect x="86" y="36" width="8" height="8" rx="4" fill="#7fe0d0" />
      </g>
      <path d="M73 49q7 5 14 0" stroke="#7fe0d0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="58" y="62" width="44" height="34" rx="12" fill="#eef2f5" stroke="#c5ced7" strokeWidth="2.5" />
      <circle cx="80" cy="78" r="5" fill="var(--accent)" opacity="0.6" />
      {/* table + laptop (seen from the front: we see the lid) */}
      <rect x="8" y="92" width="144" height="18" rx="5" fill={C.wood} />
      <rect x="8" y="106" width="144" height="10" rx="3" fill={C.woodDark} />
      <path d="M22 116v28M138 116v28" stroke={C.woodDark} strokeWidth="6" strokeLinecap="round" />
      <path d="M50 94 L56 62 H104 L110 94 Z" fill="#c9d1d9" stroke="#aab4be" strokeWidth="2" />
      <circle cx="80" cy="78" r="5" fill="#ffffff" opacity="0.8" />
      <rect className="byte-hand" x="44" y="88" width="16" height="10" rx="5" fill="#ffffff" stroke="#c5ced7" strokeWidth="2" />
      <rect className="byte-hand byte-hand-r" x="100" y="88" width="16" height="10" rx="5" fill="#ffffff" stroke="#c5ced7" strokeWidth="2" />
      {/* code drifting up from the laptop */}
      {["{ }", "</>", "=>"].map((t, i) => (
        <text
          key={t}
          className="code-float"
          style={{ animationDelay: `${i * 0.93}s` }}
          x={[40, 112, 76][i]}
          y="60"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="var(--accent)"
          fontFamily="ui-monospace, monospace"
        >
          {t}
        </text>
      ))}
    </>
  ),
});

/** The hidden retro console: a little CRT with a console and controller. */
export const retroConsole = (): PropArt => ({
  w: 120,
  h: 110,
  node: (
    <>
      <ellipse cx="60" cy="106" rx="52" ry="5" fill={C.shadow} />
      <rect x="18" y="8" width="84" height="66" rx="10" fill="#b9a993" stroke="#958670" strokeWidth="2.5" />
      <rect x="26" y="16" width="62" height="50" rx="8" fill="#1d2b23" />
      <g className="crt-flicker">
        <rect x="26" y="16" width="62" height="50" rx="8" fill="#6fdc8c" opacity="0.12" />
        {/* a little pixel invader */}
        <path
          d="M45 30h4v4h-4zM65 30h4v4h-4zM49 34h16v4H49zM45 38h24v4H45zM41 42h32v4H41zM41 46h4v4h-4zM53 46h8v4h-8zM69 46h4v4h-4z"
          fill="#9be3a5"
        />
      </g>
      <circle cx="95" cy="30" r="3" fill="#958670" />
      <circle cx="95" cy="42" r="3" fill="#958670" />
      <rect x="30" y="80" width="60" height="18" rx="4" fill="#d9d4ca" stroke="#aaa294" strokeWidth="2" />
      <rect x="38" y="86" width="20" height="5" rx="2" fill="#6b7686" />
      <circle cx="76" cy="89" r="3" fill="#e07a6f" />
      <path d="M90 92c12 0 10 10 22 8" stroke="#6b7686" strokeWidth="2" fill="none" />
    </>
  ),
});
