"use client";

import { stats } from "@/lib/data/portfolio-data";
import { useCountUp } from "@/hooks/use-gsap-animation";

/**
 * Parse a stat value like "3+", "10x", "$100K+" into its parts.
 */
function parseStatValue(value: string): {
	prefix: string;
	number: number;
	suffix: string;
} {
	const match = value.match(/^(\$?)(\d+)(.*)$/);
	if (!match) return { prefix: "", number: 0, suffix: value };
	return {
		prefix: match[1] ?? "",
		number: Number.parseInt(match[2] ?? "0", 10),
		suffix: match[3] ?? "",
	};
}

/**
 * Individual stat item with countUp animation.
 */
function StatItem({ stat }: { stat: (typeof stats)[number] }) {
	const { prefix, number, suffix } = parseStatValue(stat.value);
	const { ref, formattedValue } = useCountUp(number, {
		prefix,
		suffix,
		duration: 1.5,
	});

	return (
		<div className="rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-accent/30">
			{/* Large number */}
			<div className="font-mono text-5xl font-bold text-accent md:text-6xl">
				<span ref={ref}>{formattedValue}</span>
			</div>

			{/* Label */}
			<div className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
				{stat.label}
			</div>
		</div>
	);
}

/**
 * Stats section displaying key metrics with GSAP countUp animation.
 * Numbers in mono font with accent color for terminal aesthetic.
 */
export function Stats() {
	return (
		<section id="stats" className="border-y border-border bg-card/50 py-16">
			<div className="container mx-auto max-w-5xl px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
					{stats.map((stat) => (
						<StatItem key={stat.label} stat={stat} />
					))}
				</div>
			</div>
		</section>
	);
}
