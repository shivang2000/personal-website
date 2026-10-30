import { roles } from "@/lib/data/profile";
import { employerOf, isConfidential, orderedCases } from "@/variants/product/lib";
import s from "@/variants/product/product.module.css";
import { RevealController } from "@/variants/product/reveal";
import {
	Contact,
	Experience,
	Footer,
	Hero,
	Nav,
	OpenWork,
	SectionHead,
	Toolbox,
} from "@/variants/product/sections";
import { WorkBento } from "@/variants/product/work-bento";
import { Workflow } from "@/variants/product/workflow";

const ROOT_ID = "product-root";

const publicEmployers = roles
	.map((role) => role.company)
	.filter((company) => orderedCases.some((study) => employerOf(study) === company));
const hasConfidential = orderedCases.some(isConfidential);
const workLede = `${orderedCases.length} case studies from ${publicEmployers.join(", ")}${
	hasConfidential ? " and an AI-native travel platform I can't name" : ""
}. Each tile shows the problem and the result; open it for the approach.`;

export function ProductPage() {
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
							lede={workLede}
						/>
						<WorkBento />
					</div>
				</section>
				<Workflow />
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
