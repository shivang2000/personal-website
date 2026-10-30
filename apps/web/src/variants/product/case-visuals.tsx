import type { CSSProperties } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

import type { CaseStudy } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { parseDelta, parseVersus, percentOf } from "./lib";
import s from "./product.module.css";

type Result = CaseStudy["results"][number];

function vars(values: Record<string, string | number>): CSSProperties {
	return values as CSSProperties;
}

/** Before/after bar. The "after" bar starts at the "before" length and shrinks into place once revealed. */
function DeltaRow({ result, stagger = 0 }: { result: Result; stagger?: number }) {
	const delta = parseDelta(result.value);
	if (!delta) return <StatRow result={result} />;
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
				<div
					className={cn(s.bar, s.shrink)}
					style={vars({ width: `${ratio * 100}%`, "--from-scale": 1 / ratio })}
				/>
			</div>
		</div>
	);
}

/** Share-of-whole bar for a percentage value. */
function ShareRow({
	label,
	value,
	tone,
	stagger = 0,
}: {
	label: string;
	value: string;
	tone?: "bad" | "ok";
	stagger?: number;
}) {
	const pct = percentOf(value) ?? 0;
	return (
		<div style={vars({ "--stagger": `${stagger}ms` })}>
			<div className={s.vizLabel}>
				<span>{label}</span>
				<b className={s.mono}>{value}</b>
			</div>
			<div className={s.track}>
				<div
					className={cn(s.bar, s.grow, tone === "bad" && s.barBad, tone === "ok" && s.barOk)}
					style={{ width: `${Math.min(pct, 100)}%` }}
				/>
			</div>
		</div>
	);
}

function StatRow({ result }: { result: Result }) {
	return (
		<div className={s.vizLegend}>
			<span className={s.big}>{result.value}</span>
			<span>{result.label}</span>
		</div>
	);
}

function count(value: string, cap: number): number {
	const n = Number.parseInt(value.replace(/,/g, ""), 10);
	return Number.isFinite(n) ? Math.min(Math.max(n, 0), cap) : 0;
}

function KubernetesViz({ results }: { results: Result[] }) {
	const [errors, cost, retired] = results;
	return (
		<>
			{errors && (
				<div>
					<div className={s.vizLabel}>
						<span>{errors.label}</span>
					</div>
					<div className={s.chart} style={{ marginTop: 10 }}>
						<div className={s.chartMarker} aria-hidden="true">
							<span className={s.mono}>cutover</span>
						</div>
						<div className={s.chartLine} aria-hidden="true">
							<svg viewBox="0 0 100 72" preserveAspectRatio="none">
								<path d="M0 70 H100" stroke="var(--p-ok)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
							</svg>
						</div>
						<span className={cn(s.chartZero, s.mono)}>{errors.value}</span>
					</div>
				</div>
			)}
			{cost && <DeltaRow result={cost} stagger={150} />}
			{retired && <StatRow result={retired} />}
		</>
	);
}

function RefundViz({ results }: { results: Result[] }) {
	const [types, sweep, bugs] = results;
	return (
		<>
			<div className={s.flow} aria-hidden="true">
				<span className={s.flowNode}>Payment captured</span>
				<ArrowRight size={14} strokeWidth={1.5} className={s.flowArrow} />
				<span className={cn(s.flowNode, s.flowNodeBad)}>Vendor rejects</span>
				<ArrowRight size={14} strokeWidth={1.5} className={s.flowArrow} />
				<span className={cn(s.flowNode, s.flowNodeOk)}>Auto-refund</span>
			</div>
			{sweep && (
				<div className={s.loop}>
					<RefreshCw size={14} strokeWidth={1.5} aria-hidden="true" />
					<span>
						<b>{sweep.value}</b> {sweep.label}
					</span>
				</div>
			)}
			{types && (
				<div className={s.vizLegend}>
					<span className={s.dots} aria-hidden="true">
						{Array.from({ length: count(types.value, 24) }, (_, i) => (
							<span key={i} className={s.dot} />
						))}
					</span>
					<span>
						{types.value} {types.label}
					</span>
				</div>
			)}
			{bugs && (
				<div className={s.vizLegend}>
					<span>
						{bugs.value} {bugs.label}
					</span>
				</div>
			)}
		</>
	);
}

function SignupViz({ results }: { results: Result[] }) {
	const [mobile, split, loops] = results;
	const versus = split ? parseVersus(split.value) : null;
	const [leftName, rightPart] = split?.label.split(" vs ") ?? [];
	const [rightName, ...captionWords] = rightPart?.split(" ") ?? [];
	return (
		<>
			{mobile && <ShareRow label={mobile.label} value={mobile.value} />}
			{split && versus && leftName && rightName ? (
				<div className={s.viz}>
					<span className={s.vizLabel}>
						<span>{captionWords.join(" ") || split.label}</span>
					</span>
					<ShareRow label={leftName} value={`${versus[0]}%`} tone="bad" stagger={120} />
					<ShareRow label={rightName} value={`${versus[1]}%`} tone="bad" stagger={220} />
				</div>
			) : (
				split && <StatRow result={split} />
			)}
			{loops && <StatRow result={loops} />}
		</>
	);
}

function PerformanceViz({ results }: { results: Result[] }) {
	return (
		<>
			{results.map((result, i) => (
				<DeltaRow key={result.label} result={result} stagger={i * 90} />
			))}
		</>
	);
}

function SecurityViz({ results }: { results: Result[] }) {
	const [tables, policies, limiters] = results;
	const merge = limiters ? parseDelta(limiters.value) : null;
	return (
		<>
			{tables && (
				<div>
					<div className={s.cells} aria-hidden="true">
						{Array.from({ length: count(tables.value, 40) }, (_, i) => (
							<span key={i} className={s.cell} />
						))}
					</div>
					<div className={s.vizLegend} style={{ marginTop: 10 }}>
						<span>
							<b className={s.mono}>{tables.value}</b> {tables.label}
						</span>
						{policies && (
							<span>
								<b className={s.mono}>{policies.value}</b> {policies.label}
							</span>
						)}
					</div>
				</div>
			)}
			{limiters && merge ? (
				<div className={s.vizLegend}>
					<span className={s.merge} aria-hidden="true">
						<span className={s.dots}>
							{Array.from({ length: count(merge.from, 24) }, (_, i) => (
								<span key={i} className={cn(s.dot, s.dotQuiet)} />
							))}
						</span>
						<ArrowRight size={14} strokeWidth={1.5} className={s.flowArrow} />
						<span className={s.dot} />
					</span>
					<span>
						<b className={s.mono}>{limiters.value}</b> {limiters.label}
					</span>
				</div>
			) : (
				limiters && <StatRow result={limiters} />
			)}
		</>
	);
}

function CiViz({ results }: { results: Result[] }) {
	const [tests, job, minutes] = results;
	return (
		<>
			<div>
				<div className={s.ticks} aria-hidden="true">
					{Array.from({ length: 44 }, (_, i) => (
						<span key={i} className={cn(s.tick, i >= 32 && s.tickOk)} />
					))}
				</div>
				<div className={s.vizLegend} style={{ marginTop: 10 }}>
					<span>Red gate, every run</span>
					{tests && (
						<span>
							<b className={s.mono}>{tests.value}</b> {tests.label}
						</span>
					)}
				</div>
			</div>
			{job && <DeltaRow result={job} stagger={120} />}
			{minutes && <StatRow result={minutes} />}
		</>
	);
}

const visuals: Record<string, (props: { results: Result[] }) => React.ReactNode> = {
	"kubernetes-exit": KubernetesViz,
	"refund-guarantee": RefundViz,
	"signup-forensics": SignupViz,
	performance: PerformanceViz,
	"data-security": SecurityViz,
	"ci-rescue": CiViz,
};

function describe(study: CaseStudy): string {
	return study.results.map((r) => `${r.value} ${r.label}`).join("; ");
}

export function CaseVisual({ study }: { study: CaseStudy }) {
	const Visual = visuals[study.slug];
	return (
		<div className={s.viz} role="img" aria-label={describe(study)}>
			{Visual ? (
				<Visual results={study.results} />
			) : (
				study.results.map((result, i) => <DeltaRow key={result.label} result={result} stagger={i * 90} />)
			)}
		</div>
	);
}
