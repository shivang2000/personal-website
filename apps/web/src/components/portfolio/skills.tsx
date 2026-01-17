"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { Tag } from "@/components/common/tag";
import { skillCategories } from "@/lib/data/portfolio-data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

/**
 * Skills showcase with categorized tags.
 * Each category has a title, description, and list of skill tags.
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
					{skillCategories.map((category, categoryIndex) => (
						<SkillCategory
							key={category.title}
							category={category}
							index={categoryIndex}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

interface SkillCategoryProps {
	category: (typeof skillCategories)[number];
	index: number;
}

function SkillCategory({ category, index }: SkillCategoryProps) {
	const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

	return (
		<div
			ref={ref}
			className={cn(
				"space-y-4 opacity-0",
				isVisible && "animate-fade-in-up",
				index === 0 && "animation-delay-100",
				index === 1 && "animation-delay-200",
				index === 2 && "animation-delay-300",
				index === 3 && "animation-delay-400",
			)}
		>
			{/* Category header */}
			<div className="space-y-1">
				<h3 className="text-lg font-semibold text-foreground">
					{category.title}
				</h3>
				<p className="text-sm text-muted-foreground">{category.description}</p>
			</div>

			{/* Skills tags */}
			<div className="flex flex-wrap gap-2">
				{category.skills.map((skill) => (
					<Tag key={skill} variant="default" size="md">
						{skill}
					</Tag>
				))}
			</div>
		</div>
	);
}
