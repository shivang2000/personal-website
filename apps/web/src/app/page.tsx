import { archivo } from "@/variants/swiss/font";
import { SwissPage } from "@/variants/swiss/swiss-page";

/**
 * Homepage — the "Swiss" variant, chosen by the design council (Oct 2026).
 * Other directions live under /lab for comparison.
 */
export default function Home() {
  return (
    <div className={archivo.variable}>
      <SwissPage />
    </div>
  );
}
