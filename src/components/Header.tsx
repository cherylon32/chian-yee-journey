import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { DownloadIcon } from "./icons";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
];

const resumes = [
  { href: profile.links.resumePM, label: "Product Management", note: "For product & project roles" },
  { href: profile.links.resumeData, label: "Data Science", note: "For data, ML & analytics roles" },
];

/** "Resume" button with a small menu: pick one resume, or download both. */
function ResumeMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click / Escape; move focus into the menu when it opens
  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const downloadBoth = () => {
    // a short gap between the two so browsers treat them as separate downloads
    resumes.forEach((r, i) =>
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.href;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 400),
    );
    setOpen(false);
  };

  const item = "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-2 focus-visible:bg-surface-2";
  return (
    <div ref={ref} className="relative ml-2">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="btn-primary !px-3.5 !py-2 text-sm"
      >
        <DownloadIcon className="size-4" />
        Resume
        <svg viewBox="0 0 24 24" className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div role="menu" aria-label="Download resume" className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-lift">
          {resumes.map((r) => (
            <a key={r.href} role="menuitem" href={r.href} download onClick={() => setOpen(false)} className={item}>
              <DownloadIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                <span className="block text-sm font-semibold text-ink">{r.label}</span>
                <span className="block text-xs text-ink-faint">{r.note}</span>
              </span>
            </a>
          ))}
          <div className="my-1 border-t border-line" />
          <button type="button" role="menuitem" onClick={downloadBoth} className={item}>
            <DownloadIcon className="mt-0.5 size-4 shrink-0 text-accent" />
            <span className="text-sm font-semibold text-ink">Download both</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="glass fixed inset-x-0 top-0 z-40 border-x-0 border-t-0">
      <a
        href="#main"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-4"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <a href="#top" className="flex items-center gap-2.5 font-display font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-[13px] font-bold text-on-accent" aria-hidden>
            CY
          </span>
          <span>{profile.name}</span>
        </a>
        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <ResumeMenu />
        </div>
      </nav>
    </header>
  );
}
