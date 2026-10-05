// Generates the social preview image (public/og-image.png, 1200×630)
// and the phone home-screen icon (public/apple-touch-icon.png).
// Run after changing your name/tagline:  npm run og
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const ink = "#0f1b2d";
const soft = "#4a5567";
const accent = "#1f6f5c";
const years = [
  ["2024", "#3a7fb0"],
  ["2025", "#2f8f6b"],
  ["2026", "#6b5fb5"],
];
const font = "Segoe UI, Arial, sans-serif";

// a little winding journey trail on the right, echoing the site
const trail = (() => {
  const x0 = 760, x1 = 1110, ys = [190, 330, 470], r = 70;
  let d = `M${x0} ${ys[0]}H${x1}A${r} ${r} 0 0 1 ${x1} ${ys[1]}H${x0}A${r} ${r} 0 0 0 ${x0} ${ys[2]}H${x1}`;
  const stops = [];
  ys.forEach((y, row) => {
    const n = row === 0 ? 3 : row === 1 ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const x = row % 2 === 0 ? x0 + 40 + (x1 - x0 - 80) * t : x1 - 40 - (x1 - x0 - 80) * t;
      stops.push(`<circle cx="${x}" cy="${y}" r="${(row === 1 && i === 0) || (row === 2 && i === 0) ? 17 : 13}" fill="#fff" stroke="${years[row][1]}" stroke-width="4"/>`);
    }
  });
  const pills = years
    .map(([label, c], row) => {
      const x = row % 2 === 0 ? x0 : x1;
      return `<g><rect x="${x - 36}" y="${ys[row] - 17}" width="72" height="34" rx="17" fill="#fff" stroke="${c}" stroke-width="3"/><text x="${x}" y="${ys[row] + 7}" text-anchor="middle" font-family="${font}" font-weight="700" font-size="19" fill="${ink}">${label}</text></g>`;
    })
    .join("");
  return `
    <path d="${d}" fill="none" stroke="#e5e7eb" stroke-width="18" stroke-linecap="round"/>
    <path d="M${x0} ${ys[0]}H${x1}" stroke="${years[0][1]}" stroke-width="5" stroke-linecap="round"/>
    <path d="M${x1} ${ys[0]}A${r} ${r} 0 0 1 ${x1} ${ys[1]}H${x0}" fill="none" stroke="${years[1][1]}" stroke-width="5" stroke-linecap="round"/>
    <path d="M${x0} ${ys[1]}A${r} ${r} 0 0 0 ${x0} ${ys[2]}H${x1}" fill="none" stroke="${years[2][1]}" stroke-width="5" stroke-linecap="round"/>
    ${stops.join("")}${pills}`;
})();

// a faint network motif behind everything
const nodes = [
  [640, 70], [720, 140], [700, 250], [660, 600], [1150, 80], [1180, 600], [980, 590], [690, 470],
];
const links = [[0, 1], [1, 2], [2, 7], [7, 3], [4, 1], [5, 6]];

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.55">
      <stop offset="0" stop-color="#6b5fb5" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#6b5fb5" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#0f1b2d" stroke-opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#fafaf7"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  ${links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#3a7fb0" stroke-opacity="0.18" stroke-width="2"/>`).join("")}
  ${nodes.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${["#1f6f5c", "#3a7fb0", "#6b5fb5"][i % 3]}" fill-opacity="0.45"/>`).join("")}

  <rect x="72" y="70" width="64" height="64" rx="14" fill="${accent}"/>
  <text x="104" y="113" text-anchor="middle" font-family="${font}" font-weight="700" font-size="28" fill="#fff">CY</text>

  <rect x="72" y="170" width="402" height="42" rx="21" fill="#e7f2ee" stroke="${accent}" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="98" cy="191" r="7" fill="${accent}"/>
  <text x="116" y="198" font-family="${font}" font-weight="600" font-size="20" fill="${accent}">Open to Product Management internships</text>

  <text x="70" y="300" font-family="${font}" font-weight="700" font-size="76" fill="${ink}" letter-spacing="-1.5">On Chian Yee</text>
  <text x="72" y="352" font-family="${font}" font-weight="600" font-size="30" fill="${soft}">Aspiring Product Manager · Data Science</text>
  <text x="72" y="420" font-family="${font}" font-size="27" fill="${ink}">I turn data and user needs into</text>
  <text x="72" y="456" font-family="${font}" font-size="27" fill="${ink}">products people actually use.</text>
  <text x="72" y="556" font-family="${font}" font-size="21" fill="${soft}">Master of Data Science · Monash University Malaysia</text>

  ${trail}
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${accent}"/>
  <text x="90" y="114" text-anchor="middle" font-family="${font}" font-weight="700" font-size="76" fill="#fff">CY</text>
</svg>`;

const render = (svg, out) => {
  const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: "Arial" } }).render().asPng();
  writeFileSync(out, png);
  console.log(`wrote ${out} (${(png.length / 1024).toFixed(0)} KB)`);
};
render(og, "public/og-image.png");
render(icon, "public/apple-touch-icon.png");
