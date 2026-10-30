"use client";

import { useEffect } from "react";

/**
 * Arms [data-reveal] blocks that start below the fold, then reveals each once as it enters.
 * Content above the fold is never hidden, and without JS nothing is hidden at all.
 */
export function RevealController({ rootId }: { rootId: string }) {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const root = document.getElementById(rootId);
		if (!root || !("IntersectionObserver" in window)) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.setAttribute("data-visible", "");
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: "0px 0px -8% 0px" },
		);

		const fold = window.innerHeight * 0.92;
		for (const element of root.querySelectorAll<HTMLElement>("[data-reveal]")) {
			if (element.getBoundingClientRect().top < fold) continue;
			element.setAttribute("data-armed", "");
			observer.observe(element);
		}

		return () => observer.disconnect();
	}, [rootId]);

	return null;
}
