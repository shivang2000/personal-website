"use client";

import { personalInfo, socialLinks } from "@/lib/data/portfolio-data";
import { useFadeInScale } from "@/hooks/use-gsap-animation";
import { Calendar, Github, Linkedin, Mail, Phone } from "lucide-react";

const iconMap = {
	mail: Mail,
	linkedin: Linkedin,
	github: Github,
	phone: Phone,
};

/**
 * Contact CTA section with accent background.
 * Features headline, Calendly scheduling, email link, and social icons.
 * Uses GSAP fade-in-scale animation on scroll.
 */
export function ContactCTA() {
	const ref = useFadeInScale();

	return (
		<section
			id="contact"
			className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28"
		>
			{/* Decorative gradient */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

			<div className="container relative mx-auto max-w-5xl px-6">
				<div
					ref={ref}
					className="mx-auto max-w-2xl space-y-8 text-center"
				>
					{/* Headline */}
					<h2 className="font-sans text-4xl font-bold tracking-tight md:text-5xl">
						Let&apos;s Build Something Great
					</h2>

					{/* Subtitle */}
					<p className="text-lg text-primary-foreground/80">
						I&apos;m currently available for freelance work and remote positions
						with US-based teams. Let&apos;s discuss how I can help bring your
						ideas to life.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						{/* Primary CTA - Schedule a Call */}
						<a
							href={personalInfo.calendly}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-medium text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg"
						>
							<Calendar className="h-5 w-5" />
							Schedule a Call
						</a>

						{/* Secondary CTA - Email */}
						<a
							href={`mailto:${personalInfo.email}`}
							className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-transparent px-8 py-4 text-lg font-medium text-primary-foreground transition-all hover:border-primary-foreground/50 hover:bg-primary-foreground/10"
						>
							<Mail className="h-5 w-5" />
							Send Email
						</a>
					</div>

					{/* Social links */}
					<div className="flex items-center justify-center gap-6 pt-4">
						{socialLinks.map((link) => {
							const Icon = iconMap[link.icon as keyof typeof iconMap];
							return (
								<a
									key={link.name}
									href={link.href}
									target={
										link.href.startsWith("mailto:") ? undefined : "_blank"
									}
									rel={
										link.href.startsWith("mailto:")
											? undefined
											: "noopener noreferrer"
									}
									className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
									aria-label={link.name}
								>
									{Icon && <Icon className="h-5 w-5" />}
									<span className="hidden sm:inline">{link.name}</span>
								</a>
							);
						})}

						{/* Phone */}
						<a
							href={`tel:${personalInfo.phone}`}
							className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
							aria-label="Phone"
						>
							<Phone className="h-5 w-5" />
							<span className="hidden sm:inline">Phone</span>
						</a>
					</div>

					{/* Location note */}
					<p className="text-sm text-primary-foreground/60">
						Based in India • Available for US/EU time zones
					</p>
				</div>
			</div>
		</section>
	);
}
