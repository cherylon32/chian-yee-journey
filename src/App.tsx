import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { About, FunFacts, Skills } from "./components/About";
import { PageBackdrop } from "./components/Backdrops";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { profile } from "./data/profile";

// Loaded only when a visitor opens Explore Mode (keeps the first load fast).
const ExploreMode = lazy(() => import("./explore/ExploreMode"));

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const exploring = useHash().startsWith("#/explore");
  const exitExplore = useCallback(() => {
    window.location.hash = "journey";
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main" className="relative isolate" aria-hidden={exploring || undefined}>
        <PageBackdrop />
        <Hero />
        <About />
        <Skills />
        <FunFacts />
        <Journey />
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-ink-faint">
        © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript & SVG
      </footer>
      {exploring && (
        <Suspense fallback={<div className="fixed inset-0 z-50 grid place-items-center bg-paper text-ink-soft">Loading the campus…</div>}>
          <ExploreMode onExit={exitExplore} />
        </Suspense>
      )}
    </MotionConfig>
    </LazyMotion>
  );
}
