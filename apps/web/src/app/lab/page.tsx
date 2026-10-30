import type { Metadata } from "next";
import Link from "next/link";

import { variants } from "./variants";

export const metadata: Metadata = {
  title: "Design Lab · Shivang Chheda",
  robots: { index: false, follow: false },
};

export default function LabIndex() {
  return (
    <main className="mx-auto min-h-svh max-w-3xl px-6 py-24 font-sans">
      <p className="font-mono text-xs text-muted-foreground uppercase">Design lab</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Portfolio variants</h1>
      <p className="mt-4 text-muted-foreground">
        Same content, different art direction. Each one is a full page.
      </p>
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {variants.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/lab/${v.slug}`}
              className="flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-accent"
            >
              <span className="text-lg font-medium">{v.name}</span>
              <span className="text-right text-sm text-muted-foreground">{v.direction}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
