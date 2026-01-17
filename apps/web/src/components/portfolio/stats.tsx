"use client";

import { stats } from "@/lib/data/portfolio-data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

/**
 * Stats section displaying key metrics in large editorial typography.
 * Numbers in serif font, labels in small caps sans-serif.
 */
export function Stats() {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

	return (
		<section id="stats" className="border-y border-border bg-card/50 py-16">
			<div className="container mx-auto max-w-5xl px-6">
				<div
					ref={ref}
					className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12"
				>
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className={cn(
								"text-center opacity-0",
								isVisible && "animate-fade-in-up",
								index === 0 && "animation-delay-100",
								index === 1 && "animation-delay-200",
								index === 2 && "animation-delay-300",
							)}
						>
							{/* Large number */}
							<div className="font-serif text-5xl font-bold text-foreground md:text-6xl">
								{stat.value}
							</div>

							{/* Label */}
							<div className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
