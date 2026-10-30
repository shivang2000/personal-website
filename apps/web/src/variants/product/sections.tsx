import type { CSSProperties, ReactNode } from "react";
import { ArrowUp, ArrowUpRight, FileText, Github, Linkedin } from "lucide-react";

import { howIWork, openWork, person, proof, roles, stack } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { CopyEmail } from "./copy-email";
import { firstSentence, mailtoHref, splitPitch, withPeriod } from "./lib";
import s from "./product.module.css";
import { StackPanel } from "./stack-panel";

const navItems = [
	{ href: "#work", label: "Work" },
	{ href: "#about", label: "How I work" },
	{ href: "#experience", label: "Experience" },
	{ href: "#open-source", label: "Open source" },
] as const;

const initials = person.name
	.split(" ")
	.map((part) => part[0])
	.join("");

function delay(ms: number): CSSProperties {
	return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

export function Nav() {
	return (
		<header className={s.nav}>
			<a href="#top" className={s.brand}>
				<span className={s.brandMark} aria-hidden="true">
					{initials}
				</span>
				{person.name}
			</a>
			<nav aria-label="Sections" className={s.navLinks}>
				{navItems.map((item) => (
					<a key={item.href} href={item.href} className={s.navLink}>
						{item.label}
					</a>
				))}
			</nav>
			<a href={person.links.resume} className={cn(s.btn, s.btnGhost, s.navCta, s.navResume)}>
				Resume
			</a>
			<a href={mailtoHref} className={cn(s.btn, s.btnPrimary, s.navCta)} style={{ paddingRight: 14 }}>
				Email me
			</a>
		</header>
	);
}

function PrimaryCta({ children }: { children: ReactNode }) {
	return (
		<a href={mailtoHref} className={cn(s.btn, s.btnPrimary)}>
			{children}
			<span className={s.btnIcon} aria-hidden="true">
				<ArrowUpRight size={16} strokeWidth={1.75} />
			</span>
		</a>
	);
}

export function Hero() {
	const pitch = splitPitch(person.pitch);
	return (
		<section className={s.hero} id="top" aria-labelledby="product-hero-title">
			<div className={s.heroBackdrop} aria-hidden="true" />
			<div className={s.container}>
				<div className={s.heroGrid}>
					<div>
						<p className={s.pill}>
							<span className={s.dotOk} aria-hidden="true" />
							{person.availability.replace(/\.$/, "")}
						</p>
						<h1 id="product-hero-title" className={s.h1}>
							<span className={s.h1Name}>
								{person.name} <span>· {person.role}</span>
							</span>
							<span className={s.h1Pitch}>
								{pitch ? (
									<>
										{pitch[0]} <span className={s.h1Muted}>— {pitch[1]} —</span> {pitch[2]}
									</>
								) : (
									person.pitch
								)}
							</span>
						</h1>
						<p className={s.heroSub}>{firstSentence(person.intro)}</p>
						<div className={s.heroActions}>
							<PrimaryCta>Email me</PrimaryCta>
							<a href={person.links.resume} className={cn(s.btn, s.btnGhost)}>
								<FileText size={16} strokeWidth={1.5} aria-hidden="true" />
								Resume
							</a>
							<a href={person.links.calendly} className={s.textLink} target="_blank" rel="noreferrer">
								or book 15 minutes
							</a>
						</div>
						<div className={cn(s.heroMeta, s.mono)}>
							<span>{person.location}</span>
							<a href={person.links.github} className={s.textLink} target="_blank" rel="noreferrer">
								<Github size={14} strokeWidth={1.5} aria-hidden="true" />
								GitHub
							</a>
							<a href={person.links.linkedin} className={s.textLink} target="_blank" rel="noreferrer">
								<Linkedin size={14} strokeWidth={1.5} aria-hidden="true" />
								LinkedIn
							</a>
						</div>
					</div>
					<StackPanel />
				</div>

				<ul className={s.proof} aria-label="Proof">
					{proof.map((item) => (
						<li key={item.label} className={s.proofItem}>
							<div className={s.proofValue}>
								{item.value}
								{item.unit && <span className={s.proofUnit}>{item.unit}</span>}
							</div>
							<p className={s.proofLabel}>{item.label}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export function SectionHead({
	id,
	eyebrow,
	title,
	lede,
}: {
	id: string;
	eyebrow: string;
	title: string;
	lede?: ReactNode;
}) {
	return (
		<div className={s.sectionHead} data-reveal="">
			<div>
				<p className={s.eyebrow}>{eyebrow}</p>
				<h2 id={id} className={s.h2}>
					{title}
				</h2>
			</div>
			{lede && <p className={s.lede}>{lede}</p>}
		</div>
	);
}

export function HowIWork() {
	return (
		<section id="about" className={s.section} aria-labelledby="product-about-title">
			<div className={s.container}>
				<SectionHead id="product-about-title" eyebrow="How I work" title="One owner, from the first commit to the pager." />
				<div className={s.workGrid}>
					<p className={s.intro} data-reveal="">
						{person.intro}
					</p>
					<ol className={s.principles}>
						{howIWork.map((item, i) => (
							<li key={item.title} className={s.principle} data-reveal="" style={delay(i * 70)}>
								<span>{String(i + 1).padStart(2, "0")}</span>
								<div>
									<h3>{item.title}</h3>
									<p>{item.body}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}

export function Experience() {
	return (
		<section id="experience" className={s.section} aria-labelledby="product-experience-title">
			<div className={s.container}>
				<SectionHead
					id="product-experience-title"
					eyebrow="Experience"
					title="Where I've shipped."
					lede="Roles, newest first, with the outcome each one is remembered for."
				/>
				<ol className={s.timeline}>
					{roles.map((role) => (
						<li key={role.company} className={s.entry} data-reveal="">
							<div className={cn(s.entryWhen, s.mono)}>
								<b>{role.period}</b>
								{role.location}
							</div>
							<div>
								<h3 className={s.entryCompany}>{role.company}</h3>
								<p className={s.entryTitle}>{role.title}</p>
								<p className={s.entrySummary}>{role.summary}</p>
								<ul className={s.chips} aria-label="Stack">
									{role.stack.map((tool) => (
										<li key={tool} className={s.chip}>
											{tool}
										</li>
									))}
								</ul>
							</div>
							<p className={s.metric}>
								<span className={s.statusDot} style={{ background: "var(--p-accent)" }} aria-hidden="true" />
								{role.metric}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

export function OpenWork() {
	return (
		<section id="open-source" className={s.section} aria-labelledby="product-oss-title">
			<div className={s.container}>
				<SectionHead
					id="product-oss-title"
					eyebrow="Open source"
					title="Tools for working alongside agents."
					lede="Projects and merged contributions, all on GitHub."
				/>
				<ul className={s.oss}>
					{openWork.map((item, i) => (
						<li key={item.name} className={s.ossRow} data-reveal="" style={delay(i * 60)}>
							<div>
								<a href={item.href} className={cn(s.ossName, s.ossLink)} target="_blank" rel="noreferrer">
									{item.name}
									<span className="sr-only"> (opens GitHub)</span>
								</a>
								<p className={cn(s.ossKind, s.mono)}>{item.kind}</p>
							</div>
							<div>
								<p className={s.ossSummary}>{item.summary}</p>
								<p className={s.ossDetail}>{item.detail}</p>
							</div>
							<span className={s.ossArrow} aria-hidden="true">
								<ArrowUpRight size={18} strokeWidth={1.5} />
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export function Toolbox() {
	return (
		<section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="product-stack-title">
			<div className={s.container}>
				<SectionHead
					id="product-stack-title"
					eyebrow="Stack"
					title="Grouped by how often I reach for it."
				/>
				<div className={s.stackGrid}>
					{stack.map((group, i) => (
						<div key={group.label} className={s.stackGroup} data-reveal="" style={delay(i * 60)}>
							<h3>{group.label}</h3>
							<ul className={s.chips}>
								{group.items.map((tool) => (
									<li key={tool} className={s.chip}>
										{tool}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export function Contact() {
	return (
		<section id="contact" className={s.section} style={{ paddingTop: 0 }} aria-labelledby="product-contact-title">
			<div className={s.container}>
				<div className={s.shell} data-reveal="">
					<div className={cn(s.core, s.contact)}>
						<p className={s.eyebrow}>Contact</p>
						<h2 id="product-contact-title" className={s.contactTitle} style={{ marginTop: 14 }}>
							Need one engineer who owns the whole product?
						</h2>
						<p className={s.contactSub}>
							{withPeriod(person.availability)} {withPeriod(person.location)}
						</p>
						<div className={s.contactActions}>
							<PrimaryCta>Email me</PrimaryCta>
							<a href={person.links.calendly} className={cn(s.btn, s.btnGhost)} target="_blank" rel="noreferrer">
								Book 15 minutes
							</a>
							<CopyEmail email={person.email} />
						</div>
						<div className={cn(s.contactLinks, s.mono)}>
							<a href={person.links.github} className={s.textLink} target="_blank" rel="noreferrer">
								<Github size={14} strokeWidth={1.5} aria-hidden="true" />
								GitHub
							</a>
							<a href={person.links.linkedin} className={s.textLink} target="_blank" rel="noreferrer">
								<Linkedin size={14} strokeWidth={1.5} aria-hidden="true" />
								LinkedIn
							</a>
							<a href={person.links.resume} className={s.textLink}>
								<FileText size={14} strokeWidth={1.5} aria-hidden="true" />
								Resume (PDF)
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function Footer() {
	return (
		<footer className={s.container}>
			<div className={cn(s.footer, s.mono)}>
				<span>
					© {new Date().getFullYear()} {person.name}
				</span>
				<a href="#top" className={s.textLink}>
					Back to top <ArrowUp size={12} strokeWidth={1.75} style={{ display: "inline" }} aria-hidden="true" />
				</a>
			</div>
		</footer>
	);
}
