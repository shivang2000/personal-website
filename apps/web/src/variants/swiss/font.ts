import { Archivo } from "next/font/google";

// One grotesk family, two axes. Weight carries hierarchy; the width axis
// condenses the numerals so the proof can be set at poster scale.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-swiss",
  display: "swap",
});
