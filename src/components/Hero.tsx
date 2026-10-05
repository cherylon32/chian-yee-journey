import { m } from "motion/react";
import { Glyphs } from "./Glyphs";
import { HeroNetwork } from "./HeroNetwork";
import { profile } from "../data/profile";
import { ArrowDownIcon, DownloadIcon, GitHubIcon, Icon, LinkedInIcon, MailIcon } from "./icons";

export function Hero() {
  const { links } = profile;
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pt-28 pb-24">
      {/* AI / data backdrop: drifting network, quieter behind the text (grid + glow come from PageBackdrop) */}
      <HeroNetwork className="absolute inset-0 size-full [mask-image:linear-gradient(to_right,rgb(0_0_0/0.25),black_55%),linear-gradient(to_bottom,black_70%,transparent)] [mask-composite:intersect]" />
      <Glyphs set="hero" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.35fr_1fr]">
        <m.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[13px] font-medium text-accent">
            <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden />
            {profile.availability}
          </p>

          <h1 className="mt-6 text-5xl leading-[1.05] font-bold sm:text-6xl">
            {profile.name}
            <span className="mt-1 block text-2xl font-medium text-ink-faint sm:mt-0 sm:ml-3 sm:inline sm:align-middle sm:text-3xl">({profile.nickname})</span>
          </h1>
          <p className="mt-3 font-display text-lg font-medium text-ink-soft">{profile.headline}</p>

          <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink">{profile.tagline}</p>


          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={links.resumePM} download className="btn-primary">
              <DownloadIcon className="size-4" /> Resume (Product)
            </a>
            <a href={links.resumeData} download className="btn-secondary">
              <DownloadIcon className="size-4" /> Resume (Data)
            </a>
            <div className="flex gap-2">
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-icon" aria-label="LinkedIn profile">
                <LinkedInIcon className="size-[18px]" />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub profile">
                <GitHubIcon className="size-[18px]" />
              </a>
              <a href={`mailto:${profile.email}`} className="btn-icon" aria-label={`Email ${profile.email}`}>
                <MailIcon className="size-[18px]" />
              </a>
            </div>
          </div>
        </m.div>

        {/* Quick profile */}
        <m.aside
          aria-labelledby="profile-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="card p-0"
        >
          <div className="flex items-center gap-4 border-b border-line px-6 py-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-on-accent" aria-hidden>
              CY
            </span>
            <div>
              <h2 id="profile-title" className="text-lg font-semibold">
                Quick profile
              </h2>
              <p className="text-sm text-ink-faint">
                {profile.name} · "{profile.nickname}"
              </p>
            </div>
          </div>
          <dl className="divide-y divide-line">
            {profile.personal.map((row) => (
              <div key={row.label} className="px-6 py-3.5">
                <dt className="flex items-center gap-3.5 text-xs font-semibold tracking-wide text-ink-faint uppercase">
                  <Icon name={row.icon} className="size-[18px] shrink-0 text-accent" />
                  {row.label}
                </dt>
                <dd className="mt-0.5 pl-8 text-[15px] text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </m.aside>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-sm text-ink-faint hover:text-ink"
      >
        Scroll to explore
        <ArrowDownIcon className="size-4" />
      </a>
    </section>
  );
}
