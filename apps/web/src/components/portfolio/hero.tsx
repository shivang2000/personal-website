"use client";

import Image from "next/image";
import { Badge } from "@/components/common/badge";
import { personalInfo } from "@/lib/data/portfolio-data";
import { cn } from "@/lib/utils";
import { ArrowDown, MapPin, Sparkles, Zap } from "lucide-react";

/**
 * Hero section with editorial serif headline, AI-powered development edge,
 * Web3/Blockchain focus, and "Available for Hire" badge.
 */
export function Hero() {
	const words = personalInfo.name.split(" ");

	return (
		<section className="relative overflow-hidden">
			{/* Subtle gradient background */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

			<div className="container relative mx-auto max-w-5xl px-6 pb-20 pt-24 md:pb-32 md:pt-32">
				<div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
					{/* Text Content */}
					<div className="space-y-6">
						{/* Badges row */}
						<div className="animate-fade-in flex flex-wrap items-center gap-3 opacity-0 animation-delay-600">
							{personalInfo.isAvailable && (
								<Badge variant="accent" pulse>
									Available for Hire
								</Badge>
							)}
							<Badge variant="outline">
								<Sparkles className="mr-1 h-3 w-3" />
								Web3 / Blockchain
							</Badge>
						</div>

						{/* Name with staggered word animation */}
						<h1 className="text-hero font-serif font-bold tracking-tight text-foreground">
							{words.map((word, index) => (
								<span
									key={word}
									className={cn(
										"inline-block opacity-0",
										"animate-fade-in-up",
										index === 0 && "animation-delay-100",
										index === 1 && "animation-delay-200",
									)}
								>
									{word}
									{index < words.length - 1 && "\u00A0"}
								</span>
							))}
						</h1>

						{/* Title */}
						<p className="animate-fade-in-up text-2xl font-medium text-accent opacity-0 animation-delay-300 md:text-3xl">
							{personalInfo.title}
						</p>

						{/* Bold AI statement - the differentiator */}
						<div className="animate-fade-in-up space-y-3 opacity-0 animation-delay-400">
							<div className="flex items-center gap-2">
								<Zap className="h-5 w-5 text-accent" />
								<span className="text-lg font-semibold text-foreground md:text-xl">
									{personalInfo.headline}
								</span>
							</div>
							<p className="text-body-lg max-w-xl text-muted-foreground">
								{personalInfo.subHeadline}. I combine{" "}
								<span className="font-medium text-foreground">
									3+ years of deep engineering experience
								</span>{" "}
								with AI tools to deliver faster without sacrificing quality.
							</p>
						</div>

						{/* Tech focus */}
						<p className="text-body-lg animate-fade-in-up text-muted-foreground opacity-0 animation-delay-500">
							Specializing in{" "}
							<span className="text-foreground">
								React, TypeScript, Node.js, Go
							</span>
							{" "}—{" "}now exploring{" "}
							<span className="text-foreground">
								Web3, Solidity, and decentralized apps
							</span>
							.
						</p>

						{/* Location */}
						<div className="animate-fade-in flex items-center gap-2 text-sm text-muted-foreground opacity-0 animation-delay-600">
							<MapPin className="h-4 w-4" />
							<span>{personalInfo.location}</span>
						</div>

						{/* CTA Buttons */}
						<div className="animate-fade-in-up flex flex-wrap gap-4 pt-4 opacity-0 animation-delay-700">
							<a
								href="#contact"
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
							>
								Get in Touch
							</a>
							<a
								href="#projects"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:shadow-sm"
							>
								View Work
							</a>
						</div>
					</div>

					{/* Profile Image */}
					<div className="animate-slide-in-right hidden opacity-0 animation-delay-400 lg:block">
						<div className="relative">
							{/* Decorative border */}
							<div className="absolute -inset-4 rounded-2xl border border-accent/20" />
							<div className="absolute -inset-8 rounded-3xl border border-border/50" />

							{/* Image container */}
							<div className="relative h-80 w-64 overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-muted">
								<Image
									src="/profile.jpeg"
									alt={personalInfo.name}
									fill
									className="object-cover object-center"
									priority
									sizes="(max-width: 1024px) 0px, 256px"
								/>
							</div>

							{/* AI badge overlay */}
							<div className="absolute -bottom-3 -right-3 rounded-full border border-accent/30 bg-card px-3 py-1.5 shadow-lg">
								<div className="flex items-center gap-1.5 text-xs font-medium">
									<Zap className="h-3 w-3 text-accent" />
									<span>AI-Powered</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="animate-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 opacity-0 animation-delay-1000 md:block">
					<a
						href="#stats"
						className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
						aria-label="Scroll to see more"
					>
						<span className="text-xs uppercase tracking-widest">
							Scroll to explore
						</span>
						<ArrowDown className="h-4 w-4 animate-bounce" />
					</a>
				</div>
			</div>
		</section>
	);
}
