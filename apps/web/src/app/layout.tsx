import type { Metadata } from "next";

import { JetBrains_Mono, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "../index.css";
import { person } from "@/lib/data/profile";
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

const title = `${person.name} — ${person.role}`;

export const metadata: Metadata = {
  title,
  description: person.pitch,
  keywords: [
    "Product Engineer",
    "Founding Engineer",
    "Full-Stack Engineer",
    "AI-native",
    "React",
    "React Native",
    "TypeScript",
    "Python",
    "FastAPI",
    "AWS",
    "Terraform",
    "Remote",
  ],
  authors: [{ name: person.name }],
  openGraph: {
    title,
    description: person.pitch,
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
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
