"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import { caseStudies, type CaseStudy } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { CaseVisual } from "./case-visuals";
import s from "./product.module.css";

/** lg spans for a 12-col bento; md is a 2-col grid where the first and last tile run full width. */
const layout = [
	"md:col-span-2 lg:col-span-7",
	"lg:col-span-5",
	"lg:col-span-4",
	"lg:col-span-4",
	"lg:col-span-4",
	"md:col-span-2 lg:col-span-12",
] as const;

const HASH_PREFIX = "#case-";
const EXIT_MS = 220;

function pad(n: number) {
	return String(n).padStart(2, "0");
}

function canTrackPointer() {
	return (
		window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function Tile({
	study,
	index,
	wide,
	onOpen,
}: {
	study: CaseStudy;
	index: number;
	wide: boolean;
	onOpen: (index: number, trigger: HTMLElement) => void;
}) {
	const glowRef = useRef<HTMLDivElement>(null);
	const moveRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

	useEffect(() => {
		return () => {
			if (glowRef.current) gsap.killTweensOf(glowRef.current);
		};
	}, []);

	// Decorative pointer-follow light. Springy (quickTo with power3) so it trails the cursor
	// instead of snapping, and retargets mid-flight when the pointer changes direction.
	const onPointerEnter = (event: React.PointerEvent<HTMLElement>) => {
		const glow = glowRef.current;
		if (!glow || !canTrackPointer()) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const half = glow.offsetWidth / 2;
		gsap.set(glow, { x: event.clientX - rect.left - half, y: event.clientY - rect.top - half });
		moveRef.current ??= {
			x: gsap.quickTo(glow, "x", { duration: 0.5, ease: "power3" }),
			y: gsap.quickTo(glow, "y", { duration: 0.5, ease: "power3" }),
		};
	};

	const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
		const glow = glowRef.current;
		const move = moveRef.current;
		if (!glow || !move) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const half = glow.offsetWidth / 2;
		move.x(event.clientX - rect.left - half);
		move.y(event.clientY - rect.top - half);
	};

	return (
		<article
			className={cn(s.tile, wide && s.tileWide)}
			onPointerEnter={onPointerEnter}
			onPointerMove={onPointerMove}
		>
			<div ref={glowRef} className={s.glow} aria-hidden="true" />
			<div className={s.tileText}>
				<div className={cn(s.tileTop, s.mono)}>
					<span>Case {pad(index + 1)}</span>
					<span>{study.stack.slice(0, 2).join(" · ")}</span>
				</div>
				<h3 className={s.tileTitle}>
					<button
						type="button"
						className={s.tileButton}
						aria-haspopup="dialog"
						data-case-index={index}
						onClick={(event) => onOpen(index, event.currentTarget)}
					>
						{study.title}
					</button>
				</h3>
				<p className={s.tileSummary}>{study.summary}</p>
			</div>
			<div className={s.tileViz}>
				<CaseVisual study={study} />
			</div>
			<div className={s.tileFoot}>
				<span>{study.context}</span>
				<span className={s.tileOpen} aria-hidden="true">
					Read case <ArrowRight size={14} strokeWidth={1.75} />
				</span>
			</div>
		</article>
	);
}

function CaseDetail({ study }: { study: CaseStudy }) {
	return (
		<>
			<h2 id="product-case-title" className={s.dialogTitle}>
				{study.title}
			</h2>
			<p className={s.dialogLede}>{study.summary}</p>

			<div className={s.dialogViz}>
				<CaseVisual study={study} />
			</div>

			<section className={s.dialogSection} aria-labelledby="product-case-problem">
				<h3 id="product-case-problem">Problem</h3>
				<p>{study.problem}</p>
			</section>

			<section className={s.dialogSection} aria-labelledby="product-case-approach">
				<h3 id="product-case-approach">Approach</h3>
				<ol className={s.steps}>
					{study.approach.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ol>
			</section>

			<section className={s.dialogSection} aria-labelledby="product-case-results">
				<h3 id="product-case-results">Results</h3>
				<ul className={s.results}>
					{study.results.map((result) => (
						<li key={result.label} className={s.result}>
							<div className={s.resultValue}>{result.value}</div>
							<div className={s.resultLabel}>{result.label}</div>
						</li>
					))}
				</ul>
			</section>

			<section className={s.dialogSection} aria-labelledby="product-case-stack">
				<h3 id="product-case-stack">Stack</h3>
				<ul className={s.chips}>
					{study.stack.map((tool) => (
						<li key={tool} className={s.chip}>
							{tool}
						</li>
					))}
				</ul>
			</section>
		</>
	);
}

export function WorkBento() {
	const [active, setActive] = useState<number | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const closeTimer = useRef<number | undefined>(undefined);

	const open = useCallback((index: number, trigger?: HTMLElement) => {
		window.clearTimeout(closeTimer.current);
		dialogRef.current?.removeAttribute("data-closing");
		if (trigger) triggerRef.current = trigger;
		setActive(index);
	}, []);

	// Single cleanup path: runs for our animated close and for any native close (e.g. a forced Esc).
	const onClosed = useCallback(() => {
		window.clearTimeout(closeTimer.current);
		dialogRef.current?.removeAttribute("data-closing");
		document.documentElement.style.removeProperty("overflow");
		setActive(null);
		history.replaceState(null, "", window.location.pathname + window.location.search);
		triggerRef.current?.focus({ preventScroll: true });
	}, []);

	const close = useCallback(() => {
		const dialog = dialogRef.current;
		if (!dialog?.open || dialog.hasAttribute("data-closing")) return;
		// Exit is faster than entry: the system is responding, not presenting.
		dialog.setAttribute("data-closing", "");
		closeTimer.current = window.setTimeout(() => dialog.close(), EXIT_MS);
	}, []);

	// Open / switch the dialog whenever the active case changes.
	useEffect(() => {
		const dialog = dialogRef.current;
		if (active === null || !dialog) return;
		const study = caseStudies[active];
		if (!dialog.open) {
			document.documentElement.style.overflow = "hidden";
			dialog.showModal();
		}
		scrollRef.current?.scrollTo({ top: 0 });
		if (study) history.replaceState(null, "", `${HASH_PREFIX}${study.slug}`);
	}, [active]);

	// Deep link: /lab/product#case-<slug> opens that case on load.
	useEffect(() => {
		const slug = window.location.hash.startsWith(HASH_PREFIX)
			? window.location.hash.slice(HASH_PREFIX.length)
			: null;
		const index = slug ? caseStudies.findIndex((study) => study.slug === slug) : -1;
		if (index >= 0) {
			const tile = document.querySelector<HTMLElement>(`[data-case-index="${index}"]`);
			open(index, tile ?? undefined);
		}
		return () => {
			window.clearTimeout(closeTimer.current);
			document.documentElement.style.removeProperty("overflow");
		};
	}, [open]);

	const study = active === null ? null : caseStudies[active];
	const total = caseStudies.length;
	const prev = active === null ? 0 : (active - 1 + total) % total;
	const next = active === null ? 0 : (active + 1) % total;

	return (
		<>
			<div className={s.bento}>
				{caseStudies.map((item, index) => (
					<div
						key={item.slug}
						data-reveal=""
						className={cn("flex", layout[index % layout.length])}
						style={{ "--reveal-delay": `${(index % 3) * 60}ms` } as CSSProperties}
					>
						<Tile study={item} index={index} wide={index === layout.length - 1} onOpen={open} />
					</div>
				))}
			</div>

			<dialog
				ref={dialogRef}
				className={s.dialog}
				aria-labelledby="product-case-title"
				data-lenis-prevent=""
				onClose={onClosed}
				onCancel={(event) => {
					event.preventDefault();
					close();
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) close();
				}}
			>
				{study && active !== null && (
					<div className={s.dialogInner}>
						<div className={cn(s.dialogBar, s.mono)}>
							<span>
								Case {pad(active + 1)} / {pad(total)} · {study.context}
							</span>
							<button
								type="button"
								className={s.iconBtn}
								onClick={() => open(prev)}
								aria-label={`Previous case study: ${caseStudies[prev]?.title ?? ""}`}
							>
								<ChevronLeft size={16} strokeWidth={1.75} />
							</button>
							<button
								type="button"
								className={s.iconBtn}
								onClick={() => open(next)}
								aria-label={`Next case study: ${caseStudies[next]?.title ?? ""}`}
							>
								<ChevronRight size={16} strokeWidth={1.75} />
							</button>
							<button
								type="button"
								className={s.iconBtn}
								onClick={close}
								aria-label="Close case study"
								autoFocus
							>
								<X size={16} strokeWidth={1.75} />
							</button>
						</div>
						<div ref={scrollRef} className={s.dialogScroll} data-lenis-prevent="">
							<CaseDetail study={study} />
						</div>
					</div>
				)}
			</dialog>
		</>
	);
}
