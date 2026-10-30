import Image from "next/image";

import { caseStudies, howIWork, openWork, person, proof, roles, stack } from "@/lib/data/profile";
import type { CaseStudy } from "@/lib/data/profile";

import s from "./console.module.css";
import { ContactField } from "./contact-field";
import { capitalise, highlight, mailtoFor, splitFirstSentence, splitPitch } from "./lib";
import { ConsoleRuntime } from "./runtime";

const ROOT_ID = "console-root";

export function ConsolePage() {
	return (
		<div id={ROOT_ID} className={s.root}>
			<a href="#main" className={s.skip}>
				Skip to content
			</a>
			<Header />
			<main id="main">
				<Hero />
				<Record />
				<Incidents />
				<Practice />
				<Experience />
				<OpenSource />
				<Contact />
			</main>
			<Footer />
			<ConsoleRuntime rootId={ROOT_ID} />
		</div>
	);
}

/* ─────────────────────────── header ─────────────────────────── */

function Header() {
	return (
		<header className={s.header} data-console-header data-chapter="ground">
			<span className={s.headerBg} data-bg="ground" aria-hidden />
			<span className={s.headerBg} data-bg="bone" aria-hidden />
			<span className={s.headerBg} data-bg="amber" aria-hidden />
			<a href="#top" className={s.wordmark}>
				{person.name}
			</a>
			<nav aria-label="Sections" className={s.nav}>
				<a href="#record">Record</a>
				<a href="#incidents">Incidents</a>
				<a href="#experience">Experience</a>
				<a href="#open-source">Open source</a>
			</nav>
			<div className={s.headerActions}>
				<a href={person.links.resume} className={s.headerLink}>
					Resume
				</a>
				<a href={mailtoFor()} className={s.headerButton}>
					Email me
				</a>
			</div>
		</header>
	);
}

/* ─────────────────────────── hero ─────────────────────────── */

function Hero() {
	const { lead, tail, layers } = splitPitch(person.pitch);
	const [firstSentence] = splitFirstSentence(person.intro);
	const openTo = person.availability.replace(/^Open to /, "");

	return (
		<section id="top" className={s.hero} data-chapter="ground" aria-labelledby="hero-title">
			<h1 id="hero-title" className={s.heroTitle}>
				<span className={s.heroLead}>{lead}</span>
				{tail ? <span className={s.heroTail}> {tail}</span> : null}
			</h1>

			<div className={s.heroFoot}>
				<p className={s.heroSupport}>{firstSentence}</p>
				<div className={s.heroActions}>
					<a href={mailtoFor()} className={s.button}>
						Email me
					</a>
					<a href={person.links.resume} className={s.textLink}>
						Download resume
					</a>
				</div>
			</div>

			<dl className={s.statusBar} data-ui>
				<div className={s.statusCell}>
					<dt>role</dt>
					<dd>
						<span className={s.liveDot} aria-hidden />
						{person.role}
					</dd>
				</div>
				{layers ? (
					<div className={s.statusCell}>
						<dt>owns</dt>
						<dd>{layers}</dd>
					</div>
				) : null}
				<div className={s.statusCell}>
					<dt>based</dt>
					<dd>{person.location}</dd>
				</div>
				<div className={s.statusCell}>
					<dt>open to</dt>
					<dd>{openTo}</dd>
				</div>
			</dl>
		</section>
	);
}

/* ─────────────────────────── record ─────────────────────────── */

function Record() {
	const [headline, ...rest] = proof;
	const exit = caseStudies.find((c) => c.slug === "kubernetes-exit");
	const measuredAs = exit?.results[0]?.label;

	return (
		<section id="record" className={s.record} data-chapter="ground" aria-labelledby="record-title">
			<div className={s.recordLead} data-reveal-group>
				<h2 id="record-title" className={s.sectionTitle} data-reveal>
					Numbers from production
				</h2>
				{headline ? (
					<div className={s.bigBlock} data-reveal>
						<p className={s.bigFigure}>
							<span className={s.bigValue}>{headline.value}</span>
							{headline.unit ? <span className={s.bigUnit}>{headline.unit}</span> : null}
						</p>
						<p className={s.bigCaption}>
							{capitalise(headline.label)}.{measuredAs ? ` Counted as ${measuredAs}.` : null}{" "}
							{exit ? (
								<a href={`#${exit.slug}`} className={s.inlineLink}>
									Read the report
								</a>
							) : null}
						</p>
					</div>
				) : null}
			</div>

			<div className={s.metricsPanel} data-ui data-reveal-group>
				<div className={s.panelHead} data-reveal>
					<span>Production record</span>
					<span className={s.panelMeta}>{proof.length} readings</span>
				</div>
				<ul className={s.metricList}>
					{rest.map((m) => (
						<li key={m.label} className={s.metricRow} data-reveal>
							<span className={s.metricLabel}>{capitalise(m.label)}</span>
							<span className={s.metricValue}>
								<span aria-hidden data-tick={m.value}>
									{m.value}
								</span>
								<span className={s.srOnly}>{m.value}</span>
								{m.unit ? <span className={s.metricUnit}>{m.unit}</span> : null}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/* ─────────────────────────── incidents ─────────────────────────── */

function Incidents() {
	return (
		<section id="incidents" className={s.incidents} data-chapter="ground" aria-labelledby="incidents-title">
			<div className={s.incidentsAside}>
				<div className={s.incidentsSticky} data-reveal-group>
					<h2 id="incidents-title" className={s.sectionTitle} data-reveal>
						Incident reports
					</h2>
					<p className={s.incidentsNote} data-reveal>
						Problems from an AI travel platform I can't name, written the way I'd write the postmortem: what broke,
						what I did, what changed.
					</p>
					<nav aria-label="Incident reports" className={s.index} data-reveal>
						<ul>
							{caseStudies.map((c) => (
								<li key={c.slug}>
									<a href={`#${c.slug}`} className={s.indexRow} data-spy-link={c.slug}>
										<span className={s.indexName}>{c.title}</span>
										<span className={s.indexValue}>{c.results[0]?.value}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			<div className={s.reports}>
				{caseStudies.map((c) => (
					<Report key={c.slug} study={c} />
				))}
			</div>
		</section>
	);
}

function Report({ study }: { study: CaseStudy }) {
	return (
		<article id={study.slug} className={s.report} data-ui data-spy data-reveal-group aria-labelledby={`${study.slug}-title`}>
			<div className={s.reportBar} data-reveal>
				<span className={s.reportId}>{study.slug}</span>
				<span className={s.reportContext}>{study.context}</span>
				<span className={s.pill}>Resolved</span>
			</div>

			<div className={s.reportBody}>
				<h3 id={`${study.slug}-title`} className={s.reportTitle} data-reveal>
					{study.title}
				</h3>
				<p className={s.reportSummary} data-reveal>
					{study.summary}
				</p>

				<ol className={s.timeline} data-reveal>
					<li className={s.event}>
						<span className={s.eventLabel}>Problem</span>
						<p>{study.problem}</p>
					</li>
					{study.approach.map((step) => (
						<li key={step} className={s.event}>
							<span className={s.eventLabel}>Approach</span>
							<p>{step}</p>
						</li>
					))}
					<li className={s.event} data-kind="result">
						<span className={s.eventLabel}>Result</span>
						<dl className={s.results}>
							{study.results.map((r) => (
								<div key={r.label} className={s.result}>
									<dt>{r.label}</dt>
									<dd>{r.value}</dd>
								</div>
							))}
						</dl>
					</li>
				</ol>

				<ul className={s.chips} aria-label="Stack" data-reveal>
					{study.stack.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
			</div>
		</article>
	);
}

/* ─────────────────────────── how I work ─────────────────────────── */

const INTRO_MARKS = [
	"4+ years at US startups",
	"React and React Native",
	"Python payments backend",
	"AWS and Terraform",
	"parallel Claude Code agents",
] as const;

function Practice() {
	const [, introRest] = splitFirstSentence(person.intro);

	return (
		<section id="practice" className={s.practice} data-chapter="bone" aria-labelledby="practice-title" data-reveal-group>
			<h2 id="practice-title" className={s.sectionTitle} data-reveal>
				How I work
			</h2>
			<div className={s.practiceText} data-reveal>
				<p>{highlight(introRest || person.intro, INTRO_MARKS, s.mark ?? "")}</p>
				{howIWork.map((h) => (
					<p key={h.title}>
						<mark className={s.mark}>{h.title}.</mark> {h.body}
					</p>
				))}
				<p>
					<a href="#contact" className={s.practiceLink}>
						Tell me what you're building.
					</a>
				</p>
			</div>
		</section>
	);
}

/* ─────────────────────────── experience ─────────────────────────── */

function Experience() {
	return (
		<section id="experience" className={s.experience} data-chapter="ground" aria-labelledby="experience-title">
			<div className={s.experienceHead} data-reveal-group>
				<h2 id="experience-title" className={s.sectionTitle} data-reveal>
					Experience
				</h2>
				<p className={s.experienceNote} data-reveal>
					Written as a deploy log, newest first, each with the change I'd point to.
				</p>
			</div>

			<ol className={s.deployLog} data-ui>
				{roles.map((r, i) => (
					<li key={r.company} className={s.deploy} data-reveal-group>
						<div className={s.deployWhen} data-reveal>
							<span className={s.deployPeriod}>{r.period}</span>
							{i === 0 ? <span className={s.pillLive}>Current</span> : null}
						</div>
						<div className={s.deployWho} data-reveal>
							<h3 className={s.deployCompany}>{r.company}</h3>
							<p className={s.deployTitle}>{r.title}</p>
							<p className={s.deployWhere}>{r.location}</p>
						</div>
						<div className={s.deployWhat} data-reveal>
							<p className={s.deployMetric}>{r.metric}</p>
							<p className={s.deploySummary}>{r.summary}</p>
							<ul className={s.chips} aria-label="Stack">
								{r.stack.map((t) => (
									<li key={t}>{t}</li>
								))}
							</ul>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}

/* ─────────────────────────── open source ─────────────────────────── */

function OpenSource() {
	return (
		<section id="open-source" className={s.openSource} data-chapter="ground" aria-labelledby="oss-title">
			<div className={s.ossHead} data-reveal-group>
				<h2 id="oss-title" className={s.sectionTitle} data-reveal>
					Open source
				</h2>
				<p className={s.experienceNote} data-reveal>
					Work you can read without an NDA.
				</p>
			</div>

			<ul className={s.ossList}>
				{openWork.map((w) => (
					<li key={w.name} className={s.ossRow} data-reveal-group>
						<a href={w.href} className={s.ossName} data-reveal>
							{w.name}
							<span className={s.srOnly}> (opens on GitHub)</span>
						</a>
						<div className={s.ossText} data-reveal>
							<p className={s.ossKind}>{w.kind}</p>
							<p className={s.ossSummary}>{w.summary}</p>
							<p className={s.ossDetail}>{w.detail}</p>
						</div>
					</li>
				))}
			</ul>

			<div className={s.toolchain} data-ui data-reveal-group>
				<div className={s.panelHead} data-reveal>
					<h3 className={s.panelTitle}>Toolchain</h3>
					<span className={s.panelMeta}>grouped by how often I reach for it</span>
				</div>
				<dl className={s.toolRows}>
					{stack.map((g) => (
						<div key={g.label} className={s.toolRow} data-reveal>
							<dt>{g.label}</dt>
							<dd>
								<ul className={s.toolItems}>
									{g.items.map((t) => (
										<li key={t}>{t}</li>
									))}
								</ul>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}

/* ─────────────────────────── contact ─────────────────────────── */

function Contact() {
	const github = person.links.github.replace(/^https:\/\//, "");
	return (
		<section id="contact" className={s.contact} data-chapter="amber" aria-labelledby="contact-title">
			<div className={s.contactMain} data-reveal-group>
				<h2 id="contact-title" className={s.contactTitle} data-reveal>
					<span className={s.contactTitleSoft}>Hiring for an AI-native team?</span> Let's talk.
				</h2>
				<div data-reveal>
					<ContactField />
				</div>
				<dl className={s.contactRows} data-reveal>
					<div>
						<dt>Email</dt>
						<dd>
							<a href={mailtoFor()}>{person.email}</a>
						</dd>
					</div>
					<div>
						<dt>Call</dt>
						<dd>
							<a href={person.links.calendly}>Book 15 minutes</a>
						</dd>
					</div>
					<div>
						<dt>GitHub</dt>
						<dd>
							<a href={person.links.github}>{github}</a>
						</dd>
					</div>
					<div>
						<dt>LinkedIn</dt>
						<dd>
							<a href={person.links.linkedin}>Shivang Chheda</a>
						</dd>
					</div>
					<div>
						<dt>Resume</dt>
						<dd>
							<a href={person.links.resume}>Download PDF</a>
						</dd>
					</div>
				</dl>
			</div>
			<figure className={s.portrait} data-reveal-group>
				<div className={s.portraitFrame} data-reveal>
					<Image
						src="/profile.jpeg"
						alt={`${person.name}, arms crossed, smiling, outdoors in evening light`}
						width={960}
						height={1280}
						sizes="(min-width: 1024px) 34vw, 90vw"
						className={s.portraitImg}
					/>
				</div>
				<figcaption className={s.portraitCaption}>{person.location}</figcaption>
			</figure>
		</section>
	);
}

/* ─────────────────────────── footer ─────────────────────────── */

function Footer() {
	return (
		<footer className={s.footer} data-chapter="ground">
			<div className={s.footerRow}>
				<ul className={s.footerLinks}>
					<li>
						<a href={mailtoFor()}>Email</a>
					</li>
					<li>
						<a href={person.links.github}>GitHub</a>
					</li>
					<li>
						<a href={person.links.linkedin}>LinkedIn</a>
					</li>
					<li>
						<a href={person.links.resume}>Resume</a>
					</li>
				</ul>
				<a href="#top" className={s.footerTop}>
					Back to top
				</a>
			</div>
			<p className={s.footerName} aria-hidden>
				{person.name}
			</p>
		</footer>
	);
}
