"use client";

import { useEffect } from "react";

/**
 * The page's one reveal: result figures settle into place as the reader
 * reaches them. Content is fully visible without this script; it only arms
 * the motion for figures still below the fold, and does nothing under
 * prefers-reduced-motion.
 */
export function RevealFigures({ rootId }: { rootId: string }) {
	useEffect(() => {
		const root = document.getElementById(rootId);
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const figures = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
		const fold = window.innerHeight;
		for (const el of figures) {
			const box = el.getBoundingClientRect();
			if (box.top < fold && box.bottom > 0) el.dataset.in = "";
		}
		root.dataset.js = "";

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					(entry.target as HTMLElement).dataset.in = "";
					io.unobserve(entry.target);
				}
			},
			{ rootMargin: "0px 0px -12% 0px" },
		);
		for (const el of figures) if (!("in" in el.dataset)) io.observe(el);

		return () => {
			io.disconnect();
			delete root.dataset.js;
		};
	}, [rootId]);

	return null;
}
