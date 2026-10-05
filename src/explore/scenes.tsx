// Scene layouts for Explore Mode: the campus and one classroom per year.
// Everything here is generated from src/data, so adding a project adds a desk.

import type { ReactNode } from "react";
import { classrooms, projectsByYear, stationsByYear, years, type Year } from "../data/projects";
import {
  bench,
  Building,
  byteAtTable,
  retroConsole,
  bush,
  C,
  constructionDesk,
  desk,
  flowerbed,
  lamp,
  pottedPlant,
  rng,
  smallTree,
  tree,
  welcomeSign,
  whiteboard,
  type PropArt,
} from "./art";
import type { Interactable, Rect, SceneData, Spawn } from "./engine";

export const yearHex: Record<Year, string> = { 2024: "#3a7fb0", 2025: "#2f8f6b", 2026: "#6b5fb5" };

export interface PropDef {
  id: string;
  x: number;
  /** baseline (feet) y, used for depth sorting */
  y: number;
  art: PropArt;
  scale?: number;
}

export interface LabelDef {
  id: string;
  x: number;
  y: number;
  title: string;
  sub?: string;
  color: string;
  small?: boolean;
}

export interface FullScene extends SceneData {
  name: string;
  year?: Year;
  spawn: Spawn;
  background: ReactNode;
  props: PropDef[];
  labels: LabelDef[];
  /** glowing spots at night (lamps, screens) */
  lights?: { x: number; y: number; r: number }[];
  /** windows that light up at night */
  windows?: Rect[];
}

/* ── campus ─────────────────────────────────────────────── */

const CW = 2000;
const CH = 1320;
const BW = 480;
const BH = 330;
const BY = 150;
const buildingX: Record<Year, number> = { 2024: 120, 2025: 760, 2026: 1400 };
export const doorX = (y: Year) => buildingX[y] + BW / 2;
const PATH_Y = 560;
const PATH_H = 90;
const PLAZA = { x: 1000, y: 960, r: 200 };

export function campusSpawn(from?: Year): Spawn {
  return from ? { x: doorX(from), y: 556, dir: "down" } : { x: 1000, y: 628, dir: "down" };
}

export function campusScene(from?: Year): FullScene {
  const colliders: Rect[] = [{ x: 0, y: 0, w: CW, h: 142 }];
  const props: PropDef[] = [];
  const add = (id: string, x: number, y: number, art: PropArt, hit?: Rect, scale = 1) => {
    props.push({ id, x, y, art, scale });
    if (hit) colliders.push(hit);
  };

  for (const y of years) {
    colliders.push({ x: buildingX[y], y: BY, w: BW, h: BH });
    const cx = doorX(y);
    add(`fb-l-${y}`, cx - 150, 545, flowerbed(["#f4b6b0", "#f7d58b", yearHex[y]]), { x: cx - 222, y: 505, w: 144, h: 38 });
    add(`fb-r-${y}`, cx + 150, 545, flowerbed(["#c9b8e6", "#f4b6b0", yearHex[y]]), { x: cx + 78, y: 505, w: 144, h: 38 });
  }

  for (const lx of [250, 690, 1310, 1750]) add(`lamp-${lx}`, lx, 556, lamp(), { x: lx - 8, y: 546, w: 16, h: 10 });

  add("tree", PLAZA.x, 1000, tree(), { x: PLAZA.x - 30, y: 960, w: 60, h: 40 });
  add("bench-l", 830, 1150, bench(), { x: 786, y: 1120, w: 88, h: 28 });
  add("bench-r", 1170, 1150, bench(), { x: 1126, y: 1120, w: 88, h: 28 });
  add("sign", 1190, 790, welcomeSign(), { x: 1115, y: 778, w: 150, h: 12 });
  // the Skills Tree's badge pile sits in front of the trunk (see ambient.tsx)
  colliders.push({ x: PLAZA.x - 198, y: 1052, w: 396, h: 26 });
  // Byte, the AI teammate, and the hidden retro console
  add("byte", 720, 1000, byteAtTable(), { x: 648, y: 962, w: 144, h: 36 });
  add("console", 1795, 1240, retroConsole(), { x: 1750, y: 1222, w: 90, h: 16 });

  const trees: [number, number][] = [
    [150, 860],
    [380, 1120],
    [590, 840],
    [1410, 840],
    [1640, 1120],
    [1860, 880],
    [120, 1250],
  ];
  trees.forEach(([x, y], i) => add(`st-${i}`, x, y, smallTree(), { x: x - 14, y: y - 18, w: 28, h: 18 }));
  for (let x = 70; x < CW; x += 150) {
    if (Math.abs(x - 1000) < 120) continue;
    add(`bush-${x}`, x, 1316, bush(), { x: x - 34, y: 1296, w: 68, h: 20 });
  }

  const interactables: Interactable[] = years.map((y) => ({
    id: `door-${y}`,
    x: doorX(y),
    y: BY + BH + 36,
    r: 80,
    prompt: `Enter the Year ${y} classroom?`,
    kind: "door",
    year: y,
    face: "up",
  }));
  interactables.push(
    { id: "tree", x: PLAZA.x, y: 1112, r: 90, prompt: "Shake the Skills Tree?", kind: "tree", face: "up" },
    { id: "byte", x: 720, y: 1036, r: 85, prompt: "Say hi to Byte, my AI teammate", kind: "npc", face: "up" },
    { id: "console", x: 1795, y: 1268, r: 75, prompt: "Something's glowing behind the bush…", kind: "console", face: "up" },
  );

  const labels: LabelDef[] = years.map((y) => ({
    id: `label-${y}`,
    x: doorX(y),
    y: BY + 78,
    title: `Year ${y}`,
    sub: classrooms[y].blurb,
    color: yearHex[y],
  }));
  labels.push({ id: "label-tree", x: PLAZA.x, y: 744, title: "Skills Tree", sub: "Walk up and give it a shake", color: "#1f6f5c", small: true });
  labels.push({ id: "label-byte", x: 720, y: 846, title: "Byte", sub: "AI teammate", color: "#3a7fb0", small: true });

  const r = rng(7);
  const tufts = Array.from({ length: 170 }, () => [r() * CW, 150 + r() * (CH - 150)] as const);
  const patches = Array.from({ length: 18 }, () => [r() * CW, 200 + r() * (CH - 200), 60 + r() * 90] as const);

  const background = (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} className="absolute inset-0" aria-hidden>
      <rect width={CW} height={CH} fill={C.grass} />
      {patches.map(([x, y, s], i) => (
        <ellipse key={i} cx={x} cy={y} rx={s} ry={s * 0.55} fill={C.grassDeep} opacity="0.55" />
      ))}
      {tufts.map(([x, y], i) => (
        <path key={i} d={`M${x - 4} ${y}l4 -8 4 8M${x + 4} ${y}l3 -6`} stroke={C.tuft} strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
      {/* road + sidewalk */}
      <rect width={CW} height="96" fill={C.road} />
      <path d={`M0 48H${CW}`} stroke={C.roadLine} strokeWidth="4" strokeDasharray="36 30" />
      <rect y="96" width={CW} height="46" fill={C.sidewalk} />
      <path d={`M0 96H${CW}`} stroke="#d9d2c4" strokeWidth="4" />
      {/* paths */}
      <g fill={C.path} stroke={C.pathEdge} strokeWidth="4">
        {years.map((y) => (
          <rect key={y} x={doorX(y) - 58} y={BY + BH - 20} width="116" height={PATH_Y - BY - BH + 60} rx="10" />
        ))}
        <rect x="950" y={PATH_Y + 20} width="100" height={PLAZA.y - PLAZA.r - PATH_Y + 10} />
        <circle cx={PLAZA.x} cy={PLAZA.y} r={PLAZA.r} />
        <rect x="40" y={PATH_Y} width={CW - 80} height={PATH_H} rx={PATH_H / 2} />
      </g>
      <g fill={C.path}>
        {years.map((y) => (
          <rect key={y} x={doorX(y) - 56} y={BY + BH} width="112" height={PATH_Y - BY - BH + 10} />
        ))}
        <rect x="952" y={PATH_Y + 10} width="96" height={PLAZA.y - PLAZA.r - PATH_Y + 20} />
      </g>
      <circle cx={PLAZA.x} cy={PLAZA.y} r="118" fill={C.grassDeep} stroke={C.pathEdge} strokeWidth="4" />
      {years.map((y) => (
        <Building key={y} x={buildingX[y]} y={BY} w={BW} h={BH} color={yearHex[y]} year={y} desks={projectsByYear(y).length} />
      ))}
    </svg>
  );

  return {
    key: "campus",
    name: "Campus",
    cover: true,
    w: CW,
    h: CH,
    colliders,
    interactables,
    spawn: campusSpawn(from),
    background,
    props,
    labels,
    lights: [...[250, 690, 1310, 1750].map((x) => ({ x, y: 448, r: 130 })), { x: 720, y: 930, r: 60 }, { x: 1795, y: 1180, r: 55 }],
    windows: years.map((y) => ({ x: buildingX[y] + 8, y: BY + 46, w: BW - 16, h: BH - 56 })),
  };
}

/* ── classrooms ─────────────────────────────────────────── */

const RW = 1200;
/** Rooms grow taller when a year has more than 4 projects (3 desks per row). */
const roomHeight = (n: number) => (n <= 4 ? 880 : 430 + (Math.ceil(n / 3) - 1) * 260 + 330);
const DOOR_L = 520;
const DOOR_R = 680;

function stationSpots(n: number): [number, number][] {
  if (n === 1) return [[600, 480]];
  if (n === 2) return [[390, 480], [810, 480]];
  if (n === 3) return [[250, 480], [600, 480], [950, 480]];
  if (n === 4) return [[330, 430], [870, 430], [330, 700], [870, 700]];
  return Array.from({ length: n }, (_, i) => [250 + (i % 3) * 350, 430 + Math.floor(i / 3) * 260] as [number, number]);
}

export function stationSpawn(year: Year, projectId: string): Spawn {
  const list = stationsByYear(year);
  const i = Math.max(0, list.findIndex((p) => p.id === projectId));
  const [x, y] = stationSpots(list.length)[i];
  return { x, y: y + 56, dir: "up" };
}

export function classroomScene(year: Year, spawn?: Spawn): FullScene {
  const color = yearHex[year];
  const list = stationsByYear(year);
  const spots = stationSpots(list.length);
  const RH = roomHeight(list.length);
  const colliders: Rect[] = [
    { x: 0, y: 0, w: RW, h: 215 },
    { x: 0, y: 0, w: 30, h: RH },
    { x: RW - 30, y: 0, w: 30, h: RH },
    { x: 0, y: RH - 34, w: DOOR_L, h: 34 },
    { x: DOOR_R, y: RH - 34, w: RW - DOOR_R, h: 34 },
  ];
  const props: PropDef[] = [];
  const labels: LabelDef[] = [];
  const interactables: Interactable[] = [
    { id: "exit", x: 600, y: RH - 58, r: 80, prompt: "Head back to the campus?", kind: "exit", face: "down" },
  ];

  list.forEach((p, i) => {
    const [x, y] = spots[i];
    const art = p.comingSoon ? constructionDesk() : p.featured ? whiteboard(p.icon, color) : desk(p.icon, color);
    props.push({ id: p.id, x, y, art });
    colliders.push(p.featured ? { x: x - 100, y: y - 52, w: 200, h: 48 } : { x: x - 85, y: y - 72, w: 170, h: 64 });
    interactables.push({ id: `station-${p.id}`, x, y: y + 34, r: 95, prompt: `Look at ${p.shortTitle}`, kind: "station", year, projectId: p.id, face: "up" });
    labels.push({ id: `l-${p.id}`, x, y: y - art.h - 2, title: p.featured ? `★ ${p.shortTitle}` : p.shortTitle, sub: p.dateLabel, color, small: true });
  });

  (
    [
      [74, 250, 0],
      [RW - 74, 250, 1],
      [74, RH - 46, 1],
      [RW - 74, RH - 46, 0],
    ] as const
  ).forEach(([x, y, v], i) => {
    props.push({ id: `plant-${i}`, x, y, art: pottedPlant(v), scale: 1.2 });
    colliders.push({ x: x - 18, y: y - 16, w: 36, h: 16 });
  });

  const background = (
    <svg width={RW} height={RH} viewBox={`0 0 ${RW} ${RH}`} className="absolute inset-0" aria-hidden>
      <rect width={RW} height={RH} fill={C.woodFloor} />
      {Array.from({ length: Math.ceil((RH - 232) / 44) }, (_, i) => (
        <path key={i} d={`M30 ${232 + i * 44}H${RW - 30}`} stroke={C.plank} strokeWidth="2" />
      ))}
      <rect x="170" y="280" width={RW - 340} height={RH - 380} rx="36" fill={color} opacity="0.1" />
      {/* back wall */}
      <rect width={RW} height="200" fill={C.wall} />
      <rect width={RW} height="8" fill={color} />
      <rect y="186" width={RW} height="16" fill="#e2d8c8" />
      {[70, 900].map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="230" height="110" rx="6" fill="#ffffff" />
          <rect x={x + 8} y="48" width="214" height="94" rx="3" fill="#d6e7f3" />
          <path d={`M${x + 115} 48v94M${x + 8} 95h214`} stroke="#ffffff" strokeWidth="5" />
          <path d={`M${x + 30} 130l40-60M${x + 60} 130l30-44`} stroke="#ffffff" strokeWidth="6" opacity="0.5" strokeLinecap="round" />
        </g>
      ))}
      <rect x="400" y="26" width="400" height="138" rx="8" fill="#ffffff" stroke={C.line} strokeWidth="3" />
      <rect x="400" y="26" width="400" height="10" rx="5" fill={color} />
      <text x="600" y="84" textAnchor="middle" fontSize="32" fontWeight="700" fill="#0f1b2d" fontFamily="'Plus Jakarta Sans Variable', sans-serif">
        Year {year}
      </text>
      <text x="600" y="112" textAnchor="middle" fontSize="15" fill="#4a5567" fontFamily="'Inter Variable', sans-serif">
        {classrooms[year].blurb}
      </text>
      <text x="600" y="142" textAnchor="middle" fontSize="12" fill="#6b7686" fontFamily="'Inter Variable', sans-serif">
        Walk up to a desk and press E to take a look
      </text>
      {/* side + front walls */}
      <rect width="30" height={RH} fill="#e9e3d8" />
      <rect x={RW - 30} width="30" height={RH} fill="#e9e3d8" />
      <rect y={RH - 34} width={DOOR_L} height="34" fill="#e9e3d8" />
      <rect x={DOOR_R} y={RH - 34} width={RW - DOOR_R} height="34" fill="#e9e3d8" />
      <rect x={DOOR_L + 20} y={RH - 74} width={DOOR_R - DOOR_L - 40} height="40" rx="6" fill={color} opacity="0.35" />
      <text x="600" y={RH - 10} textAnchor="middle" fontSize="13" fontWeight="600" fill="#6b7686" fontFamily="'Inter Variable', sans-serif">
        EXIT
      </text>
    </svg>
  );

  return {
    key: `room-${year}`,
    name: `Year ${year} classroom`,
    year,
    w: RW,
    h: RH,
    colliders,
    interactables,
    spawn: spawn ?? { x: 600, y: RH - 140, dir: "up" },
    background,
    props,
    labels,
  };
}
