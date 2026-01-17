// ═══════════════════════════════════════════════════════════════
// Portfolio Data - Shivang Chheda
// ═══════════════════════════════════════════════════════════════

export const personalInfo = {
	name: "Shivang Chheda",
	title: "Full-Stack Engineer",
	tagline: "Building high-performance applications for US remote teams",
	headline: "I ship 10x faster with AI-assisted development",
	subHeadline: "Deep engineering fundamentals + AI tools like Claude Code = rapid, quality delivery",
	location: "Remote (India) • US/EU Time Zones",
	email: "shivangchheda@gmail.com",
	phone: "+91-9029722073",
	linkedin: "https://www.linkedin.com/in/shivang-chheda-83400415a/",
	github: "https://github.com/shivang2000",
	calendly: "https://calendly.com/shivangchheda/15min",
	isAvailable: true,
	seekingRoles: ["Web3", "Blockchain", "Full-Stack", "Frontend"],
};

export const stats = [
	{
		value: "3+",
		label: "Years Experience",
	},
	{
		value: "10x",
		label: "Faster with AI Tools",
	},
	{
		value: "$100K+",
		label: "Client Value Generated",
	},
];

export interface Project {
	id: string;
	name: string;
	company: string;
	companyLocation: string;
	period: string;
	role: string;
	description: string;
	impact: string[];
	techStack: string[];
	featured: boolean;
}

export const projects: Project[] = [
	{
		id: "trestle",
		name: "Enterprise Product Platform",
		company: "Trestle",
		companyLocation: "Washington, Remote",
		period: "Jul 2025 - Present",
		role: "Software Engineer, Frontend",
		description:
			"Enhancing product features for user engagement and retention at a US-based startup. Taking ownership of complex features from diagnosis through production deployment.",
		impact: [
			"Improved and enhanced existing product features to increase user engagement and retention",
			"Took ownership of complex features independently, from diagnosis to production-ready solutions",
			"Collaborated with product and design teams to refine UX and performance of critical user flows",
		],
		techStack: ["React", "TypeScript", "Next.js", "TailwindCSS"],
		featured: true,
	},
	{
		id: "zania",
		name: "AI-Driven Compliance Platform",
		company: "Zania",
		companyLocation: "San Francisco, Remote",
		period: "Sep 2024 - Apr 2025",
		role: "Software Engineer, Frontend",
		description:
			"Built AI-powered compliance features that streamlined SOC 2 auditing for enterprise clients. Worked closely with US-based teams across time zones.",
		impact: [
			"Implemented SOC 2 Type II compliance features within the compliance AI agent",
			"Directly contributed to winning a new enterprise client",
			"Reduced production bugs, improving overall application reliability and user trust",
		],
		techStack: ["React", "TypeScript", "AI/ML Integration", "SOC 2 Compliance"],
		featured: true,
	},
	{
		id: "factwise",
		name: "Procurement SaaS Platform",
		company: "FactWise Tech",
		companyLocation: "SaaS Platform",
		period: "Feb 2023 - Sep 2024",
		role: "Frontend Engineer",
		description:
			"Led development of complex, data-intensive dashboards and the Bill of Materials module for enterprise procurement workflows.",
		impact: [
			"Owned end-to-end development of BOM module - a critical feature securing $100K ARR enterprise client",
			"Designed recursive BOM structures handling nested items with hundreds of entries",
			"Built high-performance React + Redux architecture with atomic components, reducing re-renders significantly",
			"Mentored 2-3 junior engineers on code reviews and architectural decisions",
		],
		techStack: [
			"React",
			"Redux",
			"TypeScript",
			"Performance Optimization",
			"Mentoring",
		],
		featured: true,
	},
	{
		id: "wowrooms",
		name: "Hotel Booking Platform",
		company: "Wow Rooms Hospitality",
		companyLocation: "Mumbai, India",
		period: "Apr 2022 - Feb 2023",
		role: "SDE I",
		description:
			"Led frontend development and built high-performance backend services for a hotel booking platform handling festival peak traffic.",
		impact: [
			"Led frontend development for vendor-facing mobile application",
			"Developed high-performance search API in Go handling peak traffic without degradation",
			"Built internal Node.js/Express.js backend services for operations support",
			"Designed workflows reducing booking conflicts and improving fulfillment reliability",
		],
		techStack: ["React", "Go", "Node.js", "Express.js", "Mobile Development"],
		featured: true,
	},
];

export interface SkillCategory {
	title: string;
	description: string;
	skills: string[];
}

export const skillCategories: SkillCategory[] = [
	{
		title: "Frontend",
		description: "Building performant, accessible user interfaces",
		skills: [
			"React",
			"Next.js",
			"TypeScript",
			"Redux",
			"TailwindCSS",
			"React Query",
		],
	},
	{
		title: "Backend",
		description: "Scalable APIs and server-side systems",
		skills: [
			"Node.js",
			"Go",
			"Express.js",
			"PostgreSQL",
			"MongoDB",
			"RESTful APIs",
		],
	},
	{
		title: "Web3 & Blockchain",
		description: "Exploring decentralized technologies",
		skills: [
			"Solidity",
			"Ethers.js",
			"Smart Contracts",
			"DeFi",
			"NFTs",
			"Web3.js",
		],
	},
	{
		title: "AI-Augmented Development",
		description: "10x productivity with modern AI tools",
		skills: [
			"Claude Code",
			"AI Pair Programming",
			"Rapid Prototyping",
			"Code Review with AI",
			"Deep Fundamentals",
			"System Design",
		],
	},
];

export const socialLinks = [
	{
		name: "Email",
		href: `mailto:${personalInfo.email}`,
		icon: "mail",
	},
	{
		name: "LinkedIn",
		href: personalInfo.linkedin,
		icon: "linkedin",
	},
	{
		name: "GitHub",
		href: personalInfo.github,
		icon: "github",
	},
];
