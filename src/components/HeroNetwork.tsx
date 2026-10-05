import { useEffect, useRef } from "react";

// A soft, drifting neural-network graph for the hero background.
// Nodes are tinted with the theme's accent colours and link to nearby nodes
// (and to the pointer). Pauses off-screen; draws one still frame when the
// visitor prefers reduced motion.

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
}

const LINK_DIST = 140;

export function HeroNetwork({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const palette = ["--accent", "--y2024", "--y2026"].map((v) => css.getPropertyValue(v).trim() || "#1f6f5c");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(24, (w * h) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.4 + Math.random() * 1.8,
        c: palette[Math.floor(Math.random() * palette.length)],
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx!.globalAlpha = (1 - d / LINK_DIST) * 0.36;
            ctx!.strokeStyle = a.c;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < LINK_DIST * 1.3) {
          ctx!.globalAlpha = (1 - dp / (LINK_DIST * 1.3)) * 0.5;
          ctx!.strokeStyle = a.c;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(pointer.x, pointer.y);
          ctx!.stroke();
        }
      }
      // nodes
      for (const n of nodes) {
        ctx!.globalAlpha = 0.7;
        ctx!.fillStyle = n.c;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function loop() {
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduced) draw();
      else loop();
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onLeave() {
      pointer.x = pointer.y = -9999;
    }

    resize();
    draw(); // first frame right away, animation once the page has settled
    const idle = window.setTimeout(start, 1200);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && visible && start();
    document.addEventListener("visibilitychange", onVis);
    const host = canvas.parentElement!;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      clearTimeout(idle);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
