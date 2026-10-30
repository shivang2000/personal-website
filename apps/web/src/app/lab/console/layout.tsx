import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Martian_Mono } from "next/font/google";

const sans = Instrument_Sans({
	subsets: ["latin"],
	axes: ["wdth"],
	variable: "--cx-sans",
	display: "swap",
});

const mono = Martian_Mono({
	subsets: ["latin"],
	axes: ["wdth"],
	variable: "--cx-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Shivang Chheda · Product engineer who runs what he ships",
	description:
		"I build the whole product — UI, backend, payments, infra — and then I run it in production. Incident reports, numbers and a deploy log.",
	robots: { index: false, follow: false },
};

export const viewport: Viewport = {
	themeColor: "#0d0d0c",
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
