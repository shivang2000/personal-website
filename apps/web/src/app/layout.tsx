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
  title: "Shivang Chheda | Full-Stack Engineer",
  description:
    "Frontend & Full-Stack Engineer specializing in React, TypeScript, Node.js, and Go. Building high-performance applications for US remote teams.",
  keywords: [
    "Full-Stack Engineer",
    "React Developer",
    "TypeScript",
    "Node.js",
    "Go",
    "Remote Developer",
    "Freelance Developer",
  ],
  authors: [{ name: "Shivang Chheda" }],
  openGraph: {
    title: "Shivang Chheda | Full-Stack Engineer",
    description:
      "Frontend & Full-Stack Engineer specializing in React, TypeScript, Node.js, and Go.",
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
      <body
        className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}
      >
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
