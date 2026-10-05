// ─────────────────────────────────────────────────────────────
//  The emcee: an original chibi Cheryl, drawn as SVG in code.
//  Every pose/direction/frame is generated from these shapes, so
//  the hero, the journey and Explore Mode all share one character.
//
//  Want to restyle her? Change the colours in `palette` below.
//  Want your own art instead? See README → "Swap the character".
// ─────────────────────────────────────────────────────────────

export const palette = {
  outline: "#3a2f3d",
  skin: "#f9dcc8",
  skinShade: "#efc0a6",
  hair: "#231d27",
  hairHi: "#4a3f52",
  polo: "#ffffff",
  poloShade: "#e4e7ef",
  jeans: "#aac9ea",
  jeansShade: "#86a9d2",
  jeansSeam: "#6f93bf",
  shoe: "#ffffff",
  sole: "#d4d9e3",
  watch: "#1d1b22",
  silver: "#c9ccd6",
  leaf: "#77bb8b",
  leafDark: "#4c8c61",
  clip: "#d8b38c",
  blush: "#f6a5a5",
  eye: "#2b2230",
  mouth: "#c9606c",
};

export type Dir = "down" | "up" | "left" | "right";
export type Pose = "idle" | "walk" | "wave" | "talk";

export interface EmceeOptions {
  dir?: Dir;
  pose?: Pose;
  frame?: number;
  /** Adds class names so CSS can animate the waving arm / mouth (hero use). */
  animated?: boolean;
}

export const EMCEE_W = 64;
export const EMCEE_H = 96;

const P = palette;
const line = `stroke="${P.outline}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"`;

/* ── shared bits ─────────────────────────────────────────── */

const shadow = `<ellipse cx="32" cy="90" rx="15" ry="3.2" fill="#000" opacity="0.13"/>`;

function shoe(x: number, y: number, w = 12) {
  return `<rect x="${x}" y="${y}" width="${w}" height="5.2" rx="2.6" fill="${P.shoe}" ${line}/>
  <rect x="${x + 1}" y="${y + 3.4}" width="${w - 2}" height="1.4" rx="0.7" fill="${P.sole}"/>`;
}

/* ── FRONT (facing down) ─────────────────────────────────── */

function front(o: { liftL: number; liftR: number; bob: number; swing: number; blink: boolean; mouth: "smile" | "open"; wave: number | null; animated: boolean }) {
  const { liftL, liftR, bob, swing, blink, mouth, wave, animated } = o;

  const legs = `
  ${shoe(18.5, 82.5 - liftL)}
  ${shoe(33.5, 82.5 - liftR)}
  <path d="M21 63 L31.6 63 L31.2 ${84.5 - liftL} L19.6 ${84.5 - liftL} Z" fill="${P.jeans}" ${line}/>
  <path d="M32.4 63 L43 63 L44.4 ${84.5 - liftR} L32.8 ${84.5 - liftR} Z" fill="${P.jeans}" ${line}/>
  <path d="M27.5 66 L27 ${83 - liftL}" stroke="${P.jeansSeam}" stroke-width="0.6" opacity="0.6"/>
  <path d="M37 66 L37.8 ${83 - liftR}" stroke="${P.jeansSeam}" stroke-width="0.6" opacity="0.6"/>`;

  const armL = `<g transform="rotate(${swing} 18.6 52)">
    <rect x="16.4" y="52" width="4.4" height="11" rx="2.2" fill="${P.skin}" ${line}/>
    <rect x="16.1" y="59.6" width="5" height="2.2" rx="0.6" fill="${P.watch}"/>
    <circle cx="18.6" cy="63.6" r="2.6" fill="${P.skin}" ${line}/>
  </g>`;

  const armR =
    wave === null
      ? `<g transform="rotate(${-swing} 45.4 52)">
    <rect x="43.2" y="52" width="4.4" height="11" rx="2.2" fill="${P.skin}" ${line}/>
    <path d="M43.3 60.4 L47.5 60.4" stroke="${P.silver}" stroke-width="1"/>
    <circle cx="45.4" cy="63.6" r="2.6" fill="${P.skin}" ${line}/>
  </g>`
      : `<g ${animated ? 'class="emcee-wave-arm"' : ""} transform="rotate(${wave} 45 51)">
    <rect x="42.8" y="51" width="4.4" height="11" rx="2.2" fill="${P.skin}" ${line}/>
    <path d="M42.9 58.8 L47.1 58.8" stroke="${P.silver}" stroke-width="1"/>
    <circle cx="45" cy="62.8" r="2.9" fill="${P.skin}" ${line}/>
  </g>`;

  const torso = `
  <rect x="20.4" y="60.5" width="23.2" height="5.2" rx="1.6" fill="${P.jeans}" ${line}/>
  <circle cx="32" cy="63.1" r="0.9" fill="#c8a36b"/>
  <path d="M20.2 61.5 L20.7 53 Q21.2 48.4 26 47.4 L38 47.4 Q42.8 48.4 43.3 53 L43.8 61.5 Q32 63 20.2 61.5 Z" fill="${P.polo}" ${line}/>
  <path d="M22 58.5 Q32 60 42 58.5" stroke="${P.poloShade}" stroke-width="1.2" fill="none"/>
  <path d="M29 47.4 L35 47.4 L32 50.6 Z" fill="${P.skin}"/>
  <path d="M32 50.6 L26.4 47 L25.4 50.6 L29.6 52.6 Z" fill="${P.polo}" ${line}/>
  <path d="M32 50.6 L37.6 47 L38.6 50.6 L34.4 52.6 Z" fill="${P.polo}" ${line}/>
  <path d="M32 51 L32 56.5" stroke="${P.poloShade}" stroke-width="1"/>
  <circle cx="32" cy="53.2" r="0.6" fill="${P.silver}"/>
  <circle cx="32" cy="55.4" r="0.6" fill="${P.silver}"/>
  <path d="M36.2 56.4 Q37.4 53.2 40.4 53.6 Q39.6 56.6 36.2 56.4 Z" fill="${P.leaf}" stroke="${P.leafDark}" stroke-width="0.7"/>
  <path d="M36.6 56 L39.4 54.2" stroke="${P.leafDark}" stroke-width="0.5"/>
  <path d="M21.2 48.8 Q16.8 49.8 15.8 55.6 L21.4 56.6 Z" fill="${P.polo}" ${line}/>
  ${wave === null ? `<path d="M42.8 48.8 Q47.2 49.8 48.2 55.6 L42.6 56.6 Z" fill="${P.polo}" ${line}/>` : ""}`;

  const eyes = blink
    ? `<path d="M22.6 31.6 Q25.5 33.4 28.4 31.6" fill="none" ${line}/>
       <path d="M35.6 31.6 Q38.5 33.4 41.4 31.6" fill="none" ${line}/>`
    : `<ellipse cx="25.5" cy="31" rx="2.9" ry="3.7" fill="${P.eye}"/>
       <ellipse cx="38.5" cy="31" rx="2.9" ry="3.7" fill="${P.eye}"/>
       <circle cx="26.5" cy="29.6" r="1.15" fill="#fff"/>
       <circle cx="39.5" cy="29.6" r="1.15" fill="#fff"/>
       <circle cx="24.7" cy="32.6" r="0.55" fill="#fff"/>
       <circle cx="37.7" cy="32.6" r="0.55" fill="#fff"/>
       <path d="M22.5 28.6 L21.3 27.8" ${line}/>
       <path d="M41.5 28.6 L42.7 27.8" ${line}/>`;

  const mouthSvg =
    mouth === "open"
      ? `<path d="M29.9 36.9 Q32 41.2 34.1 36.9 Z" fill="${P.mouth}" ${line}/>`
      : `<path d="M30 37.2 Q32 39.2 34 37.2" fill="none" ${line}/>`;

  const head = `
  <rect x="29.6" y="42" width="4.8" height="6.5" fill="${P.skin}" ${line}/>
  <ellipse cx="32" cy="27.2" rx="18.4" ry="17.4" fill="${P.hair}" ${line}/>
  <ellipse cx="17.6" cy="31.6" rx="2.2" ry="3" fill="${P.skin}" ${line}/>
  <ellipse cx="46.4" cy="31.6" rx="2.2" ry="3" fill="${P.skin}" ${line}/>
  <ellipse cx="32" cy="30" rx="14.8" ry="13.8" fill="${P.skin}" ${line}/>
  <path d="M14.3 29.5 Q12.8 9.6 32 9.4 Q51.2 9.6 49.7 29.5 Q47.6 21.6 43.2 18.8 Q38 21.2 33.4 18.2 Q31.6 21.4 30.4 18.4 Q24.8 21.4 20.8 18.8 Q16.6 21.8 14.3 29.5 Z" fill="${P.hair}" ${line}/>
  <path d="M22 14.2 Q32 10.2 42 14.2" stroke="${P.hairHi}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M17.2 20.4 Q14.2 30.4 17.6 40.4 Q18.8 41.4 19.2 39.6 Q17.2 31 19.8 21.2 Z" fill="${P.hair}" ${line}/>
  <path d="M46.8 20.4 Q49.8 30.4 46.4 40.4 Q45.2 41.4 44.8 39.6 Q46.8 31 44.2 21.2 Z" fill="${P.hair}" ${line}/>
  <path d="M22.8 25.3 Q25.5 24.1 28.2 25.3" stroke="${P.hair}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M35.8 25.3 Q38.5 24.1 41.2 25.3" stroke="${P.hair}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  ${eyes}
  <ellipse cx="22" cy="36" rx="2.6" ry="1.4" fill="${P.blush}" opacity="0.75"/>
  <ellipse cx="42" cy="36" rx="2.6" ry="1.4" fill="${P.blush}" opacity="0.75"/>
  <g ${animated ? 'class="emcee-mouth"' : ""}>${mouthSvg}</g>`;

  return `${shadow}${legs}<g transform="translate(0 ${bob})">${armL}${wave === null ? "" : armR}${torso}${wave === null ? armR : ""}${head}</g>`;
}

/* ── BACK (facing up) ────────────────────────────────────── */

function back(o: { liftL: number; liftR: number; bob: number; swing: number }) {
  const { liftL, liftR, bob, swing } = o;
  const legs = `
  ${shoe(18.5, 82.5 - liftL)}
  ${shoe(33.5, 82.5 - liftR)}
  <path d="M21 63 L31.6 63 L31.2 ${84.5 - liftL} L19.6 ${84.5 - liftL} Z" fill="${P.jeans}" ${line}/>
  <path d="M32.4 63 L43 63 L44.4 ${84.5 - liftR} L32.8 ${84.5 - liftR} Z" fill="${P.jeans}" ${line}/>
  <path d="M23 66.5 L29.5 66.5 L29 71 L23.4 71 Z" fill="none" stroke="${P.jeansSeam}" stroke-width="0.7"/>
  <path d="M34.5 66.5 L41 66.5 L40.6 71 L35 71 Z" fill="none" stroke="${P.jeansSeam}" stroke-width="0.7"/>`;
  const arm = (x: number, rot: number, watch: boolean) => `<g transform="rotate(${rot} ${x + 2.2} 52)">
    <rect x="${x}" y="52" width="4.4" height="11" rx="2.2" fill="${P.skin}" ${line}/>
    ${watch ? `<rect x="${x - 0.3}" y="59.6" width="5" height="2.2" rx="0.6" fill="${P.watch}"/>` : ""}
    <circle cx="${x + 2.2}" cy="63.6" r="2.6" fill="${P.skin}" ${line}/>
  </g>`;
  const torso = `
  <rect x="20.4" y="60.5" width="23.2" height="5.2" rx="1.6" fill="${P.jeans}" ${line}/>
  <path d="M20.2 61.5 L20.7 53 Q21.2 48.4 26 47.4 L38 47.4 Q42.8 48.4 43.3 53 L43.8 61.5 Q32 63 20.2 61.5 Z" fill="${P.polo}" ${line}/>
  <path d="M25.6 47.6 Q32 50.8 38.4 47.6 L38.4 49.4 Q32 52.6 25.6 49.4 Z" fill="${P.poloShade}" ${line}/>
  <path d="M21.2 48.8 Q16.8 49.8 15.8 55.6 L21.4 56.6 Z" fill="${P.polo}" ${line}/>
  <path d="M42.8 48.8 Q47.2 49.8 48.2 55.6 L42.6 56.6 Z" fill="${P.polo}" ${line}/>`;
  const head = `
  <rect x="29.6" y="42" width="4.8" height="6.5" fill="${P.skin}" ${line}/>
  <ellipse cx="15.6" cy="31.6" rx="2.2" ry="3" fill="${P.skin}" ${line}/>
  <ellipse cx="48.4" cy="31.6" rx="2.2" ry="3" fill="${P.skin}" ${line}/>
  <ellipse cx="32" cy="27.6" rx="17.6" ry="17" fill="${P.hair}" ${line}/>
  <path d="M22 15.4 Q32 10.6 42 15.4" stroke="${P.hairHi}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M24 26 Q28 31 30.4 35.4" stroke="${P.hairHi}" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M40 26 Q36 31 33.6 35.4" stroke="${P.hairHi}" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.7"/>
  <ellipse cx="32" cy="40.2" rx="6.6" ry="5.2" fill="${P.hair}" ${line}/>
  <path d="M27.6 38.4 Q32 36.2 36.4 38.4" stroke="${P.clip}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  return `${shadow}${legs}<g transform="translate(0 ${bob})">${arm(16.4, swing, true)}${arm(43.2, -swing, false)}${torso}${head}</g>`;
}

/* ── SIDE (facing right; left is mirrored) ───────────────── */

function side(o: { step: number; bob: number; swing: number; blink: boolean; mouth: "smile" | "open" }) {
  const { step, bob, swing, blink, mouth } = o;
  const leg = (dx: number, fill: string) => {
    const fx = 32.5 + dx;
    return `${shoe(fx - 5, 82.5, 11.5)}
    <path d="M27.6 63 L37.4 63 L${fx + 5.3} 84.5 L${fx - 5.3} 84.5 Z" fill="${fill}" ${line}/>`;
  };
  const legs = `${leg(-step, P.jeansShade)}${leg(step, P.jeans)}`;
  const arm = `<g transform="rotate(${swing} 32.5 51)">
    <rect x="30.3" y="51" width="4.4" height="11.4" rx="2.2" fill="${P.skin}" ${line}/>
    <rect x="30" y="58.8" width="5" height="2.2" rx="0.6" fill="${P.watch}"/>
    <circle cx="32.5" cy="63" r="2.6" fill="${P.skin}" ${line}/>
  </g>`;
  const torso = `
  <rect x="25.6" y="60.5" width="14" height="5.2" rx="1.6" fill="${P.jeans}" ${line}/>
  <path d="M25.2 61.5 L25.6 53 Q26 48.2 30 47.4 L35.4 47.4 Q39.4 48.2 39.8 53 L40.2 61.5 Q32.7 62.8 25.2 61.5 Z" fill="${P.polo}" ${line}/>
  <path d="M34.2 47.4 L39.2 49.4 L36.4 51.8 Z" fill="${P.polo}" ${line}/>
  <path d="M36.4 56.6 Q37.4 53.8 40 54.2 Q39.4 56.8 36.4 56.6 Z" fill="${P.leaf}" stroke="${P.leafDark}" stroke-width="0.7"/>`;
  const sleeve = `<path d="M28.4 49 Q32.5 46.6 36.6 49 L37.2 55.4 Q32.5 56.8 27.8 55.4 Z" fill="${P.polo}" ${line}/>`;
  const eye = blink
    ? `<path d="M39.6 31.8 Q42.2 33.4 44.6 31.8" fill="none" ${line}/>`
    : `<ellipse cx="42.2" cy="31" rx="2.5" ry="3.6" fill="${P.eye}"/>
       <circle cx="43" cy="29.6" r="1.05" fill="#fff"/>
       <path d="M44.6 28.4 L45.8 27.6" ${line}/>`;
  const mouthSvg =
    mouth === "open"
      ? `<path d="M44.2 37 Q46 40.6 47.4 37 Z" fill="${P.mouth}" ${line}/>`
      : `<path d="M44.2 37.4 Q45.8 38.8 47.2 37.2" fill="none" ${line}/>`;
  const head = `
  <rect x="30" y="42" width="5" height="6.5" fill="${P.skin}" ${line}/>
  <circle cx="16.4" cy="35.6" r="5.6" fill="${P.hair}" ${line}/>
  <path d="M15.4 29.8 L17.6 35.2" stroke="${P.clip}" stroke-width="2.4" stroke-linecap="round"/>
  <ellipse cx="33" cy="29" rx="15.6" ry="14.6" fill="${P.skin}" ${line}/>
  <path d="M17.4 32 Q15 10.4 33 10 Q49.6 10 49.6 25.2 Q45.4 19.6 39.6 20.6 Q37.4 23.4 35.6 22.4 Q33.4 28 30.6 33.6 Q27 39.4 23.6 41.2 Q18.4 38.6 17.4 32 Z" fill="${P.hair}" ${line}/>
  <path d="M22 15.6 Q31 11.6 40 14" stroke="${P.hairHi}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="31.4" cy="31.4" rx="2.2" ry="2.9" fill="${P.skin}" ${line}/>
  <path d="M35.2 21.6 Q33.4 29.6 35 37.6 Q35.9 38.4 36.3 37.2 Q35.2 30 36.9 22.2 Z" fill="${P.hair}" ${line}/>
  <path d="M39.8 25.6 Q42.4 24.4 45 25.4" stroke="${P.hair}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  ${eye}
  <ellipse cx="44.2" cy="35.4" rx="2.2" ry="1.3" fill="${P.blush}" opacity="0.75"/>
  ${mouthSvg}`;
  return `${shadow}${legs}<g transform="translate(0 ${bob})">${torso}${arm}${sleeve}${head}</g>`;
}

/* ── public API ──────────────────────────────────────────── */

/** Inner SVG markup (no <svg> wrapper) for one frame. */
export function emceeMarkup({ dir = "down", pose = "idle", frame = 0, animated = false }: EmceeOptions = {}): string {
  const f = ((frame % 4) + 4) % 4;
  const walking = pose === "walk";
  const liftL = walking && f === 1 ? 2.6 : 0;
  const liftR = walking && f === 3 ? 2.6 : 0;
  const bob = walking ? (f % 2 === 1 ? -1 : 0) : pose === "idle" && f % 2 === 1 ? 0.6 : 0;
  const swing = walking ? (f === 1 ? 10 : f === 3 ? -10 : 0) : 0;
  const blink = pose === "idle" && f === 3;
  const mouth = pose === "talk" && f % 2 === 1 ? "open" : "smile";

  if (dir === "up") return back({ liftL, liftR, bob, swing });
  if (dir === "left" || dir === "right") {
    const step = walking ? [0, 5.5, 0, -5.5][f] : 0;
    const body = side({ step, bob, swing: walking ? [0, -22, 0, 22][f] : 0, blink, mouth });
    return dir === "right" ? body : `<g transform="translate(64 0) scale(-1 1)">${body}</g>`;
  }
  const wave = pose === "wave" ? (f % 2 === 0 ? -140 : -118) : null;
  return front({ liftL, liftR, bob, swing, blink, mouth: pose === "wave" ? "open" : mouth, wave, animated });
}

/** Full standalone SVG string for one frame. */
export function emceeSvg(opts: EmceeOptions = {}, scale = 1): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${EMCEE_W} ${EMCEE_H}" width="${EMCEE_W * scale}" height="${EMCEE_H * scale}">${emceeMarkup(opts)}</svg>`;
}
