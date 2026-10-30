import type { CSSProperties } from "react";

import { howIWork } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

import { pickStack } from "./lib";
import s from "./product.module.css";

/**
 * Signature moment: the pitch drawn as a deploy path. One beam of light travels the rail
 * once on load (linear — it is constant motion) and each layer lights as the beam passes,
 * ending on Production. Pure CSS keyframes: predetermined, runs off the main thread while
 * the page hydrates, zero client JS.
 */

const layers = [
	{ name: "UI", tools: pickStack(["React 19", "Next.js", "React Native / Expo", "Tailwind"]) },
	{ name: "Backend", tools: pickStack(["Python", "FastAPI", "Postgres", "Redis"]) },
	{ name: "Payments", tools: pickStack(["Stripe"]) },
	{ name: "Infra", tools: pickStack(["Terraform", "AWS", "Cloudflare", "Docker"]) },
	{ name: "Production", tools: pickStack(["Sentry", "PostHog", "GitHub Actions"]) },
];

const BEAM_START = 350;
const BEAM_DURATION = 1200;
/** Beam band is 16% of the rail tall, centred 8% from its top, travelling -16% → 116%. */
function arrival(index: number, count: number) {
	const position = (index / (count - 1)) * 100;
	return Math.round(BEAM_START + ((position + 8) / 132) * BEAM_DURATION);
}

export function StackPanel() {
	const principle = howIWork[0];
	return (
		<div className={s.shell}>
			<div className={s.core}>
				<div className={cn(s.stackHead, s.mono)}>
					<span>the-whole-product</span>
					<span>owned end to end</span>
				</div>
				<div className={s.stackBody}>
					<span className={s.rail} aria-hidden="true">
						<span className={s.beam} />
					</span>
					<ol aria-label="Layers I build and run">
					{layers.map((layer, index) => {
						const isProd = index === layers.length - 1;
						const delay = arrival(index, layers.length);
						return (
							<li
								key={layer.name}
								className={cn(s.layer, isProd && s.layerProd)}
								style={{ "--delay": `${delay}ms` } as CSSProperties}
							>
								<span className={s.node} aria-hidden="true">
									<span className={s.nodeDot} />
									{isProd && <span className={s.ping} />}
									<span className={s.nodeLit} />
								</span>
								<span className={s.layerText}>
									<span className={s.layerName}>{layer.name}</span>
									<span className={cn(s.layerTools, s.mono)}>
										{layer.tools.join(" · ")}
									</span>
								</span>
								{isProd ? (
									<span className={cn(s.status, s.mono)}>
										<span className={s.statusDot} aria-hidden="true" />
										running
									</span>
								) : (
									<span className={cn(s.layerTag, s.mono)}>{String(index + 1).padStart(2, "0")}</span>
								)}
							</li>
						);
					})}
					</ol>
				</div>
				{principle && (
					<p className={s.stackFoot}>
						<span>
							<strong>{principle.title}.</strong> {principle.body}
						</span>
					</p>
				)}
			</div>
		</div>
	);
}
