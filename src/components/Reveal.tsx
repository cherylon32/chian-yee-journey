import { m } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export type Place = "in" | "above" | "below";
const OFFSET = 28;

/**
 * Tracks where an element is relative to the viewport for two-way scroll
 * animations. "in" once it's 60px inside the viewport; resets to "above" or
 * "below" only once it's completely off-screen (so it never blinks out).
 */
export function useScrollPlace<T extends Element>(ref: RefObject<T | null>): Place {
  const [place, setPlace] = useState<Place>("below");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setPlace("in");
      },
      { rootMargin: "-60px 0px" },
    );
    const exit = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setPlace(e.boundingClientRect.top < 0 ? "above" : "below");
    });
    enter.observe(el);
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, [ref]);
  return place;
}

/**
 * Two-way scroll reveal: content floats UP when it enters from below
 * (scrolling down) and floats DOWN when it enters from above (scrolling up).
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const place = useScrollPlace(ref);
  const shown = place === "in";
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: OFFSET }}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : place === "above" ? -OFFSET : OFFSET }}
      transition={shown ? { duration: 0.55, delay, ease: "easeOut" } : { duration: 0 }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-lg text-ink-soft">{intro}</p>}
    </Reveal>
  );
}
