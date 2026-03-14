"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Base hook for GSAP animations with React 19 strict mode support.
 * Uses gsap.context() for proper cleanup.
 *
 * @param callback - Animation setup function receiving the gsap context
 * @param deps - Dependency array for the effect
 * @returns ref to attach to the container element
 */
export function useGsapAnimation<T extends HTMLElement = HTMLDivElement>(
	callback: (ctx: gsap.Context) => void,
	deps: React.DependencyList = [],
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (prefersReducedMotion()) {
			gsap.set(element.querySelectorAll("[data-animate]"), { autoAlpha: 1 });
			gsap.set(element, { autoAlpha: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			callback(ctx!);
		}, element);

		return () => {
			ctx.revert();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return ref;
}

/**
 * Hook for hero page-load animations using a GSAP timeline.
 * Returns a ref and a timeline ref for composing sequential animations.
 */
export function useGsapTimeline<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (prefersReducedMotion()) {
			gsap.set(element.querySelectorAll("[data-animate]"), { autoAlpha: 1 });
			gsap.set(element, { autoAlpha: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			timelineRef.current = gsap.timeline();
		}, element);

		return () => {
			timelineRef.current = null;
			ctx.revert();
		};
	}, []);

	return { ref, timeline: timelineRef };
}

interface CountUpOptions {
	suffix?: string;
	prefix?: string;
	duration?: number;
}

/**
 * Hook for animating a number counting up from 0 to endValue
 * using GSAP with ScrollTrigger.
 *
 * @param endValue - The target number to count up to
 * @param options - Configuration: suffix, prefix, duration
 * @returns { ref, formattedValue }
 */
export function useCountUp(endValue: number, options: CountUpOptions = {}) {
	const { suffix = "", prefix = "", duration = 2 } = options;
	const ref = useRef<HTMLElement>(null);
	const [formattedValue, setFormattedValue] = useState(
		`${prefix}0${suffix}`,
	);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (prefersReducedMotion()) {
			setFormattedValue(`${prefix}${endValue}${suffix}`);
			return;
		}

		const counter = { value: 0 };

		const ctx = gsap.context(() => {
			gsap.to(counter, {
				value: endValue,
				duration,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 80%",
					once: true,
				},
				onUpdate: () => {
					setFormattedValue(
						`${prefix}${Math.round(counter.value)}${suffix}`,
					);
				},
			});
		}, element);

		return () => {
			ctx.revert();
		};
	}, [endValue, suffix, prefix, duration]);

	return { ref, formattedValue };
}

/**
 * Hook for staggered reveal animations on child elements.
 * Children should have the `data-animate` attribute to be targeted.
 *
 * @param stagger - Delay between each child animation in seconds (default: 0.05)
 * @returns ref to attach to the container element
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
	stagger = 0.05,
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const children = element.querySelectorAll("[data-animate]");

		if (prefersReducedMotion()) {
			gsap.set(children, { autoAlpha: 1, y: 0 });
			return;
		}

		const ctx = gsap.context(() => {
			gsap.set(children, { autoAlpha: 0, y: 20 });

			gsap.to(children, {
				autoAlpha: 1,
				y: 0,
				duration: 0.6,
				stagger,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 80%",
					once: true,
				},
			});
		}, element);

		return () => {
			ctx.revert();
		};
	}, [stagger]);

	return ref;
}

/**
 * Hook for slide-in animations from left or right using ScrollTrigger.
 *
 * @param direction - Slide direction: "left" or "right" (default: "left")
 * @returns ref to attach to the element
 */
export function useSlideIn<T extends HTMLElement = HTMLDivElement>(
	direction: "left" | "right" = "left",
) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (prefersReducedMotion()) {
			gsap.set(element, { autoAlpha: 1, x: 0 });
			return;
		}

		const xOffset = direction === "left" ? -60 : 60;

		const ctx = gsap.context(() => {
			gsap.set(element, { autoAlpha: 0, x: xOffset });

			gsap.to(element, {
				autoAlpha: 1,
				x: 0,
				duration: 0.8,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 80%",
					once: true,
				},
			});
		}, element);

		return () => {
			ctx.revert();
		};
	}, [direction]);

	return ref;
}

/**
 * Hook for fade-in with scale animation using ScrollTrigger.
 * Useful for contact CTAs, section headings.
 *
 * @returns ref to attach to the element
 */
export function useFadeInScale<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (prefersReducedMotion()) {
			gsap.set(element, { autoAlpha: 1, scale: 1 });
			return;
		}

		const ctx = gsap.context(() => {
			gsap.set(element, { autoAlpha: 0, scale: 0.95 });

			gsap.to(element, {
				autoAlpha: 1,
				scale: 1,
				duration: 0.8,
				ease: "power2.out",
				scrollTrigger: {
					trigger: element,
					start: "top 80%",
					once: true,
				},
			});
		}, element);

		return () => {
			ctx.revert();
		};
	}, []);

	return ref;
}
