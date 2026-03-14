"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
	const lenisRef = useRef<Lenis | null>(null);
	const rafCallbackRef = useRef<((time: number) => void) | null>(null);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			return;
		}

		const lenis = new Lenis({
			duration: 1.8,
			lerp: 0.1,
			smoothWheel: true,
			touchMultiplier: 2,
		});

		lenisRef.current = lenis;

		lenis.on("scroll", ScrollTrigger.update);

		const rafCallback = (time: number) => {
			lenis.raf(time * 1000);
		};

		rafCallbackRef.current = rafCallback;
		gsap.ticker.add(rafCallback);
		gsap.ticker.lagSmoothing(0);

		return () => {
			if (rafCallbackRef.current) {
				gsap.ticker.remove(rafCallbackRef.current);
			}
			lenis.destroy();
			lenisRef.current = null;
		};
	}, []);

	return <>{children}</>;
}
