// One continuous background for the whole page (aria-hidden):
// a faint blueprint grid plus large soft colour glows that alternate from side
// to side as you scroll, so sections blend into each other with no seams.
// Glows sit at fixed pixel steps (not % of page height) so nothing shifts
// while the page is still loading.

const colors = ["var(--accent)", "var(--y2026)", "var(--y2024)"];
const STEP = 640;
const glows = Array.from({ length: 14 }, (_, i) => ({
  top: 40 + i * STEP,
  side: i % 2 ? "left" : "right",
  color: colors[i % colors.length],
  size: i % 2 ? 820 : 900,
}));

export function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {glows.map((g) => (
        <div
          key={g.top}
          className="absolute rounded-full"
          style={{
            top: g.top - g.size / 2,
            [g.side]: -g.size / 2.6,
            width: g.size,
            height: g.size,
            background: `radial-gradient(closest-side, color-mix(in oklab, ${g.color} 13%, transparent), transparent)`,
          }}
        />
      ))}
      <div className="line-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,rgb(0_0_0/0.55)_40%,rgb(0_0_0/0.55)_80%,transparent)]" />
    </div>
  );
}
