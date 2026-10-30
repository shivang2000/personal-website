import type { CSSProperties } from "react";

import type { CaseStudy } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { isChartable, parseDelta, parseVersus } from "./lib";
import s from "./product.module.css";

type Result = CaseStudy["results"][number];

function vars(values: Record<string, string | number>): CSSProperties {
	return values as CSSProperties;
}

/** Before → after. The "after" bar starts at the "before" length and shrinks into place once revealed. */
function DeltaRow({ result, stagger }: { result: Result; stagger: number }) {
	const delta = parseDelta(result.value);
	if (!delta) return null;
	const ratio = Math.max(delta.ratio, 0.02);
	return (
		<div style={vars({ "--stagger": `${stagger}ms` })}>
			<div className={s.vizLabel}>
				<span>{result.label}</span>
				<span className={s.mono}>
					<s>{delta.from}</s> → <b>{delta.to}</b>
				</span>
			</div>
			<div className={s.track}>
				<div className={cn(s.bar, s.shrink)} style={vars({ width: `${ratio * 100}%`, "--from-scale": 1 / ratio })} />
			</div>
		</div>
	);
}

/** "36% vs 18%" with a label like "Android vs iOS failure rate isolated" → two comparable bars. */
function VersusRows({ result, stagger }: { result: Result; stagger: number }) {
	const values = parseVersus(result.value);
	const [leftName, rest] = result.label.split(" vs ");
	const [rightName, ...captionWords] = rest?.split(" ") ?? [];
	if (!values || !leftName || !rightName) return null;
	const rows = [
		{ name: leftName, value: values[0] },
		{ name: rightName, value: values[1] },
	];
	return (
		<div className={s.viz} style={vars({ "--stagger": `${stagger}ms` })}>
			<span className={s.vizLabel}>
				<span>{captionWords.join(" ")}</span>
			</span>
			{rows.map((row) => (
				<div key={row.name}>
					<div className={s.vizLabel}>
						<span>{row.name}</span>
						<b className={s.mono}>{row.value}%</b>
					</div>
					<div className={s.track}>
						<div className={cn(s.bar, s.grow, s.barBad)} style={{ width: `${Math.min(row.value, 100)}%` }} />
					</div>
				</div>
			))}
		</div>
	);
}

export function chartableResults(study: CaseStudy): Result[] {
	return study.results.filter((result) => isChartable(result.value));
}

/** Renders only results a bar can show honestly; returns null when there are none. */
export function CaseChart({ study }: { study: CaseStudy }) {
	const results = chartableResults(study);
	if (results.length === 0) return null;
	return (
		<div
			className={s.viz}
			role="img"
			aria-label={results.map((result) => `${result.label}: ${result.value}`).join("; ")}
		>
			{results.map((result, i) =>
				parseDelta(result.value) ? (
					<DeltaRow key={result.label} result={result} stagger={i * 90} />
				) : (
					<VersusRows key={result.label} result={result} stagger={i * 90} />
				),
			)}
		</div>
	);
}
