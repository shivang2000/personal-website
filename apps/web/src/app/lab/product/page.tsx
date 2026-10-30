import { caseStudies } from "@/lib/data/profile";
import s from "@/variants/product/product.module.css";
import { RevealController } from "@/variants/product/reveal";
import {
	Contact,
	Experience,
	Footer,
	Hero,
	HowIWork,
	Nav,
	OpenWork,
	SectionHead,
	Toolbox,
} from "@/variants/product/sections";
import { WorkBento } from "@/variants/product/work-bento";

const ROOT_ID = "product-root";

export default function ProductLabPage() {
	return (
		<div id={ROOT_ID} className={s.root}>
			<a href="#main" className={s.skip}>
				Skip to content
			</a>
			<Nav />
			<main id="main">
				<Hero />
				<section id="work" className={s.section} aria-labelledby="product-work-title">
					<div className={s.container}>
						<SectionHead
							id="product-work-title"
							eyebrow="Selected work"
							title="Problems I owned, from first signal to production."
							lede={`${caseStudies.length} case studies from an AI-native travel platform I can't name. Open any tile for the problem, the approach and the results.`}
						/>
						<WorkBento />
					</div>
				</section>
				<HowIWork />
				<Experience />
				<OpenWork />
				<Toolbox />
				<Contact />
			</main>
			<Footer />
			<RevealController rootId={ROOT_ID} />
		</div>
	);
}
