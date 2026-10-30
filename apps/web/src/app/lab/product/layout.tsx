import type { Metadata } from "next";

import { productFonts } from "@/variants/product/font";

// The live homepage renders this same variant; keep the lab copy out of search.
export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function ProductLabLayout({ children }: { children: React.ReactNode }) {
	return <div className={productFonts}>{children}</div>;
}
