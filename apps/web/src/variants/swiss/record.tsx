import { howIWork, openWork, person, roles, stack } from "@/lib/data/profile";

import { ArrowLink, roleId, Rule } from "./primitives";
import s from "./swiss.module.css";

function SectionHead({ id, title, note }: { id: string; title: string; note?: string }) {
  return (
    <>
      <div className={s.sectionRule}>
        <Rule weight="heavy" />
      </div>
      <h2 id={id} className={s.h2}>
        {title}
      </h2>
      {note ? <p className={s.sectionNote}>{note}</p> : null}
    </>
  );
}

/** "2025 — now": the open end of the current role is set in red. */
function Period({ period }: { period: string }) {
  const [start, end] = period.split(/\s*—\s*/);
  if (end !== "now") return <>{period}</>;
  return (
    <>
      {start} — <span className={s.now}>now</span>
    </>
  );
}

export function Method() {
  return (
    <section id="method" aria-labelledby="method-title" className={s.section}>
      <div className={`${s.container} ${s.grid}`}>
        <SectionHead id="method-title" title="How I work" />
        <p className={s.methodIntro}>{person.intro}</p>
        <dl className={s.principles}>
          {howIWork.map((p) => (
            <div key={p.title} className={s.principle}>
              <dt>{p.title}</dt>
              <dd>{p.body}</dd>
            </div>
          ))}
        </dl>

        <h3 className={s.stackTitle}>Stack</h3>
        <div className={s.stackGroups}>
          {stack.map((group) => (
            <div key={group.label} className={s.stackGroup}>
              <h4 className={s.h4}>{group.label}</h4>
              <ul>
                {group.items.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={s.signal}>Tell me what you’re building.</p>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className={s.section}>
      <div className={`${s.container} ${s.grid}`}>
        <SectionHead id="experience-title" title="Experience" note="Public roles, most recent first." />
        <ol className={s.rows}>
          {roles.map((role) => (
            <li key={role.company} id={roleId(role.company)} className={s.role}>
              <div className={s.rowRule}>
                <Rule />
              </div>
              <p className={s.rolePeriod}>
                <Period period={role.period} />
              </p>
              <div className={s.roleWho}>
                <h3 className={s.roleCompany}>{role.company}</h3>
                <p>{role.title}</p>
                <p className={s.roleWhere}>{role.location}</p>
              </div>
              <div className={s.roleWhat}>
                <p>{role.summary}</p>
                <p className={s.inlineStack}>{role.stack.join(" / ")}</p>
              </div>
              <p className={s.roleMetric}>{role.metric}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function OpenWork() {
  return (
    <section id="open-source" aria-labelledby="open-title" className={s.section}>
      <div className={`${s.container} ${s.grid}`}>
        <SectionHead id="open-title" title="Open source" note="Work you can read line by line." />
        <ul className={s.rows}>
          {openWork.map((item) => (
            <li key={item.name} className={s.openItem}>
              <div className={s.rowRule}>
                <Rule />
              </div>
              <div className={s.openName}>
                <h3 className={s.openTitle}>
                  <ArrowLink href={item.href} external className={s.openLink}>
                    {item.name}
                  </ArrowLink>
                </h3>
                <p className={s.openKind}>{item.kind}</p>
              </div>
              <p className={s.openSummary}>{item.summary}</p>
              <p className={s.openDetail}>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
