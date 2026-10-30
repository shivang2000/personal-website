import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";

import "@/variants/editorial/tokens.css";

const serif = Newsreader({
	subsets: ["latin"],
	style: ["normal", "italic"],
	axes: ["opsz"],
	variable: "--ed-serif",
	display: "swap",
});

const sans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["400", "600"],
	variable: "--ed-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Shivang Chheda, product engineer",
	description:
		"Shivang Chheda builds the whole product (UI, backend, payments, infra) and runs it in production. Six case studies, footnoted.",
	robots: { index: false, follow: false },
};

export default function EditorialLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
