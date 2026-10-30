import type { Metadata } from "next";

import { archivo } from "@/variants/swiss/font";

// The live homepage renders this same variant; keep the lab copy out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SwissLayout({ children }: { children: React.ReactNode }) {
  return <div className={archivo.variable}>{children}</div>;
}
