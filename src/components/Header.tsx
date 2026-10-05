import { profile } from "../data/profile";
import { DownloadIcon } from "./icons";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
];

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
          <a href={profile.links.resumePM} download className="btn-primary ml-2 !px-3.5 !py-2 text-sm">
            <DownloadIcon className="size-4" />
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
