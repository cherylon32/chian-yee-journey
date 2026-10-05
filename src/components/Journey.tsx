import { AnimatePresence, m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { classrooms, projectsByYear, years, type Project, type Year } from "../data/projects";
import { Glyphs } from "./Glyphs";
import { Icon } from "./icons";
import { Reveal, SectionHeading, useScrollPlace } from "./Reveal";

export const yearColor: Record<Year, string> = {
  2024: "var(--y2024)",
  2025: "var(--y2025)",
  2026: "var(--y2026)",
};

/* ── layout of the winding trail ───────────────────────── */

const ROW_H = 210;
const TOP = 70;

interface Stop {
  p: Project;
  x: number;
  y: number;
  row: number;
}
interface Seg {
  d: string;
  len: number;
  stroke: string;
  /** for U-turns: gradient from this row's colour to the next */
  grad?: { from: string; to: string; x: number; y1: number; y2: number };
}
interface Pill {
  year: Year;
  x: number;
  y: number;
}

function buildLayout(width: number) {
  const perRow = width >= 960 ? 4 : 3;
  const r = ROW_H / 2;
  const xl = r + 12;
  const xr = width - r - 12;

  const rows = years.flatMap((year) => {
    const list = projectsByYear(year);
    const chunks: { year: Year; items: Project[]; first: boolean }[] = [];
    for (let i = 0; i < list.length; i += perRow) chunks.push({ year, items: list.slice(i, i + perRow), first: i === 0 });
    return chunks;
  });

  const stops: Stop[] = [];
  const segs: Seg[] = [];
  const pills: Pill[] = [];

  rows.forEach((row, i) => {
    const y = TOP + i * ROW_H;
    const ltr = i % 2 === 0;
    const startX = ltr ? xl : xr;
    const endX = ltr ? xr : xl;
    const a = xl + 80;
    const b = xr - 80;
    const n = row.items.length;
    row.items.forEach((p, k) => {
      const t = (k + 0.5) / n;
      stops.push({ p, x: ltr ? a + (b - a) * t : b - (b - a) * t, y, row: i });
    });
    if (row.first) pills.push({ year: row.year, x: startX, y });
    segs.push({ d: `M${startX} ${y}L${endX} ${y}`, len: Math.abs(endX - startX), stroke: yearColor[row.year] });
    const next = rows[i + 1];
    if (next) {
      segs.push({
        d: `M${endX} ${y}A${r} ${r} 0 0 ${ltr ? 1 : 0} ${endX} ${y + ROW_H}`,
        len: Math.PI * r,
        stroke: "",
        grad: { from: yearColor[row.year], to: yearColor[next.year], x: endX, y1: y, y2: y + ROW_H },
      });
    }
  });

  const last = rows.length - 1;
  const end = { x: last % 2 === 0 ? xr : xl, y: TOP + last * ROW_H };
  return { stops, segs, pills, end, height: TOP + last * ROW_H + 120, width };
}

/* ── pieces ─────────────────────────────────────────────── */

function TrailSegment({ seg, from, to, progress, still, gradId }: { seg: Seg; from: number; to: number; progress: MotionValue<number>; still: boolean; gradId: string }) {
  const pathLength = useTransform(progress, [from, to], [0, 1]);
  const opacity = useTransform(pathLength, (v) => (v > 0.002 ? 1 : 0));
  return (
    <m.path
      d={seg.d}
      fill="none"
      stroke={seg.grad ? `url(#${gradId})` : seg.stroke}
      strokeWidth={3.5}
      strokeLinecap="round"
      style={still ? undefined : { pathLength, opacity }}
    />
  );
}

export function ProjectSummary({ p }: { p: Project }) {
  const color = yearColor[p.year];
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-xs font-semibold text-ink-soft">
          <span className="size-2 rounded-full" style={{ background: color }} />
          {p.year} classroom
        </span>
        {p.featured && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
            <Icon name="star" className="size-3.5" /> Featured
          </span>
        )}
      </div>
      <h3 className="mt-2.5 text-base leading-snug font-semibold">{p.title}</h3>
      <p className="mt-1 text-sm font-medium text-ink-soft">{p.role}</p>
      <p className="mt-0.5 text-xs text-ink-faint">
        {[p.dateLabel, p.org, p.location].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.summary}</p>
      {p.keyResult && (
        <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-strong">
          <span className="font-semibold">Result: </span>
          {p.keyResult}
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <li key={t} className="chip !py-0.5 !text-xs">
            {t}
          </li>
        ))}
      </ul>
      {p.links && p.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              <Icon name="link" className="size-4" /> {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function StopNode({ stop, index, width, firstRow }: { stop: Stop; index: number; width: number; firstRow: boolean }) {
  const { p, x, y } = stop;
  const ref = useRef<HTMLDivElement>(null);
  const place = useScrollPlace(ref);
  const [open, setOpen] = useState(false);
  const lastPointer = useRef("mouse");
  const cardId = useId();
  const color = yearColor[p.year];
  const size = p.featured ? 64 : 52;
  const shown = place === "in";

  // close on outside tap / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // keep the card inside the map horizontally; show it below for the first row
  const CARD_W = 330;
  const align = x < CARD_W / 2 + 8 ? "left" : x > width - CARD_W / 2 - 8 ? "right" : "center";
  const horiz = align === "center" ? { left: -CARD_W / 2 } : align === "left" ? { left: -x + 8 } : { right: -(width - x) + 8 };
  const vert = firstRow ? { top: size / 2 + 4, paddingTop: 52 } : { bottom: size / 2 + 4, paddingBottom: 12 };

  return (
    <div
      ref={ref}
      className={`absolute size-0 ${open ? "z-30" : "z-10"}`}
      style={{ left: x, top: y }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.5 }}
        transition={shown ? { duration: 0.45, delay: (index % 4) * 0.08, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0 }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={cardId}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onClick={() => setOpen((o) => (lastPointer.current === "mouse" ? true : !o))}
          onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(true)}
          className={`relative grid place-items-center rounded-full border-2 bg-surface shadow-soft transition-transform duration-200 hover:scale-110 ${
            p.comingSoon ? "border-dashed opacity-70" : ""
          } ${open ? "scale-110" : ""}`}
          style={{ width: size, height: size, borderColor: color, color }}
        >
          <Icon name={p.icon} className={p.featured ? "size-7" : "size-6"} />
          {p.featured && (
            <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full text-white ring-2 ring-surface" style={{ background: color }}>
              <Icon name="star" className="size-3" />
            </span>
          )}
          <span className="sr-only">
            {p.title}, {p.dateLabel}. Show details
          </span>
        </button>
        <div aria-hidden className="absolute top-full left-1/2 mt-2.5 w-40 -translate-x-1/2 text-center">
          <p className="text-[13px] leading-tight font-semibold text-ink">{p.shortTitle}</p>
          <p className="mt-0.5 text-xs text-ink-faint">{p.dateLabel}</p>
        </div>
      </m.div>

      <AnimatePresence>
        {open && (
          <m.div
            id={cardId}
            role="group"
            aria-label={p.title}
            initial={{ opacity: 0, y: firstRow ? -6 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: firstRow ? -6 : 6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18 }}
            className="absolute"
            style={{ width: CARD_W, ...horiz, ...vert }}
          >
            <div className="card p-5 text-left shadow-lift">
              <ProjectSummary p={p} />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trail() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const still = useReducedMotion() ?? false;
  const gradBase = useId().replace(/:/g, "");
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 85%", "end end"] });

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setWidth(Math.round(el.getBoundingClientRect().width)); // measure now, then track resizes
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = width >= 640 ? buildLayout(width) : null;
  const total = L ? L.segs.reduce((s, g) => s + g.len, 0) : 1;
  let acc = 0;

  return (
    <div ref={box} className="relative hidden md:block" style={{ height: L?.height ?? 600 }}>
      {L && (
        <>
          <svg aria-hidden className="absolute inset-0 overflow-visible" width={L.width} height={L.height}>
            <defs>
              {L.segs.map(
                (s, i) =>
                  s.grad && (
                    <linearGradient key={i} id={`${gradBase}-${i}`} gradientUnits="userSpaceOnUse" x1={s.grad.x} y1={s.grad.y1} x2={s.grad.x} y2={s.grad.y2}>
                      <stop offset="0" stopColor={s.grad.from} />
                      <stop offset="1" stopColor={s.grad.to} />
                    </linearGradient>
                  ),
              )}
            </defs>
            {/* the road */}
            <path d={L.segs.map((s) => s.d).join("")} fill="none" stroke="var(--line)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <path d={L.segs.map((s) => s.d).join("")} fill="none" stroke="var(--surface)" strokeWidth={1.5} strokeDasharray="2 10" strokeLinecap="round" />
            {/* the coloured progress line, drawn as you scroll */}
            {L.segs.map((s, i) => {
              const from = acc / total;
              acc += s.len;
              return <TrailSegment key={s.d} seg={s} from={from} to={acc / total} progress={scrollYProgress} still={still} gradId={`${gradBase}-${i}`} />;
            })}
            <circle cx={L.end.x} cy={L.end.y} r={6} fill="var(--surface)" stroke="var(--line)" strokeWidth={3} />
          </svg>

          {L.pills.map((pl) => (
            <div
              key={pl.year}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface px-3 py-1 font-display text-sm font-bold text-ink shadow-soft"
              style={{ left: pl.x, top: pl.y, borderColor: yearColor[pl.year] }}
            >
              {pl.year}
            </div>
          ))}

          {L.stops.map((s, i) => (
            <StopNode key={s.p.id} stop={s} index={i} width={L.width} firstRow={s.row === 0} />
          ))}
        </>
      )}
    </div>
  );
}

/** Phone layout: a vertical timeline you tap to expand. */
function MobileTimeline() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="md:hidden">
      {years.map((year) => (
        <div key={year} className="relative mb-6">
          <span className="relative z-10 inline-block rounded-full border-2 bg-surface px-3 py-1 font-display text-sm font-bold text-ink" style={{ borderColor: yearColor[year] }}>
            {year}
          </span>
          <ol className="mt-3 ml-4 space-y-3 border-l-2 pl-6" style={{ borderColor: `color-mix(in oklab, ${yearColor[year]} 45%, transparent)` }}>
            {projectsByYear(year).map((p) => {
              const open = openId === p.id;
              return (
                <li key={p.id} className="relative">
                  <span
                    className="absolute top-3.5 -left-[43px] grid size-9 place-items-center rounded-full border-2 bg-surface"
                    style={{ borderColor: yearColor[year], color: yearColor[year] }}
                    aria-hidden
                  >
                    <Icon name={p.icon} className="size-[18px]" />
                  </span>
                  <Reveal>
                    <div className="card p-4">
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-3 text-left"
                        aria-expanded={open}
                        onClick={() => setOpenId(open ? null : p.id)}
                      >
                        <span>
                          <span className="block font-semibold leading-snug">{p.shortTitle}</span>
                          <span className="mt-0.5 block text-xs text-ink-faint">
                            {p.role} · {p.dateLabel}
                          </span>
                        </span>
                        <Icon name="plus" className={`mt-1 size-4 shrink-0 text-ink-faint transition-transform ${open ? "rotate-45" : ""}`} />
                      </button>
                      {open && (
                        <div className="mt-3 border-t border-line pt-3">
                          <ProjectSummary p={p} />
                        </div>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}

function CampusSketch() {
  return (
    <svg viewBox="0 0 200 90" className="hidden h-20 w-auto lg:block" aria-hidden fill="none" strokeWidth="2" strokeLinejoin="round">
      {years.map((y, i) => {
        const x = 12 + i * 62;
        return (
          <g key={y} stroke={yearColor[y]}>
            <path d={`M${x} 40 L${x + 25} 24 L${x + 50} 40`} />
            <rect x={x + 4} y={40} width={42} height={36} rx="3" fill="var(--surface)" />
            <rect x={x + 18} y={56} width={14} height={20} rx="2" />
            <path d={`M${x + 10} 48h8M${x + 32} 48h8`} />
            <text x={x + 25} y={88} textAnchor="middle" fontSize="9" fill={yearColor[y]} stroke="none" fontWeight="700">
              {y}
            </text>
          </g>
        );
      })}
      <path d="M2 80 H198" stroke="var(--line)" strokeDasharray="3 4" />
    </svg>
  );
}

export function Journey() {
  return (
    <section id="journey" className="relative">
      <Glyphs set="journey" />
      <div className="relative mx-auto max-w-6xl px-5 py-24">
        <SectionHeading eyebrow="2024 → 2026" title="My journey" intro="Every project and experience, in order. Hover over a stop (or tap it) for the details." />

        <Reveal className="mb-12">
          <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon name="map" className="size-6" />
            </span>
            <div className="flex-1">
              <p className="font-display text-xl font-semibold">Want to know more details?</p>
              <p className="mt-1 text-ink-soft">Walk through my portfolio campus together: one classroom per year, every project up close.</p>
            </div>
            <CampusSketch />
            <a href="#/explore" className="btn-primary shrink-0 px-6 py-3 text-base">
              Click here to explore it together
              <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>

        <Reveal className="mb-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {years.map((y) => (
              <li key={y} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: yearColor[y] }} />
                <span className="font-semibold">{y}</span>
                <span className="text-ink-faint">{classrooms[y].blurb}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Trail />
        <MobileTimeline />
      </div>
    </section>
  );
}
