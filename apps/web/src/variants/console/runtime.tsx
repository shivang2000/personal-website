"use client";

import { useEffect } from "react";

/**
 * One small client leaf that wires the server-rendered page:
 * - the header takes the ground of the chapter under it (opacity crossfade),
 * - the incident index follows the report in view,
 * - section parts rise in once as they enter,
 * - production figures tick up from zero the first time they are seen.
 * Everything is readable without it; nothing here hides content that is already on screen.
 */
export function ConsoleRuntime({ rootId }: { rootId: string }) {
	useEffect(() => {
		const root = document.getElementById(rootId);
		if (!root) return;

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const header = root.querySelector<HTMLElement>("[data-console-header]");
		const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
		const reports = Array.from(root.querySelectorAll<HTMLElement>("[data-spy]"));
		const spyLinks = Array.from(root.querySelectorAll<HTMLElement>("[data-spy-link]"));

		let frame = 0;
		let lastChapter = "";
		let lastReport = "";

		const update = () => {
			frame = 0;
			if (header) {
				const probe = header.offsetHeight / 2;
				for (const c of chapters) {
					const r = c.getBoundingClientRect();
					if (r.top <= probe && r.bottom > probe) {
						const name = c.dataset.chapter ?? "ground";
						if (name !== lastChapter) {
							header.dataset.chapter = name;
							lastChapter = name;
						}
						break;
					}
				}
			}
			if (reports.length) {
				const line = window.innerHeight * 0.45;
				let active = "";
				for (const t of reports) {
					if (t.getBoundingClientRect().top <= line) active = t.id;
				}
				if (!active) active = reports[0]?.id ?? "";
				if (active !== lastReport) {
					lastReport = active;
					for (const l of spyLinks) {
						if (l.dataset.spyLink === active) l.setAttribute("aria-current", "true");
						else l.removeAttribute("aria-current");
					}
				}
			}
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		const observers: IntersectionObserver[] = [];
		const rafs = new Set<number>();
		const canObserve = "IntersectionObserver" in window;

		if (!reduce && canObserve) {
			const io = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (!e.isIntersecting) continue;
						e.target.setAttribute("data-revealed", "");
						io.unobserve(e.target);
					}
				},
				{ threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
			);
			observers.push(io);
			for (const g of root.querySelectorAll<HTMLElement>("[data-reveal-group]")) {
				// Only arm what is still below the fold, so nothing on screen disappears.
				if (g.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
				g.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
					el.style.setProperty("--reveal-i", String(i));
				});
				g.setAttribute("data-armed", "");
				io.observe(g);
			}

			const ticks = Array.from(root.querySelectorAll<HTMLElement>("[data-tick]"));
			const tickIo = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (!e.isIntersecting) continue;
						tickIo.unobserve(e.target);
						runTick(e.target as HTMLElement, rafs);
					}
				},
				{ threshold: 0.6 },
			);
			observers.push(tickIo);
			for (const el of ticks) {
				const final = el.dataset.tick ?? "";
				el.textContent = format(final, 0);
				tickIo.observe(el);
			}
		}

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			if (frame) cancelAnimationFrame(frame);
			for (const o of observers) o.disconnect();
			for (const id of rafs) cancelAnimationFrame(id);
			for (const el of root.querySelectorAll<HTMLElement>("[data-tick]")) {
				el.textContent = el.dataset.tick ?? el.textContent;
			}
		};
	}, [rootId]);

	return null;
}

const NUMBER = /(\d[\d,]*(?:\.\d+)?)/;

/** Replace every number in `final` with its value scaled by `progress` (0–1). */
function format(final: string, progress: number): string {
	return final
		.split(NUMBER)
		.map((part, i) => {
			if (i % 2 === 0) return part;
			const n = Number(part.replace(/,/g, ""));
			const v = Math.round(n * progress);
			return part.includes(",") ? v.toLocaleString("en-US") : String(v);
		})
		.join("");
}

function runTick(el: HTMLElement, rafs: Set<number>) {
	const final = el.dataset.tick ?? "";
	const duration = 1100;
	const start = performance.now();
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		const eased = 1 - (1 - t) ** 3;
		el.textContent = t < 1 ? format(final, eased) : final;
		if (t < 1) {
			const id = requestAnimationFrame(step);
			rafs.add(id);
		}
	};
	rafs.add(requestAnimationFrame(step));
}
