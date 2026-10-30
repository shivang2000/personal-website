import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { person } from "@/lib/data/profile";

const sans = Geist({
	variable: "--font-product-sans",
	subsets: ["latin"],
	display: "swap",
});

const mono = Geist_Mono({
	variable: "--font-product-mono",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: `${person.name} · ${person.role}`,
	description: person.pitch,
	robots: { index: false, follow: false },
};

export default function ProductLabLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
