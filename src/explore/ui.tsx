// Explore Mode overlays: project panel, "Skip the tour" list, map,
// the emcee's speech box and the touch joystick.

import { m } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Emcee } from "../components/Emcee";
import { Icon } from "../components/icons";
import { classrooms, projects, projectsByYear, years, type Project, type ProjectImage, type Year } from "../data/projects";
import { yearHex } from "./scenes";

/* ── accessible dialog behaviour: focus in, Tab trapped, Esc closes, focus restored ── */

export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusables = () => [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    (focusables()[0] ?? el).focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close.current();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
      e.stopPropagation(); // keep game shortcuts out of open dialogs
    };
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [ref]);
}

function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn-icon shrink-0" aria-label={label}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  );
}

/* ── project detail panel ── */

const VIDEO = /\.(mp4|webm|mov)$/i;

/** One screenshot, GIF or video. Missing files fall back to a "coming soon" placeholder. */
function Media({ item, color }: { item: ProjectImage; color: string }) {
  const [broken, setBroken] = useState(false);
  const isVideo = !!item.src && VIDEO.test(item.src);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!item.src || broken) {
    return (
      <div className="grid aspect-video place-items-center rounded-xl border-2 border-dashed border-line bg-surface-2 p-4 text-center">
        <div>
          <Icon name="sparkle" className="mx-auto size-5" color={color} />
          <p className="mt-1.5 text-sm font-medium text-ink-soft">{item.alt}</p>
          <p className="text-xs text-ink-faint">{isVideo ? "Video" : "Screenshot"} coming soon</p>
        </div>
      </div>
    );
  }
  return (
    <figure>
      {isVideo ? (
        <video
          src={item.src}
          poster={item.poster}
          controls
          muted
          loop
          playsInline
          autoPlay={!reduced}
          preload="metadata"
          aria-label={item.alt}
          onError={() => setBroken(true)}
          className="w-full rounded-xl border border-line bg-ink"
        />
      ) : (
        <a href={item.src} target="_blank" rel="noreferrer" title="Open full size" className="block">
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            onError={() => setBroken(true)}
            className="max-h-[60vh] w-full rounded-xl border border-line bg-surface-2 object-contain transition-opacity hover:opacity-90"
          />
        </a>
      )}
      <figcaption className="mt-1.5 text-xs text-ink-faint">{item.alt}</figcaption>
    </figure>
  );
}

export function ProjectPanel({ project: p, onClose, onVisit }: { project: Project; onClose: () => void; onVisit?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  const details = p.details.filter((d) => !d.startsWith("TODO"));
  const color = yearHex[p.year];
  const media = p.images ?? [];
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-3 sm:p-6">
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink/35" onClick={onClose} />
      <m.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-3.5 sm:px-8">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="size-2.5 rounded-full" style={{ background: color }} />
            Year {p.year} classroom
            {p.featured && (
              <span className="ml-1 inline-flex items-center gap-1 text-accent">
                <Icon name="star" className="size-3.5" /> Featured
              </span>
            )}
          </span>
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {/* without media, the whole text block sits centred in the window */}
          <div className={media.length ? "" : "mx-auto max-w-3xl"}>
            {/* heading */}
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1a`, color }}>
                <Icon name={p.icon} className="size-6" />
              </span>
              <div className="min-w-0">
                <h2 id="panel-title" className="text-2xl leading-tight font-semibold sm:text-[1.75rem]">
                  {p.title}
                </h2>
                <p className="mt-1.5 font-medium text-ink-soft">{p.role}</p>
                <p className="mt-0.5 text-sm text-ink-faint">{[p.dateLabel, p.org, p.location].filter(Boolean).join(" · ")}</p>
              </div>
            </div>

            {/* text on the left, media on the right (stacked on small screens) */}
            <div className={`mt-6 grid gap-8 ${media.length ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : ""}`}>
              <div>
                <p className="text-[17px] leading-relaxed text-ink-soft">{p.summary}</p>
                {p.keyResult && (
                  <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-accent-strong">
                    <span className="font-semibold">Result: </span>
                    {p.keyResult}
                  </p>
                )}
                {details.length > 0 && (
                  <>
                    <h3 className="mt-7 text-sm font-semibold tracking-wide text-ink-faint uppercase">What I did</h3>
                    <ul className="mt-3 space-y-2.5">
                      {details.map((d) => (
                        <li key={d} className="flex gap-3 leading-relaxed text-ink-soft">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full" style={{ background: color }} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <ul className="mt-7 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                {p.links && p.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {p.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-secondary">
                        <Icon name="link" className="size-4" /> {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {media.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-ink-faint uppercase lg:mt-1">Screenshots &amp; media</h3>
                  <div className="mt-3 space-y-5">
                    {media.map((item) => (
                      <Media key={item.src ?? item.alt} item={item} color={color} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {onVisit && (
          <div className="flex justify-end border-t border-line px-6 py-3.5 sm:px-8">
            <button type="button" className="btn-primary w-full sm:w-auto" onClick={onVisit}>
              Walk me to this desk
            </button>
          </div>
        )}
      </m.div>
    </div>
  );
}

/* ── "Skip the tour": every project in one list ── */

export function TourList({ onClose, onDetails, onVisit }: { onClose: () => void; onDetails: (id: string) => void; onVisit: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  return (
    <Modal innerRef={ref} labelledBy="tour-title" onClose={onClose} wide>
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <h2 id="tour-title" className="text-xl font-semibold">
            All projects
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Skip the tour: everything in one list, {projects.length} stops from 2024 to 2026.</p>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <div className="overflow-y-auto px-6 py-5">
        {years.map((y) => (
          <section key={y} className="mb-6 last:mb-0" aria-labelledby={`tour-${y}`}>
            <h3 id={`tour-${y}`} className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2.5 rounded-full" style={{ background: yearHex[y] }} />
              Year {y}
              <span className="font-normal text-ink-faint">· {classrooms[y].blurb}</span>
            </h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {projectsByYear(y).map((p) => (
                <li key={p.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: `${yearHex[y]}1a`, color: yearHex[y] }}>
                      <Icon name={p.icon} className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="leading-snug font-semibold">{p.shortTitle}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {p.role} · {p.dateLabel}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2.5 flex-1 text-sm text-ink-soft">{p.summary}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="btn-primary !px-3 !py-1.5 text-sm" onClick={() => onDetails(p.id)}>
                      Details
                    </button>
                    <button type="button" className="btn-secondary !px-3 !py-1.5 text-sm" onClick={() => onVisit(p.id)}>
                      Visit desk
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

function Modal({ children, innerRef, labelledBy, onClose, wide }: { children: ReactNode; innerRef: RefObject<HTMLDivElement | null>; labelledBy: string; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6">
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink/25" onClick={onClose} />
      <m.div
        ref={innerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift outline-none ${wide ? "max-w-3xl" : "max-w-md"}`}
      >
        {children}
      </m.div>
    </div>
  );
}

/* ── map: overview + teleport ── */

export type Place = "campus" | Year;

export function MapModal({ here, onClose, onGo }: { here: Place; onClose: () => void; onGo: (p: Place) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  const spots: { place: Place; label: string; color: string }[] = [
    ...years.map((y) => ({ place: y as Place, label: `Year ${y} classroom`, color: yearHex[y] })),
    { place: "campus", label: "Courtyard", color: "#1f6f5c" },
  ];
  return (
    <Modal innerRef={ref} labelledBy="map-title" onClose={onClose}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 id="map-title" className="text-lg font-semibold">
          Campus map
        </h2>
        <CloseButton onClick={onClose} />
      </div>
      <div className="p-5">
        <svg viewBox="0 0 400 250" className="w-full rounded-xl bg-[#d6e8cd]" aria-hidden>
          <rect width="400" height="22" fill="#5f6771" />
          <rect x="10" y="108" width="380" height="18" rx="9" fill="#e8eff4" />
          <circle cx="200" cy="190" r="40" fill="#e8eff4" />
          <circle cx="200" cy="190" r="22" fill="#88bf89" />
          <rect x="190" y="120" width="20" height="40" fill="#e8eff4" />
          {years.map((y, i) => (
            <g key={y} className="cursor-pointer" onClick={() => onGo(y)}>
              <rect x={24 + i * 128} y="32" width="96" height="64" rx="5" fill="#f7f5f0" stroke={yearHex[y]} strokeWidth={here === y ? 4 : 2} />
              <rect x={24 + i * 128} y="32" width="96" height="6" rx="3" fill={yearHex[y]} />
              <text x={72 + i * 128} y="72" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f1b2d">
                {y}
              </text>
            </g>
          ))}
          {(() => {
            const at = here === "campus" ? { x: 200, y: 140 } : { x: 72 + years.indexOf(here) * 128, y: 86 };
            return (
              <g>
                <circle cx={at.x} cy={at.y} r="9" fill="#1f6f5c" stroke="#fff" strokeWidth="3" />
              </g>
            );
          })()}
        </svg>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
          <span className="size-2.5 rounded-full bg-accent" /> You are here
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {spots.map((s) => (
            <li key={String(s.place)}>
              <button
                type="button"
                onClick={() => onGo(s.place)}
                aria-current={here === s.place ? "location" : undefined}
                className="flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-left text-sm font-medium hover:border-accent/60 aria-[current=location]:border-accent aria-[current=location]:bg-accent-soft"
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

/* ── the emcee's speech box ── */

export interface Speech {
  text: string;
  /** "station" speech is tied to a spot and closes when you walk away */
  kind: "tutorial" | "room" | "station";
  primary?: { label: string; run: () => void };
}

export function SpeechBox({ speech, onClose }: { speech: Speech; onClose: () => void }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduced ? speech.text.length : 0);
  useEffect(() => {
    if (reduced) return setShown(speech.text.length);
    setShown(0);
    const t = setInterval(() => setShown((n) => (n >= speech.text.length ? (clearInterval(t), n) : n + 2)), 18);
    return () => clearInterval(t);
  }, [speech.text, reduced]);
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass pointer-events-auto flex w-full max-w-xl items-start gap-3 rounded-2xl p-4 shadow-lift"
      role="status"
    >
      <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-line bg-accent-soft">
        <Emcee pose="talk" frame={1} width={62} label="" className="absolute -top-0.5 left-1/2 -translate-x-1/2" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">Cheryl</p>
        <p className="mt-0.5 text-[15px] leading-snug text-ink">
          {speech.text.slice(0, shown)}
          <span className="sr-only">{speech.text.slice(shown)}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {speech.primary && (
            <button type="button" className="btn-primary !px-3.5 !py-1.5 text-sm" onClick={speech.primary.run}>
              {speech.primary.label} <kbd className="ml-1 rounded border border-white/40 px-1 text-[11px]">E</kbd>
            </button>
          )}
          <button type="button" className="btn-secondary !px-3.5 !py-1.5 text-sm" onClick={onClose}>
            {speech.primary ? "Not now" : "Got it"}
          </button>
        </div>
      </div>
    </m.div>
  );
}

/* ── touch joystick ── */

export function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const R = 42;
  const handle = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > R) {
      dx = (dx / d) * R;
      dy = (dy / d) * R;
    }
    setKnob({ x: dx, y: dy });
    onMove(dx / R, dy / R);
  };
  const end = () => {
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };
  return (
    <div
      ref={base}
      aria-hidden
      className="glass pointer-events-auto relative size-32 touch-none rounded-full"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        handle(e);
      }}
      onPointerMove={(e) => e.buttons && handle(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div
        className="absolute top-1/2 left-1/2 size-14 rounded-full bg-surface shadow-soft"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
