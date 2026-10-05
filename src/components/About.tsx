import { profile } from "../data/profile";
import { Glyphs } from "./Glyphs";
import { Icon } from "./icons";
import { Reveal, SectionHeading } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative">
      <Glyphs set="about" />
      <div className="relative mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="About me" title="From data science to product" />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="card space-y-4 p-8 text-[17px] leading-relaxed text-ink-soft">
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>

          <Reveal delay={0.08} className="card p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Icon name="target" className="size-5 text-accent" /> What I'm looking for
            </h3>
            <div className="mt-5 border-l-2 border-accent pl-4">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">First choice</p>
              <p className="mt-1 font-display text-lg font-semibold">{profile.lookingFor.first}</p>
            </div>
            <p className="mt-6 text-sm font-medium text-ink-faint">Also open to</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {profile.lookingFor.also.map((r) => (
                <li key={r} className="chip">
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative">
      <Glyphs set="skills" />
      <div className="relative mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="Toolbox" title="Skills & background" />
        <div className="grid gap-6 md:grid-cols-3">
          {profile.skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06} className="card">
              <h3 className="flex items-center gap-2.5 text-lg font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={g.icon} />
                </span>
                {g.group}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <Reveal className="card">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Icon name="cap" className="size-5 text-accent" /> Education
            </h3>
            <ol className="mt-5 space-y-5 border-l border-line pl-5">
              {profile.education.map((e) => (
                <li key={e.degree} className="relative">
                  <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-surface bg-accent ring-1 ring-accent/30" />
                  <p className="font-semibold">{e.degree}</p>
                  <p className="text-sm text-ink-soft">
                    {e.school} · {e.dates}
                  </p>
                  {"note" in e && <p className="mt-1 text-sm text-ink-faint">{e.note}</p>}
                </li>
              ))}
            </ol>
          </Reveal>
          <div className="grid gap-6">
            <Reveal delay={0.06} className="card">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Icon name="award" className="size-5 text-accent" /> Certifications
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {profile.certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="card">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Icon name="globe" className="size-5 text-accent" /> Languages
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {profile.languages.map((l) => (
                  <li key={l} className="chip">
                    {l}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FunFacts() {
  if (profile.funFacts.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-4">
      <Reveal className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Outside of work</h3>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
          {profile.funFacts.map((f) => (
            <li key={f.text} className="flex items-center gap-2">
              <Icon name={f.icon} className="size-[18px] text-accent" />
              {f.text}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
