import type { CSSProperties } from "react";
import Image from "next/image";

import {
	caseStudies,
	howIWork,
	openWork,
	person,
	proof,
	roles,
	stack,
	type CaseStudy,
} from "@/lib/data/profile";

import { RevealFigures } from "./reveal";
import { countWord, earliestYear, mailto, parts, period, tidy } from "./text";
import s from "./editorial.module.css";

const ROOT_ID = "editorial-root";
const FEATURE_COUNT = 3;

const features = caseStudies.slice(0, FEATURE_COUNT);
const shorter = caseStudies.slice(FEATURE_COUNT);

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/* Footnotes for the proof figures: where on this page each number is told. */
type Note = { href: string; text: string };

function sourceFor(label: string, value: string): Note | null {
	if (/kubernetes|aws/i.test(label)) {
		const study = caseStudies.find((c) => c.slug === "kubernetes-exit");
		if (!study) return null;
		const n = caseStudies.indexOf(study) + 1;
		return { href: `#${study.slug}`, text: `“${study.title},” article ${n}.` };
	}
	const role = roles.find((r) => r.metric.includes(value));
	if (role) return { href: "#record", text: `${role.company}, ${role.title.split(",")[0]}.` };
	return null;
}

const notes: Note[] = [];
const figures = proof.map((p) => {
	const src = sourceFor(p.label, p.value);
	let mark: number | null = null;
	if (src) {
		const at = notes.findIndex((n) => n.href === src.href && n.text === src.text);
		mark = (at >= 0 ? at : notes.push(src) - 1) + 1;
	}
	return { ...p, mark };
});

export function EditorialPage() {
	const [leadFigure, ...restFigures] = figures;
	const [leadWork, ...restWork] = openWork;
	const since = earliestYear(roles.map((r) => r.period));

	return (
		<div id={ROOT_ID} className={s.root} data-theme="editorial">
			<a className={s.skip} href="#main">
				Skip to the articles
			</a>

			<header className={s.masthead} id="top">
				<div className={s.container}>
					<div className={s.mastRow}>
						<a className={s.nameplate} href="#top" aria-label={`${person.name}, back to the top`}>
							{person.name}
						</a>
						<nav aria-label="Sections">
							<ul className={s.navList}>
								<li className={s.navOptional}>
									<a href="#articles">Articles</a>
								</li>
								<li className={s.navOptional}>
									<a href="#record">Record</a>
								</li>
								<li className={s.navOptional}>
									<a href="#open-work">Open work</a>
								</li>
								<li>
									<a href="#contact">Contact</a>
								</li>
								<li>
									<a href={person.links.resume}>Resume</a>
								</li>
							</ul>
						</nav>
					</div>
					<div className={s.dateline}>
						<p>{person.role}</p>
						<p>{parts(person.location).join(", ")}</p>
						<p className={s.datelineWide}>{person.availability}</p>
					</div>
				</div>
			</header>

			<main id="main">
				{/* The cover: headline, standfirst, the two actions, and the contents. */}
				<section className={s.cover} aria-labelledby="headline">
					<div className={`${s.container} ${s.coverGrid}`}>
						<div className={s.coverMain}>
							<h1 id="headline" className={s.headline}>
								I build the whole product, then I run it in production.
							</h1>
							<p className={s.standfirst}>UI, backend, payments and infra. 4+ years at US startups, fully remote.</p>
							<div className={s.actions}>
								<a className={s.btnPrimary} href={mailto(person.email)}>
									Email me about a role
								</a>
								<a className={s.textLink} href={person.links.resume}>
									Read the resume (PDF)
								</a>
							</div>
						</div>

						<nav className={s.contents} aria-labelledby="contents-head">
							<h2 id="contents-head" className={s.contentsHead}>
								In this issue
							</h2>
							<ol className={s.contentsList}>
								{caseStudies.map((c) => (
									<li key={c.slug}>
										<a href={`#${c.slug}`}>{c.title}</a>
									</li>
								))}
							</ol>
						</nav>
					</div>
				</section>

				{/* The proof, footnoted to where each number is told. */}
				<section className={s.numbers} aria-labelledby="numbers-head">
					<div className={s.container}>
						<h2 id="numbers-head" className={s.sectionHead}>
							Five numbers before the stories
						</h2>
						<div className={s.figureSpread}>
							{leadFigure ? <Figure figure={leadFigure} lead index={0} /> : null}
							<div className={s.figureGrid}>
								{restFigures.map((f, i) => (
									<Figure key={f.label} figure={f} index={i + 1} />
								))}
							</div>
						</div>
						{notes.length > 0 ? (
							<ol className={s.notes} aria-label="Notes">
								{notes.map((n, i) => (
									<li key={n.href + n.text} id={`note-${i + 1}`}>
										<span className={s.noteMark}>{i + 1}</span>
										<a href={n.href}>{n.text}</a>
									</li>
								))}
							</ol>
						) : null}
					</div>
				</section>

				{/* Features: the first three case studies, at full length. */}
				<section id="articles" className={s.articles} aria-label="Articles">
					<ol className={s.featureList}>
						{features.map((c, i) => (
							<li key={c.slug}>
								<Feature study={c} first={i === 0} />
							</li>
						))}
					</ol>
				</section>

				{/* Back of the book: the remaining case studies, short, each opening in place. */}
				<section className={s.shorter} aria-labelledby="shorter-head">
					<div className={s.container}>
						<h2 id="shorter-head" className={s.sectionHead}>
							{countWord(shorter.length)} shorter pieces
						</h2>
						<ol className={s.pieceList} start={FEATURE_COUNT + 1}>
							{shorter.map((c) => (
								<li key={c.slug}>
									<Piece study={c} />
								</li>
							))}
						</ol>
					</div>
				</section>

				<section id="record" className={s.record} aria-labelledby="record-head">
					<div className={s.container}>
						<h2 id="record-head" className={s.sectionHead}>
							{countWord(roles.length)} roles{since ? ` since ${since}` : ""}
						</h2>
						<ol className={s.roleList}>
							{roles.map((r) => (
								<li key={r.company} className={s.role}>
									<p className={s.roleWhen}>
										<span>{period(r.period)}</span>
										<span>{parts(r.location).join(", ")}</span>
									</p>
									<h3 className={s.roleCompany}>{r.company}</h3>
									<p className={s.roleTitle}>{r.title}</p>
									<p className={s.roleMetric}>{r.metric}</p>
									<p className={s.roleSummary}>{tidy(r.summary)}</p>
									<p className={s.footnote}>{r.stack.join(", ")}</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section id="open-work" className={s.openWork} aria-labelledby="open-head">
					<div className={s.container}>
						<h2 id="open-head" className={s.sectionHead}>
							Built in the open
						</h2>
						<div className={s.openGrid}>
							{leadWork ? (
								<article className={s.openLead}>
									<p className={s.kind}>{leadWork.kind}</p>
									<h3 className={s.openName}>{leadWork.name}</h3>
									<p className={s.openSummary}>{leadWork.summary}</p>
									<p className={s.openDetail}>{tidy(leadWork.detail)}</p>
									<a className={s.textLink} href={leadWork.href}>
										{workLinkLabel(leadWork.name, leadWork.href)}
									</a>
								</article>
							) : null}
							<div className={s.openRest}>
								{restWork.map((w) => (
									<article key={w.name} className={s.openItem}>
										<p className={s.kind}>{w.kind}</p>
										<h3 className={s.openNameSmall}>{w.name}</h3>
										<p className={s.openSummarySmall}>{w.summary}</p>
										<p className={s.openDetail}>{tidy(w.detail)}</p>
										<a className={s.textLink} href={w.href}>
											{workLinkLabel(w.name, w.href)}
										</a>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className={s.author} aria-labelledby="author-head">
					<div className={`${s.container} ${s.authorGrid}`}>
						<figure className={s.portrait}>
							<div className={s.portraitFrame}>
								<Image
									src="/profile.jpeg"
									alt={`${person.name}, portrait`}
									width={960}
									height={1280}
									sizes="(max-width: 60rem) 80vw, 360px"
								/>
							</div>
							<figcaption>
								{person.name}, {person.role.toLowerCase()}.
							</figcaption>
						</figure>
						<div className={s.authorText}>
							<h2 id="author-head" className={s.sectionHead}>
								{countWord(howIWork.length)} rules I work by
							</h2>
							<p className={s.intro}>{tidy(person.intro)}</p>
							<ol className={s.rules}>
								{howIWork.map((h) => (
									<li key={h.title}>
										<p>
											<strong>{h.title}.</strong> {h.body}
										</p>
									</li>
								))}
							</ol>
						</div>
					</div>
				</section>

				<section id="contact" className={s.contact} aria-labelledby="contact-head">
					<div className={`${s.container} ${s.contactGrid}`}>
						<h2 id="contact-head" className={s.contactHead}>
							Write to me about the role.
						</h2>
						<div className={s.contactBody}>
							<a className={s.emailLink} href={mailto(person.email)}>
								{person.email}
							</a>
							<ul className={s.contactLinks}>
								<li>
									<a href={person.links.calendly}>Book 15 minutes</a>
								</li>
								<li>
									<a href={person.links.github}>GitHub</a>
								</li>
								<li>
									<a href={person.links.linkedin}>LinkedIn</a>
								</li>
								<li>
									<a href={person.links.resume}>Resume (PDF)</a>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</main>

			<footer className={s.colophon} aria-labelledby="colophon-head">
				<div className={`${s.container} ${s.colophonGrid}`}>
					<h2 id="colophon-head" className={s.colophonHead}>
						The stack, by how often used
					</h2>
					<dl className={s.stackList}>
						{stack.map((g) => (
							<div key={g.label}>
								<dt>{g.label}</dt>
								<dd>{g.items.join(", ")}</dd>
							</div>
						))}
					</dl>
					<p className={s.signoff}>
						Set in Newsreader and IBM Plex Sans. Written, built and shipped by {person.name}.
					</p>
				</div>
			</footer>

			<RevealFigures rootId={ROOT_ID} />
		</div>
	);
}

function workLinkLabel(name: string, href: string): string {
	return href.includes("/pull/") ? "Read the merged pull request" : `Read ${name} on GitHub`;
}

function Figure({
	figure,
	index,
	lead = false,
}: {
	figure: (typeof figures)[number];
	index: number;
	lead?: boolean;
}) {
	return (
		<div className={lead ? s.figureLead : s.figure} data-reveal style={stagger(index)}>
			<p className={s.figValue}>
				<span className={s.figNum}>{figure.value}</span>
				{figure.unit ? <span className={s.figUnit}>{figure.unit}</span> : null}
				{figure.mark ? (
					<sup className={s.figMark}>
						<a href={`#note-${figure.mark}`} aria-label={`Note ${figure.mark}`}>
							{figure.mark}
						</a>
					</sup>
				) : null}
			</p>
			<p className={s.figLabel}>{figure.label}</p>
		</div>
	);
}

function Results({ study, from = 0, reveal = true }: { study: CaseStudy; from?: number; reveal?: boolean }) {
	return (
		<ul className={s.resultList}>
			{study.results.slice(from).map((r, i) => (
				<li key={r.label} className={s.result} data-reveal={reveal ? "" : undefined} style={stagger(i)}>
					<p className={s.resValue}>{r.value}</p>
					<p className={s.resLabel}>{r.label}</p>
				</li>
			))}
		</ul>
	);
}

function Footnote({ study }: { study: CaseStudy }) {
	return (
		<dl className={s.articleNote}>
			<div>
				<dt>Context</dt>
				<dd>{parts(study.context).join(", ")}</dd>
			</div>
			<div>
				<dt>Stack</dt>
				<dd>{study.stack.join(", ")}</dd>
			</div>
		</dl>
	);
}

function Feature({ study, first }: { study: CaseStudy; first: boolean }) {
	const head = `${study.slug}-head`;
	return (
		<article id={study.slug} className={s.feature} aria-labelledby={head}>
			<div className={s.container}>
				<header className={s.featureHead}>
					<h2 id={head} className={s.featureTitle}>
						{study.title}
					</h2>
					<p className={s.featureDek}>{study.summary}</p>
				</header>
				<div className={s.featureBody}>
					<div className={s.featureText}>
						<h3 className={s.partHead}>The problem</h3>
						<p className={first ? `${s.body} ${s.dropCap}` : s.body}>{tidy(study.problem)}</p>
						<h3 className={s.partHead}>What I did</h3>
						<ol className={s.steps}>
							{study.approach.map((a) => (
								<li key={a}>{tidy(a)}</li>
							))}
						</ol>
						<Footnote study={study} />
					</div>
					<aside className={s.results} aria-labelledby={`${study.slug}-results`}>
						<h3 id={`${study.slug}-results`} className={s.partHead}>
							What changed
						</h3>
						<Results study={study} />
					</aside>
				</div>
			</div>
		</article>
	);
}

function Piece({ study }: { study: CaseStudy }) {
	const [lead] = study.results;
	return (
		<article id={study.slug} className={s.piece} aria-labelledby={`${study.slug}-head`}>
			<h3 id={`${study.slug}-head`} className={s.pieceTitle}>
				{study.title}
			</h3>
			<p className={s.pieceDek}>{study.summary}</p>
			{lead ? (
				<div className={s.pieceFig} data-reveal>
					<p className={s.resValue}>{lead.value}</p>
					<p className={s.resLabel}>{lead.label}</p>
				</div>
			) : null}
			<details className={s.pieceMore}>
				<summary>
					<span className={s.whenClosed}>Read the full piece</span>
					<span className={s.whenOpen}>Close the piece</span>
				</summary>
				<div className={s.pieceBody}>
					<div className={s.featureText}>
						<h4 className={s.partHead}>The problem</h4>
						<p className={s.body}>{tidy(study.problem)}</p>
						<h4 className={s.partHead}>What I did</h4>
						<ol className={s.steps}>
							{study.approach.map((a) => (
								<li key={a}>{tidy(a)}</li>
							))}
						</ol>
						<Footnote study={study} />
					</div>
					<div className={s.results}>
						<h4 className={s.partHead}>Also changed</h4>
						<Results study={study} from={1} reveal={false} />
					</div>
				</div>
			</details>
		</article>
	);
}
