// ─────────────────────────────────────────────────────────────
//  A tiny game engine for Explore Mode.
//  The world is plain SVG/HTML (crisp at any zoom); this class only
//  moves the player, resolves collisions, drives the camera and
//  reports what the player is standing next to. No React re-renders
//  happen per frame: it writes styles straight to DOM refs.
// ─────────────────────────────────────────────────────────────

import { emceeMarkup, type Dir } from "../character/emcee";
import type { Year } from "../data/projects";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Interactable {
  id: string;
  x: number;
  y: number;
  /** trigger radius */
  r: number;
  prompt: string;
  kind: "door" | "exit" | "station" | "tree" | "console";
  year?: Year;
  projectId?: string;
  /** which way to face while interacting */
  face?: Dir;
}

export interface SceneData {
  key: string;
  w: number;
  h: number;
  colliders: Rect[];
  interactables: Interactable[];
  /** zoom in far enough that the scene always fills the screen (no empty edges) */
  cover?: boolean;
}

export interface Spawn {
  x: number;
  y: number;
  dir: Dir;
}

interface Callbacks {
  onPrompt: (i: Interactable | null) => void;
  onInteract: (i: Interactable) => void;
  onFirstMove: () => void;
}

const SPEED = 240; // px per second
const FEET_W = 26;
const FEET_H = 12;
export const HERO_W = 58;
export const HERO_H = 87; // 64×96 sprite at ~0.9 scale

const MOVE_KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
};

export class Engine {
  x = 0;
  y = 0;
  dir: Dir = "down";
  paused = false;
  mode: "follow" | "overview" = "follow";
  joy = { x: 0, y: 0 };

  private scene!: SceneData;
  private keys = new Set<string>();
  private target: { x: number; y: number; interact?: string } | null = null;
  private stuck = 0;
  private moving = false;
  private animT = 0;
  private spriteKey = "";
  private zoom = 1;
  private camX = 0;
  private camY = 0;
  private vw = 0;
  private vh = 0;
  private raf = 0;
  private last = 0;
  private promptId: string | null = null;
  private movedOnce = false;
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private ro: ResizeObserver;
  private frames = new Map<string, string>();

  constructor(
    private viewport: HTMLElement,
    private world: HTMLElement,
    private hero: HTMLElement,
    private sprite: HTMLElement,
    private cb: Callbacks,
  ) {
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(viewport);
    this.measure();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.clearKeys);
    viewport.addEventListener("pointerdown", this.onPointerDown);
  }

  /* ── lifecycle ─────────────────────────────── */

  start() {
    this.last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000);
      this.last = t;
      this.update(dt);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.clearKeys);
    this.viewport.removeEventListener("pointerdown", this.onPointerDown);
  }

  setScene(scene: SceneData, spawn: Spawn) {
    this.scene = scene;
    this.x = spawn.x;
    this.y = spawn.y;
    this.dir = spawn.dir;
    this.target = null;
    this.promptId = null;
    this.cb.onPrompt(null);
    this.snapCamera();
  }

  setPaused(p: boolean) {
    this.paused = p;
    if (p) this.clearKeys();
  }

  face(dir: Dir) {
    this.dir = dir;
  }

  /** Called by the UI when the player presses E / taps the prompt. */
  interact() {
    const i = this.current();
    if (i) {
      if (i.face) this.dir = i.face;
      this.cb.onInteract(i);
    }
  }

  current(): Interactable | null {
    return this.scene?.interactables.find((i) => i.id === this.promptId) ?? null;
  }

  /* ── input ─────────────────────────────────── */

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.paused || !(e.code in MOVE_KEYS)) return;
    e.preventDefault();
    this.keys.add(e.code);
    this.target = null;
  };
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);
  private clearKeys = () => {
    this.keys.clear();
    this.joy = { x: 0, y: 0 };
  };

  private onPointerDown = (e: PointerEvent) => {
    if (this.paused || e.target !== this.viewport && !this.world.contains(e.target as Node)) return;
    const r = this.viewport.getBoundingClientRect();
    const wx = (e.clientX - r.left - (this.vw / 2 - this.camX * this.zoom)) / this.zoom;
    const wy = (e.clientY - r.top - (this.vh / 2 - this.camY * this.zoom)) / this.zoom;
    // tapped something interactive? walk to it, then interact on arrival
    const hit = this.scene.interactables.find((i) => Math.hypot(i.x - wx, i.y - wy) < Math.max(70, i.r * 0.9));
    this.target = hit ? { x: hit.x, y: hit.y, interact: hit.id } : { x: wx, y: wy };
    this.stuck = 0;
  };

  /* ── simulation ────────────────────────────── */

  private update(dt: number) {
    if (!this.scene) return;
    let vx = 0;
    let vy = 0;

    if (!this.paused) {
      for (const k of this.keys) {
        vx += MOVE_KEYS[k][0];
        vy += MOVE_KEYS[k][1];
      }
      if (Math.hypot(this.joy.x, this.joy.y) > 0.15) {
        vx += this.joy.x;
        vy += this.joy.y;
        this.target = null;
      }
      if ((vx || vy) === 0 && this.target) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const d = Math.hypot(dx, dy);
        const arriveR = this.target.interact ? 40 : 6;
        if (d < arriveR) {
          const id = this.target.interact;
          this.target = null;
          if (id) {
            this.updatePrompt();
            if (this.promptId === id) this.interact();
          }
        } else {
          vx = dx / d;
          vy = dy / d;
        }
      }
    }

    const len = Math.hypot(vx, vy);
    this.moving = len > 0.01;
    if (this.moving) {
      const k = (SPEED * Math.min(1, len)) / len;
      vx *= k;
      vy *= k;
      this.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? "right" : "left") : vy > 0 ? "down" : "up";
      const bx = this.x;
      const by = this.y;
      this.moveAxis(vx * dt, 0);
      this.moveAxis(0, vy * dt);
      if (this.target && Math.hypot(this.x - bx, this.y - by) < 0.3) {
        if (++this.stuck > 18) this.target = null;
      } else this.stuck = 0;
      if (!this.movedOnce) {
        this.movedOnce = true;
        this.cb.onFirstMove();
      }
    }

    this.updatePrompt();
    this.animate(dt);
    this.updateCamera(dt);
  }

  private moveAxis(dx: number, dy: number) {
    const { w, h, colliders } = this.scene;
    let nx = Math.max(FEET_W / 2, Math.min(w - FEET_W / 2, this.x + dx));
    let ny = Math.max(FEET_H + 30, Math.min(h - 2, this.y + dy));
    for (const c of colliders) {
      const l = nx - FEET_W / 2;
      const t = ny - FEET_H;
      if (l < c.x + c.w && l + FEET_W > c.x && t < c.y + c.h && t + FEET_H > c.y) {
        if (dx > 0) nx = c.x - FEET_W / 2 - 0.01;
        else if (dx < 0) nx = c.x + c.w + FEET_W / 2 + 0.01;
        if (dy > 0) ny = c.y - 0.01;
        else if (dy < 0) ny = c.y + c.h + FEET_H + 0.01;
      }
    }
    this.x = nx;
    this.y = ny;
  }

  private updatePrompt() {
    let best: Interactable | null = null;
    let bestD = Infinity;
    for (const i of this.scene.interactables) {
      const d = Math.hypot(i.x - this.x, i.y - this.y);
      if (d < i.r && d < bestD) {
        best = i;
        bestD = d;
      }
    }
    const id = best?.id ?? null;
    if (id !== this.promptId) {
      this.promptId = id;
      this.cb.onPrompt(best);
    }
  }

  /* ── drawing ───────────────────────────────── */

  private frame(dir: Dir, pose: "walk" | "idle", f: number) {
    const key = `${dir}-${pose}-${f}`;
    let m = this.frames.get(key);
    if (!m) {
      m = `<svg viewBox="0 0 64 96" width="${HERO_W}" height="${HERO_H}" aria-hidden="true">${emceeMarkup({ dir, pose, frame: f })}</svg>`;
      this.frames.set(key, m);
    }
    return [key, m] as const;
  }

  private animate(dt: number) {
    this.animT += dt;
    let pose: "walk" | "idle" = "idle";
    let f = 0;
    if (this.moving) {
      pose = "walk";
      f = Math.floor(this.animT * 8) % 4;
    } else if (this.dir === "down") {
      // idle bob + an occasional blink
      const c = this.animT % 4;
      f = c > 3.8 ? 3 : Math.floor(c * 1.5) % 2;
    }
    const [key, markup] = this.frame(this.dir, pose, f);
    if (key !== this.spriteKey) {
      this.spriteKey = key;
      this.sprite.innerHTML = markup;
    }
    this.hero.style.transform = `translate3d(${this.x - HERO_W / 2}px, ${this.y - HERO_H * 0.94}px, 0)`;
    this.hero.style.zIndex = String(Math.round(this.y) + 1);
  }

  /* ── camera ────────────────────────────────── */

  private measure() {
    this.vw = this.viewport.clientWidth;
    this.vh = this.viewport.clientHeight;
  }

  private targetZoom() {
    if (!this.scene) return 1;
    const fit = Math.min(this.vw / this.scene.w, this.vh / this.scene.h);
    const cover = Math.max(this.vw / this.scene.w, this.vh / this.scene.h);
    if (this.mode === "overview") return fit * 0.96;
    const base = this.vw < 640 ? 0.62 : this.vw < 1100 ? 0.8 : 0.88;
    return Math.max(base, this.scene.cover ? cover : fit);
  }

  private clampCam(z: number) {
    const { w, h } = this.scene;
    const hw = this.vw / (2 * z);
    const hh = this.vh / (2 * z);
    const want = this.mode === "overview" ? { x: w / 2, y: h / 2 } : { x: this.x, y: this.y - 30 };
    return {
      x: w <= hw * 2 ? w / 2 : Math.max(hw, Math.min(w - hw, want.x)),
      // when the whole scene fits, nudge it up a little: the bottom HUD is taller than the top one
      y: h <= hh * 2 ? h / 2 + 34 / z : Math.max(hh, Math.min(h - hh + (this.scene.cover ? 0 : 60 / z), want.y)),
    };
  }

  private snapCamera() {
    this.zoom = this.targetZoom();
    const c = this.clampCam(this.zoom);
    this.camX = c.x;
    this.camY = c.y;
    this.applyCamera();
  }

  private updateCamera(dt: number) {
    const k = this.reduced ? 1 : 1 - Math.pow(0.0015, dt);
    this.zoom += (this.targetZoom() - this.zoom) * k;
    const c = this.clampCam(this.zoom);
    this.camX += (c.x - this.camX) * k;
    this.camY += (c.y - this.camY) * k;
    this.applyCamera();
  }

  private applyCamera() {
    const tx = this.vw / 2 - this.camX * this.zoom;
    const ty = this.vh / 2 - this.camY * this.zoom;
    this.world.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${this.zoom})`;
    // labels stay readable when zoomed out
    this.world.style.setProperty("--label-scale", String(Math.max(1, 0.7 / this.zoom)));
  }
}
