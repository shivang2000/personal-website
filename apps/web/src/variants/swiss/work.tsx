import { caseStudies } from "@/lib/data/profile";

import { Figure, pad, Rule } from "./primitives";
import s from "./swiss.module.css";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className={s.section}>
      <div className={`${s.container} ${s.grid}`}>
        <div className={s.sectionRule}>
          <Rule weight="heavy" />
        </div>
        <h2 id="work-title" className={s.h2}>
          Selected work
        </h2>
        <p className={s.sectionNote}>
          Production problems from one AI-native travel platform, written the way I’d write the postmortem: what
          broke, what I did, what changed. The client is confidential, so names and links are gone; every number traces
          to a merged PR or a dated incident note.
        </p>

        <ol className={s.cases}>
          {caseStudies.map((study, i) => (
            <li key={study.slug} id={study.slug} className={s.case}>
              <article aria-labelledby={`case-${study.slug}`} className={s.caseInner}>
                <div className={s.caseRule}>
                  <Rule />
                </div>
                <p className={s.caseNum} aria-hidden>
                  {pad(i + 1)}
                </p>
                <header className={s.caseHead}>
                  <h3 id={`case-${study.slug}`} className={s.h3}>
                    {study.title}
                  </h3>
                  <p className={s.caseSummary}>{study.summary}</p>
                </header>
                <div className={s.caseMeta}>
                  <p>{study.context}</p>
                  <ul aria-label="Stack">
                    {study.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>

                <div className={s.caseProblem}>
                  <h4 className={s.h4}>Problem</h4>
                  <p>{study.problem}</p>
                </div>
                <div className={s.caseApproach}>
                  <h4 className={s.h4}>Approach</h4>
                  <ol className={s.steps}>
                    {study.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className={s.caseResults}>
                  <h4 className={s.h4}>Results</h4>
                  <ul>
                    {study.results.map((result) => (
                      <li key={result.label}>
                        <span className={s.resultFigure}>
                          <Figure value={result.value} />
                        </span>
                        <span className={s.resultLabel}>{result.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
