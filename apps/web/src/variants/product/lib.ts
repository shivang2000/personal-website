import { caseStudies, person, roleCaseStudies, stack, type CaseStudy } from "@/lib/data/profile";

export const mailtoHref = `mailto:${person.email}?subject=${encodeURIComponent("Let's talk about a role")}`;

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

/** "Trestle · Developer portal" → "Trestle"; "AI travel platform · confidential" → "AI travel platform". */
export function employerOf(study: CaseStudy): string {
	return study.context.split(" · ")[0]?.trim() || study.context;
}

export function isConfidential(study: CaseStudy): boolean {
	return /confidential/i.test(study.context);
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export const roleAnchor = (company: string) => `role-${slugify(company)}`;
export const CASE_HASH = "#case-";

/**
 * Editorial order for the work grid: lead with a mix so the confidential platform never
 * fills the first screen. Any case not listed here is appended, so new data still renders.
 */
const caseOrder = [
	"kubernetes-exit",
	"trestle-portal",
	"refund-guarantee",
	"factwise-bom",
	"trestle-memory",
	"performance",
	"zania-soc2",
	"signup-forensics",
	"wowrooms-search",
	"memory-dom",
	"data-security",
	"ci-rescue",
];

const everyCase: CaseStudy[] = [...caseStudies, ...roleCaseStudies];

export const orderedCases: CaseStudy[] = [
	...caseOrder.flatMap((slug) => everyCase.filter((study) => study.slug === slug)),
	...everyCase.filter((study) => !caseOrder.includes(study.slug)),
];

export function caseForCompany(company: string): CaseStudy | undefined {
	return roleCaseStudies.find((study) => employerOf(study) === company);
}

/** Which result reads best as the one-line proof on a tile (default: the first). */
const leadIndex: Record<string, number> = { "zania-soc2": 1, "wowrooms-search": 1 };

export function leadResult(study: CaseStudy) {
	return study.results[leadIndex[study.slug] ?? 0] ?? study.results[0];
}

/** Results that a bar can honestly show: before → after, or an A vs B split. */
export function isChartable(value: string): boolean {
	return parseDelta(value) !== null || parseVersus(value) !== null;
}
