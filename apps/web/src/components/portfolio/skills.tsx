"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { Tag } from "@/components/common/tag";
import { skillCategories } from "@/lib/data/portfolio-data";
import { useStaggerReveal } from "@/hooks/use-gsap-animation";

/**
 * Skills showcase with categorized tags.
 * Each category has a title, description, and list of skill tags
 * with GSAP staggered reveal animations.
 */
export function Skills() {
	return (
		<section id="skills" className="py-20 md:py-28">
			<div className="container mx-auto max-w-5xl px-6">
				<SectionHeading
					title="Skills & Expertise"
					subtitle="Technologies and practices I use to build exceptional products"
				/>

				<div className="grid gap-10 md:grid-cols-2">
					{skillCategories.map((category) => (
						<SkillCategory key={category.title} category={category} />
					))}
				</div>
			</div>
		</section>
	);
}

interface SkillCategoryProps {
	category: (typeof skillCategories)[number];
}

function SkillCategory({ category }: SkillCategoryProps) {
	const ref = useStaggerReveal(0.05);

	return (
		<div ref={ref} className="space-y-4">
			{/* Category header */}
			<div className="space-y-1" data-animate>
				<h3 className="text-lg font-semibold text-foreground">
					{category.title}
				</h3>
				<p className="text-sm text-muted-foreground">
					{category.description}
				</p>
			</div>

			{/* Skills tags */}
			<div className="flex flex-wrap gap-2">
				{category.skills.map((skill) => (
					<Tag key={skill} variant="default" size="md" data-animate>
						{skill}
					</Tag>
				))}
			</div>
		</div>
	);
}
