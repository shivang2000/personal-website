import type { Metadata } from "next";

// Design explorations. The chosen direction is the homepage; keep these out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
