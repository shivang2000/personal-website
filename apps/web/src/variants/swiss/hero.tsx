import type { CSSProperties } from "react";

import { ArrowRight } from "lucide-react";

import { caseStudies, person, proof } from "@/lib/data/profile";

import { ArrowLink, Figure, mailto, pad, roleId, Rule } from "./primitives";
import s from "./swiss.module.css";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#method", label: "How I work" },
  { href: "#experience", label: "Experience" },
  { href: "#open-source", label: "Open source" },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The sentence of the intro that says what the case studies are from. */
const standfirst = person.intro.split(/(?<=\.)\s+/).find((sentence) => sentence.startsWith("Lately"));

type ProofRef = (typeof proof)[number]["ref"];

function source(ref: ProofRef) {
  if (ref.kind === "case") {
    const index = caseStudies.findIndex((study) => study.slug === ref.id);
    return { href: `#${ref.id}`, label: index >= 0 ? `Case ${pad(index + 1)}` : "Case study" };
  }
  return { href: `#${roleId(ref.id)}`, label: ref.id };
}

function Source({ refTo }: { refTo: ProofRef }) {
  const { href, label } = source(refTo);
  return (
    <ArrowLink href={href} className={s.proofSource}>
      {label}
    </ArrowLink>
  );
}

export function Header() {
  return (
    <header className={s.header}>
      <div className={`${s.container} ${s.grid} ${s.headerInner}`}>
        <a href="#top" className={s.wordmark}>
          {person.name}
        </a>
        <nav aria-label="Sections" className={s.nav}>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.headerActions}>
          <a href={person.links.resume} className={s.headerResume}>
            Resume
          </a>
          <a href={mailto} className={s.headerEmail}>
            Email
          </a>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  const [lead, ...rest] = proof;

  return (
    <section id="top" aria-labelledby="hero-title" className={s.hero}>
      <div className={`${s.container} ${s.grid}`}>
        <h1 id="hero-title" className={s.heroName}>
          {person.name}
        </h1>
        <p className={s.heroMeta}>
          <strong>{person.role}</strong>
          <span>{person.location}</span>
        </p>

        <div className={s.heroBody}>
          <p className={s.pitch}>{person.pitch}</p>
          {standfirst ? <p className={s.standfirst}>{standfirst}</p> : null}
          <p className={s.availability}>{person.availability}</p>
          <div className={s.ctas}>
            <a href={mailto} className={s.ctaPrimary}>
              Email me about a role
              <ArrowRight className={s.ctaIcon} strokeWidth={2.25} aria-hidden />
            </a>
            <a href={person.links.resume} className={s.ctaSecondary}>
              <span className={s.linkText}>Resume (PDF)</span>
            </a>
            <ArrowLink href={person.links.calendly} external className={s.ctaTertiary}>
              Book 15 minutes
            </ArrowLink>
            <ArrowLink href={person.links.github} external className={s.ctaTertiary}>
              GitHub
            </ArrowLink>
          </div>
        </div>

        {lead ? (
          <div className={s.lead}>
            <p className={s.leadFigure}>
              <span className={s.mask}>
                <span className={s.rise} style={delay(100)}>
                  {lead.value}
                </span>
              </span>
              {lead.unit ? <span className={s.leadUnit}>{lead.unit}</span> : null}
            </p>
            <p className={s.leadLabel}>{lead.label}</p>
            <Source refTo={lead.ref} />
          </div>
        ) : null}

        <div className={s.proofRule}>
          <Rule weight="heavy" />
        </div>
        <ul className={s.proof} aria-label="Proof">
          {rest.map((item, i) => (
            <li key={item.label} className={s.proofItem}>
              <p className={s.proofFigure}>
                <span className={s.mask}>
                  <span className={s.rise} style={delay(260 + i * 70)}>
                    {item.value}
                  </span>
                </span>
                {item.unit ? <span className={s.proofUnit}>{item.unit}</span> : null}
              </p>
              <p className={s.proofLabel}>
                <Figure value={item.label} figure={false} />
              </p>
              <Source refTo={item.ref} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
