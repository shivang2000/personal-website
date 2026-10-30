import type { ReactNode } from "react";

import { person } from "@/lib/data/profile";

export const PLACEHOLDER_COMPANY = "[Company]";

export function subjectFor(company: string): string {
	const name = company.trim() || PLACEHOLDER_COMPANY;
	return `Let's talk — ${name} role`;
}

export function mailtoFor(company = ""): string {
	return `mailto:${person.email}?subject=${encodeURIComponent(subjectFor(company))}`;
}

/**
 * The pitch reads "A — B — C". The headline sets A and C on two lines; B (the
 * layers of the stack) moves to the status bar. Falls back to the whole pitch.
 */
export function splitPitch(pitch: string): { lead: string; tail: string; layers: string | null } {
	const parts = pitch.split(" — ");
	const [a, b, c] = parts;
	if (parts.length === 3 && a && b && c) {
		return { lead: `${a},`, tail: c, layers: b };
	}
	return { lead: pitch, tail: "", layers: null };
}

/** First sentence and the rest, split on the first ". " */
export function splitFirstSentence(text: string): [string, string] {
	const i = text.indexOf(". ");
	if (i === -1) return [text, ""];
	return [text.slice(0, i + 1), text.slice(i + 2)];
}

export function capitalise(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Wrap each phrase (if present) in a <mark>. Phrases not found are skipped. */
export function highlight(text: string, phrases: readonly string[], markClass: string): ReactNode[] {
	const out: ReactNode[] = [];
	let rest = text;
	let key = 0;
	for (;;) {
		let best = -1;
		let hit = "";
		for (const p of phrases) {
			const i = rest.indexOf(p);
			if (i !== -1 && (best === -1 || i < best)) {
				best = i;
				hit = p;
			}
		}
		if (best === -1) break;
		if (best > 0) out.push(rest.slice(0, best));
		out.push(
			<mark key={key++} className={markClass}>
				{hit}
			</mark>,
		);
		rest = rest.slice(best + hit.length);
	}
	if (rest) out.push(rest);
	return out;
}
