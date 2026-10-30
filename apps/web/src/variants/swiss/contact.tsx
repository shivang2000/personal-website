import { person } from "@/lib/data/profile";

import { ArrowLink, mailto } from "./primitives";
import s from "./swiss.module.css";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className={s.contact}>
      <div className={`${s.container} ${s.grid}`}>
        <h2 id="contact-title" className={s.contactTitle}>
          Let’s talk.
        </h2>
        <div className={s.contactBody}>
          <p className={s.contactLead}>{person.availability}</p>
          <a href={mailto} className={s.contactEmail}>
            {person.email}
          </a>
          <p className={s.contactWhere}>{person.location}</p>
        </div>
        <ul className={s.contactLinks} aria-label="Elsewhere">
          <li>
            <ArrowLink href={person.links.calendly} external>
              Book 15 minutes
            </ArrowLink>
          </li>
          <li>
            <ArrowLink href={person.links.resume}>Resume (PDF)</ArrowLink>
          </li>
          <li>
            <ArrowLink href={person.links.github} external>
              GitHub
            </ArrowLink>
          </li>
          <li>
            <ArrowLink href={person.links.linkedin} external>
              LinkedIn
            </ArrowLink>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.container} ${s.grid}`}>
        <p className={s.footerName}>
          © {new Date().getFullYear()} {person.name}
        </p>
        <p className={s.footerColophon}>Set in Archivo on a twelve-column grid.</p>
        <a href="#top" className={s.footerTop}>
          Back to top
        </a>
      </div>
    </footer>
  );
}
