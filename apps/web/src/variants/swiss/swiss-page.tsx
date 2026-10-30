import { Contact, Footer } from "./contact";
import { Header, Hero } from "./hero";
import { Experience, Method, OpenWork } from "./record";
import s from "./swiss.module.css";
import { Work } from "./work";

export function SwissPage() {
  return (
    <div className={s.root}>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Method />
        <Experience />
        <OpenWork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
