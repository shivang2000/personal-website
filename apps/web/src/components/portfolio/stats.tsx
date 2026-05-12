"use client";

import { stats } from "@/lib/data/portfolio-data";
import { useCountUp } from "@/hooks/use-gsap-animation";
import { cn } from "@/lib/utils";

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
	const hasNumeric = /\d/.test(stat.value);
	const { ref, formattedValue } = useCountUp(number, {
		prefix,
		suffix,
		duration: 1.5,
	});

	return (
		<div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-accent/30">
			{/* Value */}
			<div
				className={cn(
					"font-mono font-bold leading-tight text-accent [overflow-wrap:anywhere]",
					hasNumeric
						? "text-3xl md:text-4xl"
						: "text-xl md:text-2xl",
				)}
			>
				{hasNumeric ? (
					<span ref={ref}>{formattedValue}</span>
				) : (
					<span>{stat.value}</span>
				)}
			</div>

			{/* Label */}
			<div className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground md:text-sm">
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
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
					{stats.map((stat) => (
						<StatItem key={stat.label} stat={stat} />
					))}
				</div>
			</div>
		</section>
	);
}
