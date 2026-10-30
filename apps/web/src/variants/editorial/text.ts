// Presentation-only helpers for the editorial variant.
// They change punctuation, never claims: spaced em dashes become
// parentheses or commas, and " · " meta strings become separate parts.

/** Paired " — x — " becomes " (x) "; a lone " — " becomes ", ". */
export function tidy(text: string): string {
	return text.replace(/\s—\s([^—]+?)\s—\s/g, " ($1) ").replace(/\s—\s/g, ", ");
}

/** "AI travel platform · confidential" → ["AI travel platform", "confidential"] */
export function parts(text: string): string[] {
	return text.split(/\s·\s/).map((p) => p.trim());
}

/** "2025 — now" → "2025 to now" */
export function period(text: string): string {
	return text.replace(/\s—\s/g, " to ");
}

const WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function countWord(n: number): string {
	return WORDS[n] ?? String(n);
}

/** Earliest four-digit year mentioned across a list of period strings. */
export function earliestYear(periods: readonly string[]): string | null {
	const years = periods.flatMap((p) => p.match(/\d{4}/g) ?? []).map(Number);
	return years.length ? String(Math.min(...years)) : null;
}

export function mailto(email: string): string {
	const subject = "Let's talk — <Company> role";
	return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
