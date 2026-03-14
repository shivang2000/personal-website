"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { Tag } from "@/components/common/tag";
import { projects, type Project } from "@/lib/data/portfolio-data";
import { useSlideIn } from "@/hooks/use-gsap-animation";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

/**
 * Helper function to highlight metrics in text.
 * Wraps patterns like "$100K", "20x", "40%", "10K+" in accent-colored spans.
 */
function highlightMetrics(text: string): React.ReactNode {
	const metricPattern =
		/(\$?\d+[KkMm]?\+?%?x?|\d+\+?\s*(?:years?|months?|ARR|clients?))/gi;
	const parts = text.split(metricPattern);

	return parts.map((part, index) => {
		if (metricPattern.test(part)) {
			// Reset lastIndex since test() advances it
			metricPattern.lastIndex = 0;
			return (
				<span key={index} className="font-semibold text-accent">
					{part}
				</span>
			);
		}
		return part;
	});
}

/**
 * Projects section with vertical timeline layout.
 * Features company badges, connector lines, and highlighted achievement metrics.
 * Uses GSAP slide-in animations for scroll-triggered entry.
 */
export function Projects() {
	const featuredProjects = projects.filter((p) => p.featured);

	return (
		<section id="projects" className="bg-secondary/30 py-20 md:py-28">
			<div className="container mx-auto max-w-5xl px-6">
				<SectionHeading
					title="Work Experience"
					subtitle="Building products that make an impact at US startups"
				/>

				{/* Timeline container */}
				<div className="relative">
					{/* Vertical timeline line */}
					<div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-accent via-accent/50 to-transparent shadow-[0_0_8px_rgba(0,255,136,0.3)] md:left-8 md:block" />

					{/* Timeline items */}
					<div className="space-y-8 md:space-y-12">
						{featuredProjects.map((project, index) => (
							<TimelineItem
								key={project.id}
								project={project}
								isLast={index === featuredProjects.length - 1}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

interface TimelineItemProps {
	project: Project;
	isLast: boolean;
}

function TimelineItem({ project, isLast }: TimelineItemProps) {
	const ref = useSlideIn("left");

	return (
		<div
			ref={ref}
			className="relative grid gap-4 md:grid-cols-[64px_1fr] md:gap-8"
		>
			{/* Timeline node - Company badge */}
			<div className="hidden md:flex md:flex-col md:items-center">
				<div
					className={cn(
						"relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-card shadow-sm transition-all duration-300",
						"border-accent/30 hover:border-accent hover:shadow-md",
					)}
				>
					{/* Company initial or icon */}
					<span className="font-mono text-lg font-bold text-accent">
						{project.company.charAt(0)}
					</span>
				</div>

				{/* Connector dot for non-last items */}
				{!isLast && (
					<div className="mt-4 h-2 w-2 rounded-full bg-border" />
				)}
			</div>

			{/* Content card */}
			<article
				className={cn(
					"group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 md:p-6",
					"hover:border-accent/30 hover:shadow-lg",
				)}
			>
				{/* Subtle hover gradient */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

				<div className="relative space-y-4">
					{/* Header */}
					<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-1">
							{/* Company name */}
							<div className="flex items-center gap-2">
								{/* Mobile-only company badge */}
								<div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-card md:hidden">
									<span className="font-mono text-sm font-bold text-accent">
										{project.company.charAt(0)}
									</span>
								</div>
								<h3 className="font-semibold text-foreground">
									{project.company}
								</h3>
							</div>

							{/* Role */}
							<p className="text-lg font-medium text-foreground/80">
								{project.role}
							</p>
						</div>

						{/* Period */}
						<div className="flex items-center gap-1 text-sm text-muted-foreground">
							<Briefcase className="h-3.5 w-3.5" />
							<span>{project.period}</span>
						</div>
					</div>

					{/* Description */}
					<p className="text-sm text-muted-foreground">
						{project.description}
					</p>

					{/* Impact bullets with highlighted metrics */}
					<ul className="space-y-2">
						{project.impact.map((item, i) => (
							<li key={i} className="flex items-start gap-3 text-sm">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
								<span className="text-foreground/90">
									{highlightMetrics(item)}
								</span>
							</li>
						))}
					</ul>

					{/* Tech stack */}
					<div className="flex flex-wrap gap-1.5 pt-2">
						{project.techStack.map((tech) => (
							<Tag key={tech} variant="outline" size="sm">
								{tech}
							</Tag>
						))}
					</div>
				</div>
			</article>
		</div>
	);
}
