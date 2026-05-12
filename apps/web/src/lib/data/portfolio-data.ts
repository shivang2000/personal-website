// ═══════════════════════════════════════════════════════════════
// Portfolio Data - Shivang Chheda
// ═══════════════════════════════════════════════════════════════

export const personalInfo = {
  name: "Shivang Chheda",
  title: "Full-Stack Engineer",
  tagline:
    "Product-minded frontend engineer. Ship like a founding engineer. AI-tools-native, motion-aware.",
  headline: "I ship motion-heavy, AI-native product UIs end to end",
  subHeadline:
    "4+ years shipping at US startups from India — always remote, always async. Claude Code + Codex are my daily core workflow, not a gimmick. Currently building a freelance multi-agent travel platform end to end alongside my day job.",
  location:
    "Based in India · IST / EU CET / US EST-PST overlap · Remote contractor, no visa",
  email: "shivangchheda@gmail.com",
  phone: "+91-9029722073",
  linkedin: "https://www.linkedin.com/in/shivang-chheda-83400415a/",
  github: "https://github.com/shivang2000",
  calendly: "https://calendly.com/shivangchheda/15min",
  isAvailable: true,
  seekingRoles: ["Product Engineer", "Full-Stack", "AI-Native", "Forward Deployed", "Web3"],
};

export const stats = [
  { value: "$100K ARR", label: "FactWise enterprise client won" },
  { value: "2–3×", label: "Trestle self-serve revenue lift" },
  { value: "3-service", label: "AI Concierge freelance — solo end-to-end" },
  { value: "OSS", label: "Archestra MCP gateway · PR #3868 merged" },
  { value: "Peak load", label: "Wow Rooms Go API, festival traffic" },
];

export interface Project {
  id: string;
  name: string;
  company: string;
  companyLocation: string;
  period: string;
  role: string;
  description: string;
  heroMetric: string;
  impact: string[];
  techStack: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "aiconcierge",
    name: "AI Concierge — B2C Travel Platform (Freelance)",
    company: "AI Concierge",
    companyLocation: "Freelance, Remote",
    period: "2024 – Present",
    role: "Freelance Full-Stack Engineer (solo)",
    description:
      "Solo-built B2C travel concierge platform — frontend, multi-agent AI backend, vendor-gateway microservice, and AWS infra. Three-service monorepo behind one consumer site.",
    heroMetric: "Solo-Shipped 3-Service Stack",
    impact: [
      "Shipped 3-service monorepo solo — React 19 + Vite 7 + Tailwind 4 frontend, FastAPI multi-agent backend, vendor-gateway microservice",
      "Built LangGraph multi-agent system on FastAPI + Postgres 15 + Redis 7 with idempotent bookings, refund/cancel guards, and ReportLab-generated PDF receipts per booking type",
      "Unified 7-vendor canonical layer (Tripjack flights, AllAboard rail, Airalo eSIM, AirportTransfer, Sixt, TuGo, Travel Buddy) with Redis caching, circuit breakers, exponential-backoff retries, async httpx + asyncpg, Prometheus metrics",
      "Modeled ~250 countries, 6,400+ cities, 7,500+ airports, 940+ airlines with bidirectional vendor-to-canonical mapping and audit-logged confidence scoring",
      "Deployed on AWS EC2 + S3 + Nginx + Docker Compose with Stripe webhooks for payment finalization and Alembic numeric-revision migrations",
    ],
    techStack: [
      "Freelance",
      "React 19",
      "TypeScript",
      "Tailwind 4",
      "shadcn/ui",
      "motion",
      "Redux Toolkit",
      "TanStack Query",
      "FastAPI",
      "Python 3.13",
      "LangGraph",
      "Postgres",
      "Redis",
      "Stripe",
      "AWS",
      "Docker",
    ],
    featured: true,
  },
  {
    id: "trestle",
    name: "Enterprise Product Platform",
    company: "Trestle",
    companyLocation: "Washington, Remote",
    period: "Jul 2025 - Present",
    role: "Software Engineer, Developer Portal",
    description:
      "Redesigning the developer portal to drive self-serve adoption. Taking ownership of complex features from diagnosis through production deployment.",
    heroMetric: "2–3× Self-Serve Revenue Lift",
    impact: [
      "Portal redesign drove a 2–3× lift in self-serve revenue",
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
    heroMetric: "Enterprise Client Closed",
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
    heroMetric: "$100K ARR Client Won",
    impact: [
      "Owned end-to-end development of BOM module - a critical feature securing $100K ARR enterprise client",
      "Designed recursive BOM structures handling nested items with hundreds of entries",
      "Built high-performance React + Redux architecture with atomic components, reducing re-renders significantly",
      "Mentored 2-3 junior engineers on code reviews and architectural decisions",
    ],
    techStack: ["React", "Redux", "TypeScript", "Performance Optimization", "Mentoring"],
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
    heroMetric: "Held Festival Peak Traffic",
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
    title: "Core, shipping daily",
    description: "Primary stack on every role this year",
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "shadcn/ui", "motion", "Node.js"],
  },
  {
    title: "Backend depth",
    description: "Server-side systems I've owned end-to-end",
    skills: ["Go", "Express.js", "Prisma", "PostgreSQL", "REST", "gRPC"],
  },
  {
    title: "Distributed systems",
    description: "Infrastructure and multi-region design",
    skills: ["Docker", "Kubernetes", "AWS", "Microservices", "Multi-region"],
  },
  {
    title: "AI workflow",
    description: "Daily use for navigation, architecture, debugging",
    skills: ["Claude Code", "Codex", "AI Pair Programming", "Agent-native repos"],
  },
  {
    title: "Web3 (exploring)",
    description: "Secondary interest — available for blockchain roles",
    skills: ["Solidity", "Ethers.js", "Smart Contracts"],
  },
];

export interface OpenSourceContribution {
  id: string;
  project: string;
  repo: string;
  tagline: string;
  prTitle: string;
  prNumber: number;
  issueNumber: number;
  mergedDate: string;
  diffStats: { added: number; removed: number };
  description: string;
  status: "merged";
  links: {
    pr: string;
    issue: string;
    repo: string;
  };
}

export const openSourceContributions: OpenSourceContribution[] = [
  {
    id: "archestra",
    project: "Archestra",
    repo: "archestra-ai/archestra",
    tagline: "MCP Gateway for AI Agents",
    prTitle:
      "fix(chat): add copy button to code blocks in conversation artifacts",
    prNumber: 3868,
    issueNumber: 3243,
    mergedDate: "2026-04",
    diffStats: { added: 102, removed: 1 },
    description:
      "Wrapped ReactMarkdown-rendered fenced code in the existing CodeBlock + CodeBlockCopyButton pair using a `pre` component override, and added test coverage for single blocks, inline code, and multi-block instances. Kept the diff intentionally narrow after incorporating prior review feedback — shipped clean, focused work on an unfamiliar AI-native React/TypeScript codebase.",
    status: "merged",
    links: {
      pr: "https://github.com/archestra-ai/archestra/pull/3868",
      issue: "https://github.com/archestra-ai/archestra/issues/3243",
      repo: "https://github.com/archestra-ai/archestra",
    },
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
