import type { CSSProperties } from "react";
import Image from "next/image";

import { howIWork, standout, workflow } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import s from "./product.module.css";
import { SectionHead } from "./sections";

/**
 * Second signature: the same work drawn three ways. When the track scrolls into view the
 * lanes fill once — one slow lane (Then), three panes at once (Next), four quick lanes that
 * converge on review and a human merge (Now). It is an explanation of throughput, so it
 * plays once, uses scaleX + opacity only, and shows the finished state under reduced motion.
 */

function fill(ms: number, delay: number): CSSProperties {
	return { "--fill-ms": `${ms}ms`, "--fill-delay": `${delay}ms` } as CSSProperties;
}

function Lane({ label, ms, delay }: { label: string; ms: number; delay: number }) {
	return (
		<div className={s.lane}>
			<span>{label}</span>
			<span className={s.laneTrack}>
				<span className={s.laneFill} style={fill(ms, delay)} />
			</span>
		</div>
	);
}

const BASE = 250;

function ThenScheme() {
	return (
		<div className={s.scheme} aria-hidden="true">
			<div className={s.schemeBar}>editor</div>
			<div className={s.schemeBody}>
				<Lane label="you" ms={1500} delay={BASE} />
			</div>
		</div>
	);
}

function NextScheme() {
	return (
		<div className={s.scheme} aria-hidden="true">
			<div className={s.schemeBar}>tmux</div>
			<div className={s.schemeBody}>
				<div className={s.panes}>
					{[0, 1, 2].map((i) => (
						<div key={i} className={s.pane}>
							<Lane label="agent" ms={950} delay={BASE + i * 60} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function NowScheme() {
	const lanes = [0, 1, 2, 3];
	const LANE_MS = 600;
	const done = BASE + LANE_MS + (lanes.length - 1) * 70;
	return (
		<div className={s.scheme} aria-hidden="true">
			<div className={s.schemeBar}>isolated worktrees</div>
			<div className={s.schemeBody}>
				<div className={s.orchestra}>
					<div className={s.lanes}>
						{lanes.map((i) => (
							<Lane key={i} label="agent" ms={LANE_MS} delay={BASE + i * 70} />
						))}
					</div>
					<span className={s.join} />
					<div className={s.gates}>
						<span className={s.gate}>
							<span>review</span>
							<span className={s.gateOn} style={{ "--gate-delay": `${done}ms` } as CSSProperties}>
								review
							</span>
						</span>
						<span>↓</span>
						<span className={s.gate}>
							<span>you · merge</span>
							<span className={s.gateOn} style={{ "--gate-delay": `${done + 180}ms` } as CSSProperties}>
								you · merge
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

const schemes = [ThenScheme, NextScheme, NowScheme];

/**
 * The "Now" stage, measured by a third party. Sits right under the track so the claim and
 * the evidence read together; the card image links to the full-size original.
 */
function Measured() {
	return (
		<aside className={s.measured} data-reveal="" aria-labelledby="product-measured-title">
			<div className={s.measuredScore}>
				<p className={s.measuredEyebrow} id="product-measured-title">
					Measured by Standout
				</p>
				<p className={s.measuredFigure}>
					{standout.score}
					<span>/{standout.outOf}</span>
				</p>
				<p className={s.measuredRank}>
					{standout.rank} · <strong>{standout.tier}</strong>
				</p>
				<ul className={s.measuredBars}>
					{standout.bars.map((bar) => (
						<li key={bar.label}>
							<span>{bar.label}</span>
							<span className={s.measuredTrack} aria-hidden="true">
								<span style={{ "--bar": `${bar.value}%` } as CSSProperties} />
							</span>
							<span className={s.measuredValue}>{bar.value}</span>
						</li>
					))}
				</ul>
			</div>

			<dl className={s.measuredStats}>
				{standout.stats.map((stat) => (
					<div key={stat.label}>
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				))}
			</dl>

			<a className={s.measuredCard} href={standout.card} target="_blank" rel="noreferrer">
				<Image
					src={standout.thumb}
					alt={`Standout AI Wrapped card: ${standout.score}/${standout.outOf}, ${standout.rank.toLowerCase()}, style ${standout.style}`}
					width={386}
					height={480}
				/>
				<span>
					Full card <span aria-hidden="true">↗</span>
				</span>
			</a>

			<p className={s.measuredNote}>
				Scored from my Claude Code and Codex history.{" "}
				<a href={standout.href} target="_blank" rel="noreferrer">
					Run yours: <code>{standout.command}</code>
				</a>
			</p>
		</aside>
	);
}

export function Workflow() {
	const last = workflow.stages.length - 1;
	return (
		<section id="about" className={s.section} aria-labelledby="product-workflow-title">
			<div className={s.container}>
				<SectionHead id="product-workflow-title" eyebrow="How I work" title={workflow.title} lede={workflow.intro} />

				<ol className={s.evo} data-reveal="" aria-label="How my setup has changed">
					{workflow.stages.map((stage, i) => {
						const Scheme = schemes[Math.min(i, schemes.length - 1)] ?? NowScheme;
						return (
							<li key={stage.era} className={cn(s.stage, i === last && s.stageNow)}>
								<p className={s.stageEra}>
									{String(i + 1).padStart(2, "0")} · {stage.era}
								</p>
								<Scheme />
								<h3 className={s.stageSetup}>{stage.setup}</h3>
								<p className={s.stageBody}>{stage.body}</p>
								<p className={s.stageExample}>{stage.example}</p>
							</li>
						);
					})}
				</ol>

				<Measured />

				<ul className={s.principles}>
					{howIWork.map((item, i) => (
						<li key={item.title} className={s.principle} data-reveal="" style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}>
							<h3>
								<span>{String(i + 1).padStart(2, "0")}</span>
								{item.title}
							</h3>
							<p>{item.body}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
