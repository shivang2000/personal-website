"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	triggerOnce?: boolean;
}

/**
 * Custom hook for triggering animations when an element enters the viewport.
 * Uses Intersection Observer for performance (no scroll event listeners).
 *
 * @param options.threshold - Visibility threshold (0-1). Default: 0.1 (10% visible)
 * @param options.rootMargin - Margin around root. Default: "0px"
 * @param options.triggerOnce - Only trigger once. Default: true
 *
 * @returns { ref, isVisible } - Ref to attach to element, visibility state
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
	threshold = 0.1,
	rootMargin = "0px",
	triggerOnce = true,
}: UseScrollAnimationOptions = {}) {
	const ref = useRef<T>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsVisible(true);
					if (triggerOnce) {
						observer.disconnect();
					}
				} else if (!triggerOnce) {
					setIsVisible(false);
				}
			},
			{ threshold, rootMargin },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [threshold, rootMargin, triggerOnce]);

	return { ref, isVisible };
}

/**
 * Hook for staggered animations on multiple children.
 * Returns isVisible state and a helper to generate delay classes.
 */
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
	options: UseScrollAnimationOptions = {},
) {
	const { ref, isVisible } = useScrollAnimation<T>(options);

	const getStaggerDelay = (index: number, baseDelayMs = 100) => {
		const delay = index * baseDelayMs;
		// Clamp to available delay classes (100-1000ms)
		const clampedDelay = Math.min(delay, 1000);
		return `animation-delay-${clampedDelay}` as const;
	};

	return { ref, isVisible, getStaggerDelay };
}
