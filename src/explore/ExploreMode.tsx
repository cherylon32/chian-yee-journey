import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/icons";
import { dialogue } from "../data/dialogue";
import { projects, type Year } from "../data/projects";
import { Lighting, RetroGame, SkillsPanel, SkillsTree, useLight, type LightSetting } from "./ambient";
import { Engine, type Interactable } from "./engine";
import { Music } from "./music";
import { campusScene, classroomScene, stationSpawn, yearHex, type FullScene, type LabelDef } from "./scenes";
import { Joystick, MapModal, ProjectPanel, SpeechBox, TourList, type Place, type Speech } from "./ui";

// Explore Mode lives in its own lazily-loaded chunk: none of this code
// downloads until a visitor clicks "Explore".

type SceneSpec = { type: "campus"; from?: Year } | { type: "room"; year: Year; projectId?: string };

const TUTORIAL_KEY = "explore-tutorial-seen";
const seenTutorial = () => {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === "1";
  } catch {
    return false;
  }
};
const markTutorial = () => {
  try {
    localStorage.setItem(TUTORIAL_KEY, "1");
  } catch {
    /* fine: it just shows again next time */
  }
};

function build(spec: SceneSpec): FullScene {
  if (spec.type === "campus") return campusScene(spec.from);
  return classroomScene(spec.year, spec.projectId ? stationSpawn(spec.year, spec.projectId) : undefined);
}

function Label({ l }: { l: LabelDef }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: l.x, top: l.y, zIndex: 100000, transform: "translate(-50%, -100%) scale(var(--label-scale, 1))", transformOrigin: "50% 100%" }}
    >
      <div className={`glass flex items-center gap-2.5 rounded-xl shadow-soft ${l.small ? "px-2.5 py-1.5" : "px-4 py-2.5"}`}>
        <span className={`shrink-0 rounded-full ${l.small ? "size-2" : "size-3"}`} style={{ background: l.color }} />
        <span className="whitespace-nowrap">
          <span className={`block font-display font-semibold text-ink ${l.small ? "text-[13px]" : "text-lg"}`}>{l.title}</span>
          {l.sub && <span className={`block text-ink-soft ${l.small ? "text-[11px]" : "text-[13px]"}`}>{l.sub}</span>}
        </span>
      </div>
    </div>
  );
}

const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export default function ExploreMode({ onExit }: { onExit: () => void }) {
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);

  const [spec, setSpec] = useState<SceneSpec>({ type: "campus" });
  const scene = useMemo(() => build(spec), [spec]);
  const [fading, setFading] = useState(false);
  const [prompt, setPrompt] = useState<Interactable | null>(null);
  const [speech, setSpeech] = useState<Speech | null>(() => (seenTutorial() ? null : { kind: "tutorial", text: dialogue.tutorial }));
  const [panel, setPanel] = useState<{ id: string; visit: boolean } | null>(null);
  const [showList, setShowList] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [overview, setOverview] = useState(false);
  const [shake, setShake] = useState(0);
  const [showSkills, setShowSkills] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [lightSetting, setLightSetting] = useState<LightSetting>("auto");
  const light = useLight(lightSetting);
  const music = useRef<Music | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const byteLine = useRef(0);

  const modalOpen = !!panel || showList || showMap || showSkills || showGame;
  const here: Place = spec.type === "campus" ? "campus" : spec.year;
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  /* ── scene changes with a quick fade ── */
  const go = useCallback(
    (next: SceneSpec) => {
      setSpeech(null);
      if (reduced) return setSpec(next);
      setFading(true);
      setTimeout(() => setSpec(next), 200);
    },
    [reduced],
  );

  useLayoutEffect(() => {
    engine.current?.setScene(scene, scene.spawn);
    const t = setTimeout(() => setFading(false), 30);
    // arriving at a specific desk? say that project's line; otherwise introduce the room
    const target = spec.type === "room" && spec.projectId ? projects.find((p) => p.id === spec.projectId) : undefined;
    if (target) setSpeech(stationSpeech(target.id));
    else if (scene.year) setSpeech({ kind: "room", text: dialogue.rooms[scene.year] });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const stationSpeech = (id: string): Speech => ({
    kind: "station",
    text: projects.find((x) => x.id === id)!.emceeLine,
    primary: { label: "See details", run: () => setPanel({ id, visit: false }) },
  });

  /* ── engine callbacks (via a ref so they always see fresh state) ── */
  const handlers = useRef({
    onPrompt: (_: Interactable | null) => {},
    onInteract: (_: Interactable) => {},
    onFirstMove: () => {},
  });
  handlers.current = {
    onPrompt: (i) => {
      setPrompt(i);
      if (!i) setSpeech((s) => (s?.kind === "station" ? null : s));
    },
    onInteract: (i) => {
      if (i.kind === "door" && i.year) go({ type: "room", year: i.year });
      else if (i.kind === "exit" && scene.year) go({ type: "campus", from: scene.year });
      else if (i.kind === "station" && i.projectId) setSpeech(stationSpeech(i.projectId));
      else if (i.kind === "tree") {
        setShake((n) => n + 1);
        setSpeech({ kind: "station", text: dialogue.tree, primary: { label: "See all skills", run: () => setShowSkills(true) } });
      } else if (i.kind === "npc") {
        setSpeech({ kind: "station", speaker: "byte", text: dialogue.byte[byteLine.current++ % dialogue.byte.length] });
      } else if (i.kind === "console") {
        setSpeech({ kind: "station", text: dialogue.console, primary: { label: "Play", run: () => setShowGame(true) } });
      }
    },
    onFirstMove: () => {
      markTutorial();
      setSpeech((s) => (s?.kind === "tutorial" ? null : s));
    },
  };

  useEffect(() => {
    const e = new Engine(viewport.current!, world.current!, hero.current!, sprite.current!, {
      onPrompt: (i) => handlers.current.onPrompt(i),
      onInteract: (i) => handlers.current.onInteract(i),
      onFirstMove: () => handlers.current.onFirstMove(),
    });
    engine.current = e;
    if (import.meta.env.DEV) (window as unknown as { __engine: Engine }).__engine = e; // handy for debugging
    e.setScene(scene, scene.spawn);
    e.start();
    return () => {
      e.destroy();
      music.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => engine.current?.setPaused(modalOpen), [modalOpen]);
  useEffect(() => {
    if (engine.current) engine.current.mode = overview ? "overview" : "follow";
  }, [overview]);

  /* ── page behaviour: lock scroll, keyboard shortcuts ── */
  const speechRef = useRef(speech);
  speechRef.current = speech;
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (modalOpen) return;
      const onButton = e.target instanceof Element && e.target.closest("button, a");
      const s = speechRef.current;
      if ((e.code === "KeyE" || e.key === "Enter" || e.code === "Space") && !onButton) {
        e.preventDefault();
        if (s?.primary) s.primary.run();
        else if (s && s.kind !== "station") setSpeech(null);
        else engine.current?.interact();
      } else if (e.key === "Escape") {
        if (s) setSpeech(null);
        else onExit();
      } else if (e.code === "KeyM") setShowMap(true);
      else if (e.code === "KeyV") setOverview((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, onExit]);

  const visit = (id: string) => {
    const p = projects.find((x) => x.id === id)!;
    setPanel(null);
    setShowList(false);
    go({ type: "room", year: p.year, projectId: id });
  };

  const panelProject = panel && projects.find((p) => p.id === panel.id);

  return (
    <div role="dialog" aria-modal="true" aria-label="Explore my portfolio campus" className="fixed inset-0 z-50 overflow-hidden bg-[#d6e8cd] select-none">
      <p className="sr-only">
        A walkable map of my projects. Use arrow keys or WASD to move and E to interact, or open "Skip the tour" for a plain list of every project.
      </p>

      {/* the world */}
      <div ref={viewport} className="absolute inset-0 cursor-pointer touch-none" style={{ background: scene.year ? "#d8d0c2" : "#d6e8cd" }}>
        <div ref={world} className="absolute top-0 left-0 origin-top-left will-change-transform"
          style={{ width: scene.w, height: scene.h, boxShadow: scene.year ? "0 40px 90px -30px rgb(40 30 20 / 0.45)" : undefined }}>
          {/* the campus road + sidewalk run on past the edges when zoomed out */}
          {!scene.year && (
            <>
              <div aria-hidden className="absolute -right-[3000px] -left-[3000px] -z-10 h-[96px] bg-[#5f6771]" style={{ top: 0 }} />
              <div aria-hidden className="absolute -right-[3000px] -left-[3000px] -z-10 h-[46px] border-t-4 border-[#d9d2c4] bg-[#efe9dd]" style={{ top: 96 }} />
            </>
          )}
          {scene.background}
          {scene.props.map((p) => {
            const s = p.scale ?? 1;
            return (
              <svg
                key={p.id}
                aria-hidden
                width={p.art.w * s}
                height={p.art.h * s}
                viewBox={`0 0 ${p.art.w} ${p.art.h}`}
                className="pointer-events-none absolute"
                style={{ left: p.x - (p.art.w * s) / 2, top: p.y - p.art.h * s, zIndex: Math.round(p.y) }}
              >
                {p.art.node}
              </svg>
            );
          })}
          <div ref={hero} className="pointer-events-none absolute top-0 left-0 will-change-transform">
            <div ref={sprite} />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-white">
              Cheryl
            </span>
          </div>
          {spec.type === "campus" && <SkillsTree shake={shake} />}
          <Lighting light={light} scene={scene} />
          {scene.labels.map((l) => (
            <Label key={l.id} l={l} />
          ))}
        </div>
      </div>

      {/* fade between scenes */}
      <div className={`pointer-events-none absolute inset-0 bg-paper transition-opacity duration-200 ${fading ? "opacity-100" : "opacity-0"}`} />

      {/* HUD: top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="glass pointer-events-auto flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-soft">
          <span className="size-2.5 rounded-full" style={{ background: scene.year ? yearHex[scene.year] : "#1f6f5c" }} />
          {scene.name}
          {light !== "day" && <span className="hidden font-normal text-ink-faint sm:inline">· {light === "night" ? "night" : "golden hour"}</span>}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                className="btn-icon relative size-10 rounded-full shadow-soft"
                aria-label={`Lighting: ${lightSetting === "auto" ? `matches your clock (${light})` : lightSetting}. Click to change`}
                title={`Lighting: ${lightSetting}`}
                onClick={() => setLightSetting((s) => (s === "auto" ? "day" : s === "day" ? "dusk" : s === "dusk" ? "night" : "auto"))}
              >
                {light === "night" ? (
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
                    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                )}
                {lightSetting === "auto" && <span className="absolute -top-0.5 -right-0.5 rounded-full bg-accent px-1 text-[9px] font-bold text-on-accent">A</span>}
              </button>
              <button
                type="button"
                className="btn-icon size-10 rounded-full shadow-soft"
                aria-label={musicOn ? "Turn music off" : "Turn music on"}
                aria-pressed={musicOn}
                onClick={() => {
                  music.current ??= new Music();
                  if (music.current.playing) music.current.stop();
                  else music.current.start();
                  setMusicOn(music.current.playing);
                }}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" />
                  {musicOn ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="m16 9.5 5 5m0-5-5 5" />}
                </svg>
              </button>
          <button type="button" className="btn-secondary whitespace-nowrap shadow-soft max-sm:!px-3 max-sm:text-sm" onClick={() => setShowList(true)}>
            <Icon name="clipboard" className="size-4" /> Skip the tour
          </button>
        </div>
      </div>

      {/* HUD: bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-5">
        <div className="w-32 shrink-0">
          {coarse ? (
            <Joystick onMove={(x, y) => engine.current && (engine.current.joy = { x, y })} />
          ) : (
            <p className="glass hidden w-max rounded-xl px-3 py-2 text-xs leading-relaxed text-ink-soft shadow-soft sm:block">
              <b className="text-ink">WASD / arrows</b> move · <b className="text-ink">E</b> interact
              <br />
              <b className="text-ink">Click</b> to walk · <b className="text-ink">M</b> map · <b className="text-ink">V</b> view
            </p>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-[190px] flex justify-center sm:static sm:min-w-0 sm:flex-1" aria-live="polite">
          <AnimatePresence mode="wait">
            {speech ? (
              <SpeechBox key={speech.text} speech={speech} onClose={() => setSpeech(null)} />
            ) : prompt ? (
              <button
                key={prompt.id}
                type="button"
                onClick={() => engine.current?.interact()}
                className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2 pr-2 pl-5 font-medium text-ink shadow-lift"
              >
                {prompt.prompt}
                <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">{coarse ? "Tap" : "E"}</span>
              </button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-2.5">
          <button
            type="button"
            className="btn-icon size-12 rounded-full shadow-soft"
            aria-label={overview ? "Follow Cheryl" : "Zoom out to see everything"}
            aria-pressed={overview}
            onClick={() => setOverview((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button type="button" className="btn-icon size-12 rounded-full shadow-soft" aria-label="Open the campus map" onClick={() => setShowMap(true)}>
            <Icon name="map" className="size-5" />
          </button>
          <button type="button" onClick={onExit} className="rounded-full bg-ink px-6 py-3 font-display text-base font-semibold text-white shadow-lift hover:bg-accent-strong">
            Hop off
          </button>
        </div>
      </div>

      {/* overlays */}
      {showList && (
        <TourList onClose={() => setShowList(false)} onDetails={(id) => setPanel({ id, visit: true })} onVisit={visit} />
      )}
      {showMap && (
        <MapModal
          here={here}
          onClose={() => setShowMap(false)}
          onGo={(p) => {
            setShowMap(false);
            if (p === here) return;
            go(p === "campus" ? { type: "campus", from: spec.type === "room" ? spec.year : undefined } : { type: "room", year: p });
          }}
        />
      )}
      {showSkills && <SkillsPanel onClose={() => setShowSkills(false)} />}
      {showGame && <RetroGame onClose={() => setShowGame(false)} />}
      {panelProject && (
        <ProjectPanel project={panelProject} onClose={() => setPanel(null)} onVisit={panel.visit ? () => visit(panelProject.id) : undefined} />
      )}
    </div>
  );
}
