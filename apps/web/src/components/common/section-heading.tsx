"use client";

import { cn } from "@/lib/utils";
import { useFadeInScale } from "@/hooks/use-gsap-animation";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Editorial section heading with serif title, decorative underline, and optional subtitle.
 * Includes scroll-triggered fade-in animation.
 */
export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const ref = useFadeInScale();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 space-y-3",
        {
          "text-left": align === "left",
          "text-center": align === "center",
        },
        className,
      )}
    >
      <div className={cn("inline-block", align === "center" && "w-full")}>
        <h2
          className="text-section-title font-sans font-bold tracking-tight text-foreground"
        >
          {title}
        </h2>
        {/* Decorative wavy underline */}
        <svg
          className={cn(
            "mt-2 h-2 w-32",
            align === "center" && "mx-auto",
          )}
          viewBox="0 0 120 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4C8 2 14 6 20 4C26 2 32 6 38 4C44 2 50 6 56 4C62 2 68 6 74 4C80 2 86 6 92 4C98 2 104 6 110 4C116 2 118 4 118 4"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="0">
              <stop offset="0%" stopColor="oklch(0.82 0.22 155)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 155)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {subtitle && (
        <p
          className={cn(
            "text-body-lg max-w-2xl text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
