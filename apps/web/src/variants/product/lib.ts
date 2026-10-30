import { person, stack } from "@/lib/data/profile";

export const mailtoHref = `mailto:${person.email}?subject=${encodeURIComponent("Let's talk — <Company> role")}`;

function firstNumber(input: string): number | null {
	const match = input.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
	return match ? Number.parseFloat(match[0]) : null;
}

export interface Delta {
	from: string;
	to: string;
	/** after / before, 0..1 for an improvement */
	ratio: number;
}

/** Parses a profile value like "$500 → $298" or "~300 → ~20 ms". */
export function parseDelta(value: string): Delta | null {
	const [rawFrom, rawTo, ...rest] = value.split("→").map((part) => part.trim());
	if (!rawFrom || !rawTo || rest.length > 0) return null;
	const from = firstNumber(rawFrom);
	const to = firstNumber(rawTo);
	if (from === null || to === null || from === 0) return null;
	return { from: rawFrom, to: rawTo, ratio: Math.min(to / from, 1) };
}

/** Parses a profile value like "36% vs 18%". */
export function parseVersus(value: string): [number, number] | null {
	const [a, b, ...rest] = value.split("vs").map((part) => part.trim());
	if (!a || !b || rest.length > 0) return null;
	const left = firstNumber(a);
	const right = firstNumber(b);
	return left === null || right === null ? null : [left, right];
}

export function percentOf(value: string): number | null {
	return value.includes("%") ? firstNumber(value) : null;
}

const allStackItems: readonly string[] = stack.flatMap((group) => group.items);

/** Only returns tools that are actually listed in profile.stack. */
export function pickStack(names: readonly string[]): string[] {
	return names.filter((name) => allStackItems.includes(name));
}

/** Splits the pitch on its em-dash clauses so the middle can be de-emphasised. */
export function splitPitch(pitch: string): [string, string, string] | null {
	const parts = pitch.split(" — ");
	if (parts.length !== 3) return null;
	const [a, b, c] = parts;
	return a && b && c ? [a, b, c] : null;
}

export function firstSentence(text: string): string {
	const index = text.indexOf(". ");
	return index === -1 ? text : text.slice(0, index + 1);
}

export function withPeriod(text: string): string {
	return /[.!?]$/.test(text) ? text : `${text}.`;
}
