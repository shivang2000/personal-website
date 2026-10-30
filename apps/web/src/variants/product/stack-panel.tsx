import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { pickStack } from "./lib";
import s from "./product.module.css";

/**
 * Signature moment: the pitch drawn as a deploy path. One beam travels the rail once on load
 * and each layer lights as it passes, ending on Production. The rail is one segment per row
 * (node → next node), so rows can wrap to any height and the beam still meets every node.
 * Pure CSS keyframes: predetermined, off the main thread, zero client JS.
 */

const layers = [
	{ name: "UI", tools: pickStack(["React 19", "Next.js", "React Native / Expo", "Tailwind"]) },
	{ name: "Backend", tools: pickStack(["Python", "FastAPI", "Postgres", "Redis"]) },
	{ name: "Payments", tools: pickStack(["Stripe"]) },
	{ name: "Infra", tools: pickStack(["Terraform", "AWS", "Cloudflare", "Docker"]) },
	{ name: "Production", tools: pickStack(["Sentry", "PostHog", "GitHub Actions"]) },
];

const BEAM_START = 350;
/** Time for the beam to travel one segment. Linear: it is constant motion. */
const SEGMENT_MS = 270;

export function StackPanel() {
	return (
		<div className={s.shell}>
			<div className={s.core}>
				<div className={cn(s.stackHead, s.mono)}>
					<span>the-whole-product</span>
					<span>owned end to end</span>
				</div>
				<ol className={s.stackBody} aria-label="Layers I build and run">
					{layers.map((layer, index) => {
						const isProd = index === layers.length - 1;
						const style = {
							"--delay": `${BEAM_START + index * SEGMENT_MS}ms`,
							"--seg-ms": `${SEGMENT_MS}ms`,
						} as CSSProperties;
						return (
							<li key={layer.name} className={cn(s.layer, isProd && s.layerProd)} style={style}>
								{!isProd && (
									<span className={s.segment} aria-hidden="true">
										<span className={s.beam} />
									</span>
								)}
								<span className={s.node} aria-hidden="true">
									<span className={s.nodeDot} />
									{isProd && <span className={s.ping} />}
									<span className={s.nodeLit} />
								</span>
								<span className={s.layerText}>
									<span className={s.layerName}>{layer.name}</span>
									<span className={cn(s.layerTools, s.mono)}>{layer.tools.join(" · ")}</span>
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
		</div>
	);
}
