import { Geist, Geist_Mono } from "next/font/google";

export const productSans = Geist({
	variable: "--font-product-sans",
	subsets: ["latin"],
	display: "swap",
});

export const productMono = Geist_Mono({
	variable: "--font-product-mono",
	subsets: ["latin"],
	display: "swap",
});

/** Class names that expose both font variables to the page. */
export const productFonts = `${productSans.variable} ${productMono.variable}`;
