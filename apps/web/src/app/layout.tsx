import type { Metadata } from "next";

import { JetBrains_Mono, Sora } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Shivang Chheda · Full-Stack Engineer · React · TypeScript · Node.js · Go",
  description:
    "Full-stack engineer shipping end-to-end at US startups from India. AI-tools-native (Claude Code, Codex). Recent OSS: Archestra MCP gateway (PR #3868).",
  keywords: [
    "Full-Stack Engineer",
    "AI-Native Developer",
    "Forward Deployed Engineer",
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Go",
    "Claude Code",
    "Remote Developer",
  ],
  authors: [{ name: "Shivang Chheda" }],
  openGraph: {
    title: "Shivang Chheda — Full-Stack Engineer, AI-tools-native",
    description:
      "Ships like a founding engineer. $100K ARR enterprise wins, 2–3× revenue lift, merged OSS into Archestra.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
