"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/common/badge";
import { openSourceContributions } from "@/lib/data/portfolio-data";
import { useSlideIn } from "@/hooks/use-gsap-animation";
import { cn } from "@/lib/utils";
import { ExternalLink, GitPullRequest, Github } from "lucide-react";

/**
 * Open Source section highlighting merged contributions to public repos.
 * Mirrors the Projects timeline visual language with a distinct `[MERGED]` badge.
 */
export function OpenSource() {
	return (
		<section id="open-source" className="py-20 md:py-28">
			<div className="container mx-auto max-w-5xl px-6">
				<SectionHeading
					title="Open Source"
					subtitle="Shipping merged code into AI-native codebases"
				/>

				<div className="space-y-6">
					{openSourceContributions.map((contribution) => (
						<ContributionCard key={contribution.id} contribution={contribution} />
					))}
				</div>
			</div>
		</section>
	);
}

interface ContributionCardProps {
	contribution: (typeof openSourceContributions)[number];
}

function ContributionCard({ contribution }: ContributionCardProps) {
	const ref = useSlideIn<HTMLElement>("left");

	return (
		<article
			ref={ref}
			className={cn(
				"group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 md:p-6",
				"hover:border-accent/30 hover:shadow-lg",
			)}
		>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

			<div className="relative space-y-4">
				{/* Header: status + repo */}
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-center gap-3">
						<Badge variant="accent">MERGED</Badge>
						<span className="font-mono text-sm text-muted-foreground">
							{contribution.repo}
						</span>
					</div>
					<span className="text-sm text-muted-foreground">
						{contribution.mergedDate}
					</span>
				</div>

				{/* Project name + tagline */}
				<div>
					<h3 className="text-xl font-semibold text-foreground">
						{contribution.project}
					</h3>
					<p className="text-sm text-muted-foreground">{contribution.tagline}</p>
				</div>

				{/* PR title + diff stats */}
				<div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
					<GitPullRequest className="h-4 w-4 shrink-0 text-accent" />
					<code className="flex-1 font-mono text-sm text-foreground">
						{contribution.prTitle}
					</code>
					<span className="font-mono text-sm text-muted-foreground">
						#{contribution.prNumber}
					</span>
					<span className="font-mono text-sm">
						<span className="text-accent">+{contribution.diffStats.added}</span>
						{" / "}
						<span className="text-destructive">
							−{contribution.diffStats.removed}
						</span>
					</span>
				</div>

				{/* Description */}
				<p className="text-sm text-foreground/90">{contribution.description}</p>

				{/* Links */}
				<div className="flex flex-wrap gap-3 pt-2">
					<a
						href={contribution.links.pr}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View PR #${contribution.prNumber} on GitHub`}
						className="inline-flex items-center gap-1.5 rounded-lg border border-accent/50 bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:bg-accent/10"
					>
						<GitPullRequest className="h-3.5 w-3.5" />
						View PR
						<ExternalLink className="h-3 w-3" />
					</a>
					<a
						href={contribution.links.issue}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View issue #${contribution.issueNumber} on GitHub`}
						className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent/50"
					>
						Issue #{contribution.issueNumber}
						<ExternalLink className="h-3 w-3" />
					</a>
					<a
						href={contribution.links.repo}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View ${contribution.repo} repository on GitHub`}
						className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent/50"
					>
						<Github className="h-3.5 w-3.5" />
						Repo
						<ExternalLink className="h-3 w-3" />
					</a>
				</div>
			</div>
		</article>
	);
}
