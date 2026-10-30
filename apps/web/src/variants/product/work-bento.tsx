"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronLeft, ChevronRight, Lock, X } from "lucide-react";

import { roles, type CaseStudy } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { CaseChart, chartableResults } from "./case-visuals";
import { CASE_HASH, employerOf, isChartable, isConfidential, leadResult, orderedCases } from "./lib";
import s from "./product.module.css";

const EXIT_MS = 220;
const ALL = "all";

/* ─── Bento spans ────────────────────────────────────────────────
   Rows cycle 7/5 · 4/4/4 · 5/7 · 4/4/4 on a 12-col grid, so any filtered count still tiles:
   a lone leftover goes full width, a leftover pair splits 6/6. */
const rowPattern = [[7, 5], [4, 4, 4], [5, 7], [4, 4, 4]] as const;
const spanClass: Record<number, string> = {
	4: "lg:col-span-4",
	5: "lg:col-span-5",
	6: "lg:col-span-6",
	7: "lg:col-span-7",
	12: "md:col-span-2 lg:col-span-12",
};

function spansFor(count: number): number[] {
	const spans: number[] = [];
	let row = 0;
	while (spans.length < count) {
		const remaining = count - spans.length;
		const pattern = rowPattern[row % rowPattern.length] ?? [12];
		if (remaining >= pattern.length) spans.push(...pattern);
		else if (remaining === 1) spans.push(12);
		else spans.push(6, 6);
		row += 1;
	}
	return spans.slice(0, count);
}

/* ─── Filters ──────────────────────────────────────────────────── */

interface Filter {
	id: string;
	label: string;
	count: number;
}

function buildFilters(cases: CaseStudy[]): Filter[] {
	const counts = new Map<string, number>();
	for (const study of cases) counts.set(employerOf(study), (counts.get(employerOf(study)) ?? 0) + 1);
	// Public employers in career order first; the confidential platform last.
	const ordered = [
		...roles.map((role) => role.company).filter((company) => counts.has(company)),
		...[...counts.keys()].filter((employer) => !roles.some((role) => role.company === employer)),
	];
	const confidential = new Set(cases.filter(isConfidential).map(employerOf));
	return [
		{ id: ALL, label: "All", count: cases.length },
		...ordered.map((employer) => ({
			id: employer,
			label: confidential.has(employer) ? `${employer} (confidential)` : employer,
			count: counts.get(employer) ?? 0,
		})),
	];
}

/**
 * Segmented control. The active state is a duplicate of the list, clipped to the active
 * button and moved with clip-path — text colour and pill change in one motion instead of
 * two cross-faded states.
 */
function Segments({ filters, value, onChange }: { filters: Filter[]; value: string; onChange: (id: string) => void }) {
	const listRef = useRef<HTMLDivElement>(null);
	const activeRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	useLayoutEffect(() => {
		const list = listRef.current;
		const active = activeRef.current;
		if (!list || !active) return;
		const measure = () => {
			const button = list.querySelector<HTMLElement>(`[data-filter="${CSS.escape(value)}"]`);
			if (!button) return;
			const left = button.offsetLeft;
			const right = list.scrollWidth - (left + button.offsetWidth);
			active.style.clipPath = `inset(0 ${right}px 0 ${left}px round 999px)`;
		};
		measure();
		setReady(true);
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		return () => observer.disconnect();
	}, [value]);

	const renderButtons = (interactive: boolean) =>
		filters.map((filter) =>
			interactive ? (
				<button
					key={filter.id}
					type="button"
					className={s.segBtn}
					data-filter={filter.id}
					aria-pressed={filter.id === value}
					onClick={() => onChange(filter.id)}
				>
					{filter.label}
					<span className={s.segCount}>{filter.count}</span>
				</button>
			) : (
				<span key={filter.id} className={s.segBtn}>
					{filter.label}
					<span className={s.segCount}>{filter.count}</span>
				</span>
			),
		);

	return (
		<div className={s.segScroll}>
			<div
				className={s.segments}
				role="group"
				aria-label="Filter case studies by employer"
				data-ready={ready ? "" : undefined}
			>
				<div ref={listRef} className={s.segList}>
					{renderButtons(true)}
				</div>
				<div ref={activeRef} className={cn(s.segList, s.segActive)} aria-hidden="true">
					{renderButtons(false)}
				</div>
			</div>
		</div>
	);
}

/* ─── Tile ─────────────────────────────────────────────────────── */

function canTrackPointer() {
	return (
		window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function Tile({ study, wide, onOpen }: { study: CaseStudy; wide: boolean; onOpen: (slug: string, trigger: HTMLElement) => void }) {
	const glowRef = useRef<HTMLDivElement>(null);
	const moveRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

	useEffect(() => {
		const glow = glowRef.current;
		return () => {
			if (glow) gsap.killTweensOf(glow);
		};
	}, []);

	// Decorative pointer-follow light: quickTo trails the cursor and retargets mid-flight.
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

	const lead = leadResult(study);
	const showLead = lead && !isChartable(lead.value);
	const hasChart = chartableResults(study).length > 0;

	return (
		<article
			className={cn(s.tile, wide && hasChart && s.tileWide)}
			onPointerEnter={onPointerEnter}
			onPointerMove={onPointerMove}
		>
			<div ref={glowRef} className={s.glow} aria-hidden="true" />
			<div className={s.tileText}>
				<div className={s.tileTop}>
					<span className={s.employer}>{employerOf(study)}</span>
					{isConfidential(study) && (
						<span className={cn(s.tag, s.mono)}>
							<Lock size={11} strokeWidth={1.75} aria-hidden="true" />
							confidential
						</span>
					)}
				</div>
				<h3 className={s.tileTitle}>
					<button
						type="button"
						className={s.tileButton}
						aria-haspopup="dialog"
						data-case={study.slug}
						onClick={(event) => onOpen(study.slug, event.currentTarget)}
					>
						{study.title}
					</button>
				</h3>
				<p className={s.tileProblem}>
					<span className={cn(s.tileKicker, s.mono)}>Problem</span>
					{study.problem}
				</p>
				{showLead && (
					<p className={s.tileResult}>
						<span className={s.tileResultValue}>{lead.value}</span> {lead.label}
					</p>
				)}
			</div>
			{hasChart && (
				<div className={s.tileViz}>
					<CaseChart study={study} />
				</div>
			)}
			<div className={s.tileFoot}>
				<span className={s.mono}>{study.stack.slice(0, 3).join(" · ")}</span>
				<span className={s.tileOpen} aria-hidden="true">
					Read case <ArrowRight size={14} strokeWidth={1.75} />
				</span>
			</div>
		</article>
	);
}

/* ─── Dialog content ──────────────────────────────────────────── */

function CaseDetail({ study }: { study: CaseStudy }) {
	const hasChart = chartableResults(study).length > 0;
	return (
		<>
			<h2 id="product-case-title" className={s.dialogTitle}>
				{study.title}
			</h2>
			<p className={s.dialogLede}>{study.summary}</p>

			{hasChart && (
				<div className={s.dialogViz}>
					<CaseChart study={study} />
				</div>
			)}

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

/* ─── Bento + dialog ──────────────────────────────────────────── */

function slugFromHash(): string | null {
	const { hash } = window.location;
	if (!hash.startsWith(CASE_HASH)) return null;
	const slug = decodeURIComponent(hash.slice(CASE_HASH.length));
	return orderedCases.some((study) => study.slug === slug) ? slug : null;
}

export function WorkBento() {
	const filters = useMemo(() => buildFilters(orderedCases), []);
	const [filter, setFilter] = useState(ALL);
	const [filtered, setFiltered] = useState(false);
	const [active, setActive] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const closeTimer = useRef<number | undefined>(undefined);

	const visible = useMemo(
		() => (filter === ALL ? orderedCases : orderedCases.filter((study) => employerOf(study) === filter)),
		[filter],
	);
	const spans = spansFor(visible.length);

	const open = useCallback((slug: string, trigger?: HTMLElement | null) => {
		window.clearTimeout(closeTimer.current);
		dialogRef.current?.removeAttribute("data-closing");
		if (trigger) triggerRef.current = trigger;
		setActive(slug);
	}, []);

	// Single cleanup path: our animated close and any native close (e.g. a forced Esc).
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

	useEffect(() => {
		const dialog = dialogRef.current;
		if (active === null || !dialog) return;
		if (!dialog.open) {
			document.documentElement.style.overflow = "hidden";
			dialog.showModal();
		}
		scrollRef.current?.scrollTo({ top: 0 });
		history.replaceState(null, "", `${CASE_HASH}${active}`);
	}, [active]);

	// Deep links and in-page links (#case-<slug>, e.g. from the proof row and experience) open the dialog.
	useEffect(() => {
		const fromHash = () => {
			const slug = slugFromHash();
			if (!slug) return;
			const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			const tile = document.querySelector<HTMLElement>(`[data-case="${slug}"]`);
			open(slug, focused && focused !== document.body ? focused : tile);
		};
		fromHash();
		window.addEventListener("hashchange", fromHash);
		return () => {
			window.removeEventListener("hashchange", fromHash);
			window.clearTimeout(closeTimer.current);
			document.documentElement.style.removeProperty("overflow");
		};
	}, [open]);

	const study = active ? orderedCases.find((item) => item.slug === active) : undefined;
	const sequence = study && visible.includes(study) ? visible : orderedCases;
	const position = study ? sequence.indexOf(study) : -1;
	const prev = sequence[(position - 1 + sequence.length) % sequence.length];
	const next = sequence[(position + 1) % sequence.length];

	return (
		<>
			<Segments
				filters={filters}
				value={filter}
				onChange={(id) => {
					setFilter(id);
					setFiltered(true);
				}}
			/>

			<div className={s.bento} data-filtered={filtered ? "" : undefined}>
				{visible.map((item, index) => {
					const span = spans[index] ?? 12;
					const oddLast = visible.length % 2 === 1 && index === visible.length - 1;
					return (
						<div
							key={item.slug}
							data-reveal=""
							className={cn(s.cell, "flex", spanClass[span], oddLast && "md:col-span-2")}
							style={{ "--reveal-delay": `${(index % 3) * 60}ms`, "--i": index } as CSSProperties}
						>
							<Tile study={item} wide={span === 12} onOpen={open} />
						</div>
					);
				})}
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
				{study && (
					<div className={s.dialogInner}>
						<div className={cn(s.dialogBar, s.mono)}>
							<span>
								{String(position + 1).padStart(2, "0")} / {String(sequence.length).padStart(2, "0")} · {study.context}
							</span>
							{prev && (
								<button
									type="button"
									className={s.iconBtn}
									onClick={() => open(prev.slug)}
									aria-label={`Previous case study: ${prev.title}`}
								>
									<ChevronLeft size={16} strokeWidth={1.75} />
								</button>
							)}
							{next && (
								<button
									type="button"
									className={s.iconBtn}
									onClick={() => open(next.slug)}
									aria-label={`Next case study: ${next.title}`}
								>
									<ChevronRight size={16} strokeWidth={1.75} />
								</button>
							)}
							<button type="button" className={s.iconBtn} onClick={close} aria-label="Close case study" autoFocus>
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
