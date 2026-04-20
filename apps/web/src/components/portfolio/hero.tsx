"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Badge } from "@/components/common/badge";
import { personalInfo } from "@/lib/data/portfolio-data";
import { ArrowDown, MapPin, Sparkles, Zap } from "lucide-react";

/**
 * Hero section with GSAP timeline animation, AI-powered development edge,
 * Web3/Blockchain focus, and "Available for Hire" badge.
 */
export function Hero() {
	const words = personalInfo.name.split(" ");
	const heroRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = heroRef.current;
		if (!element) return;

		// Check prefers-reduced-motion
		if (
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			gsap.set(element.querySelectorAll("[data-hero-animate]"), {
				autoAlpha: 1,
				y: 0,
			});
			return;
		}

		const ctx = gsap.context(() => {
			// Set initial state for all animated elements
			gsap.set("[data-hero-animate]", { autoAlpha: 0, y: 20 });

			const tl = gsap.timeline();

			// 1. Name words — staggered reveal
			tl.to("[data-hero-word]", {
				autoAlpha: 1,
				y: 0,
				duration: 0.6,
				ease: "power2.out",
				stagger: 0.08,
			});

			// 2. Title/headline
			tl.to(
				"[data-hero-title]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// 3. Description blocks
			tl.to(
				"[data-hero-description]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
					stagger: 0.1,
				},
				"-=0.3",
			);

			// 4. Badges
			tl.to(
				"[data-hero-badges]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// 5. CTAs
			tl.to(
				"[data-hero-cta]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.2",
			);

			// 6. Profile image
			tl.to(
				"[data-hero-image]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.4",
			);

			// 7. Scroll indicator
			tl.to(
				"[data-hero-scroll]",
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.2",
			);
		}, element);

		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<section ref={heroRef} className="relative overflow-hidden">
			{/* Subtle gradient background */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

			<div className="container relative mx-auto max-w-5xl px-6 pb-20 pt-24 md:pb-32 md:pt-32">
				<div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
					{/* Text Content */}
					<div className="space-y-6">
						{/* Badges row */}
						<div
							data-hero-animate
							data-hero-badges
							className="flex flex-wrap items-center gap-3"
						>
							{personalInfo.isAvailable && (
								<Badge variant="accent" pulse>
									Available for Hire
								</Badge>
							)}
							<Badge variant="accent">
								<Zap className="mr-1 h-3 w-3" />
								AI-Native
							</Badge>
							<Badge variant="outline">
								<Sparkles className="mr-1 h-3 w-3" />
								Web3 / Blockchain
							</Badge>
						</div>

						{/* Name with staggered word animation */}
						<h1 className="text-hero font-sans font-bold tracking-tight text-foreground">
							{words.map((word, index) => (
								<span
									key={word}
									data-hero-animate
									data-hero-word
									className="inline-block"
								>
									{word}
									{index < words.length - 1 && "\u00A0"}
								</span>
							))}
						</h1>

						{/* Title */}
						<p
							data-hero-animate
							data-hero-title
							className="text-2xl font-medium text-accent md:text-3xl"
						>
							{personalInfo.title}
						</p>

						{/* Bold AI statement - the differentiator */}
						<div data-hero-animate data-hero-description className="space-y-3">
							<div className="flex items-center gap-2">
								<Zap className="h-5 w-5 text-accent" />
								<span className="text-lg font-semibold text-foreground md:text-xl">
									{personalInfo.headline}
								</span>
							</div>
							<p className="text-body-lg max-w-xl text-muted-foreground">
								{personalInfo.subHeadline}
							</p>
						</div>

						{/* Tech focus */}
						<p
							data-hero-animate
							data-hero-description
							className="text-body-lg text-muted-foreground"
						>
							Specializing in{" "}
							<span className="text-foreground">
								React, TypeScript, Node.js, Go
							</span>{" "}
							— AI-native workflow with{" "}
							<span className="text-foreground">Claude Code and Codex</span>.
						</p>

						{/* Location */}
						<div
							data-hero-animate
							data-hero-badges
							className="flex items-center gap-2 text-sm text-muted-foreground"
						>
							<MapPin className="h-4 w-4" />
							<span>{personalInfo.location}</span>
						</div>

						{/* CTA Buttons */}
						<div
							data-hero-animate
							data-hero-cta
							className="flex flex-wrap gap-4 pt-4"
						>
							<a
								href={`mailto:${personalInfo.email}?subject=${encodeURIComponent("Role at [Company] — let's talk")}`}
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg"
							>
								Hire me
							</a>
							<a
								href="#projects"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/50 bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-accent hover:shadow-sm"
							>
								View Work
							</a>
						</div>
					</div>

					{/* Profile Image */}
					<div
						data-hero-animate
						data-hero-image
						className="hidden lg:block"
					>
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
				<div
					data-hero-animate
					data-hero-scroll
					className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
				>
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
