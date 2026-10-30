// ═══════════════════════════════════════════════════════════════
// Canonical portfolio content — every design variant reads from here.
//
// Sourcing rule: every number below traces to a merged PR or a dated
// incident note in career-ops/output/achievements-dossier-2026-10-30.md.
// Do not add a metric that isn't in that dossier.
//
// Disclosure rule: the AI travel platform is confidential. Never name
// the company, link its repos/site, or put a start date next to it.
// It appears only as anonymized case studies.
// ═══════════════════════════════════════════════════════════════

export const person = {
  name: "Shivang Chheda",
  role: "Product Engineer",
  // One line a recruiter can repeat to a hiring manager.
  pitch: "I build the whole product — UI, backend, payments, infra — and then I run it in production.",
  intro:
    "Full-stack engineer, 4+ years at product startups (mostly US), fully remote. Lately I've been the engineer who owns everything on an AI-native travel platform: React and React Native front ends, a Python payments backend, AWS and Terraform. I work AI-native — parallel Claude Code agents, multi-model review — and I own the design, review, merge and production calls.",
  location: "India · overlaps US and EU hours",
  availability: "Open to founding, product and full-stack roles at AI-native startups.",
  email: "shivangchheda@gmail.com",
  links: {
    github: "https://github.com/shivang2000",
    linkedin: "https://www.linkedin.com/in/shivang-chheda-83400415a/",
    resume: "/resume.pdf",
    calendly: "https://calendly.com/shivangchheda/15min",
  },
} as const;

/**
 * Headline proof. Short value, short label. Ordered by recruiter impact.
 * `ref` points at the case study slug or role company that tells the story.
 */
export const proof = [
  { value: "0", unit: "errors", label: "during a live production cutover off Kubernetes", ref: { kind: "case", id: "kubernetes-exit" } },
  { value: "~40%", unit: "", label: "cut in AWS spend, from $500 to $298 a month", ref: { kind: "case", id: "kubernetes-exit" } },
  { value: "$100K", unit: "ARR", label: "enterprise client won on a module I owned", ref: { kind: "role", id: "FactWise" } },
  { value: "2–3×", unit: "", label: "self-serve revenue after a portal redesign", ref: { kind: "role", id: "Trestle" } },
  { value: "1,500+", unit: "PRs", label: "merged across 7 repos in 2026, agent-assisted and human-reviewed", ref: { kind: "case", id: "ci-rescue" } },
] as const;

export interface CaseStudy {
  slug: string;
  title: string;
  /** One-sentence hook, written as the outcome. */
  summary: string;
  context: string;
  problem: string;
  approach: string[];
  results: { value: string; label: string }[];
  stack: string[];
}

/** Confidential AI travel platform — anonymized. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "kubernetes-exit",
    title: "Taking production off Kubernetes",
    summary: "Moved a live booking platform from EKS to two EC2 servers with zero errors, and cut the AWS bill by about 40%.",
    context: "AI travel platform · confidential",
    problem:
      "The startup's AWS bill ran about $500 a month while the Kubernetes nodes sat at 3–5% CPU. Vendors had allowlisted one outbound IP, so any migration that changed it would break bookings.",
    approach: [
      "Right-sized nodes, moved Postgres to Graviton single-AZ and deleted a forgotten Aurora database, all in Terraform.",
      "Caught that seven 'idle' Elastic IPs were really the load balancer and NAT addresses — releasing them would have taken the site down.",
      "Migrated production to two Graviton EC2 boxes, carried the vendor-allowlisted IP across, and soaked for 60 minutes before destroying 49 EKS resources.",
    ],
    results: [
      { value: "0", label: "5xx or Sentry errors through cutover" },
      { value: "$500 → $298", label: "monthly AWS run-rate" },
      { value: "49", label: "EKS resources retired" },
    ],
    stack: ["Terraform", "AWS EC2 / RDS", "Docker Compose", "Cloudflare", "Postgres"],
  },
  {
    slug: "refund-guarantee",
    title: "A refund guarantee for every booking",
    summary: "Made 'paid but no ticket' impossible to leave unresolved: any booking that fails after payment is refunded automatically.",
    context: "AI travel platform · confidential",
    problem:
      "A customer paid AED 630.98 for a flight; the airline vendor rejected the booking after payment. Money captured, no ticket, no refund — and the bug was invisible on the test environment.",
    approach: [
      "Shipped an inline refund on definitive vendor rejections plus a verify-first sweep with row locks and Stripe idempotency keys.",
      "Generalized it to flights, trains, eSIM, transfers, hotels and airport services, with verifiers that check whether the vendor actually booked before refunding.",
      "Along the way found every train and eSIM payment had been orphaned from its booking, and that a redelivered webhook could flip a refund back to paid.",
    ],
    results: [
      { value: "6", label: "booking types covered" },
      { value: "10 min", label: "sweep interval for stuck payments" },
      { value: "2", label: "silent money bugs found and fixed" },
    ],
    stack: ["Python", "FastAPI", "Stripe", "Postgres", "SQLAlchemy"],
  },
  {
    slug: "signup-forensics",
    title: "Why sign-ups were failing",
    summary: "Turned a vague 'users get stuck' report into per-platform root causes, then shipped the production fix.",
    context: "AI travel platform · confidential",
    problem:
      "The founder reported users stuck on white pages and redirect loops when signing up with Google or Apple. Nobody knew how many, or on which platform.",
    approach: [
      "Pulled the telemetry first: 98% of sign-ups were mobile, and Android users never got in 36% of the time against 18% on iOS — some looped 43 times.",
      "Ruled out the deep-link SDK everyone suspected, and reproduced the real web cause: a hidden captcha that never settled inside the OAuth callback.",
      "Shipped a watchdog and failure screen on the callback, onboarding retries, and an in-app-browser escape hatch.",
    ],
    results: [
      { value: "98%", label: "of sign-ups found to be mobile" },
      { value: "36% vs 18%", label: "Android vs iOS failure rate isolated" },
      { value: "43", label: "redirect loops for the worst-hit user" },
    ],
    stack: ["React", "Clerk OAuth", "PostHog", "Sentry", "Expo"],
  },
  {
    slug: "performance",
    title: "Making the slow parts fast",
    summary: "Cut the hotels bundle by 18%, flight filters from 300 ms to 20 ms, and autocomplete from 8 queries a keystroke to 1.",
    context: "AI travel platform · confidential",
    problem:
      "Flight filters froze the page for a third of a second per click, the hotels route had blown its bundle budget and turned CI red, and every autocomplete keystroke fired eight database queries.",
    approach: [
      "Profiled flight filter and sort clicks and removed the long tasks behind them.",
      "Lazy-loaded the hotel map and lowered the bundle budget so it can't creep back.",
      "Rewrote destination lookup to one indexed query and batched the lookups, checked against all 326 existing cases.",
    ],
    results: [
      { value: "250 → 204 KB", label: "hotels route, gzipped" },
      { value: "~300 → ~20 ms", label: "flight filter click" },
      { value: "8 → 1", label: "queries per keystroke" },
    ],
    stack: ["React 19", "Vite", "Postgres indexes", "Chrome DevTools"],
  },
  {
    slug: "memory-dom",
    title: "Out of memory, on the phone and the server",
    summary: "Stopped the Android app and the bookings API running out of memory for heavy users by rendering and returning only what's needed.",
    context: "AI travel platform · confidential",
    problem:
      "Heavy users crashed the Android app on the Bookings tab, and the same account's bookings request pushed the API server to 625 MB. One response weighed about 443 MB because a profile photo was copied into every booking.",
    approach: [
      "Switched the bookings list to a windowed FlatList so only rows near the screen exist as native views.",
      "Bounded the bookings endpoint with server-side buckets and limits, and stopped embedding inline images in booking payloads.",
      "Cut what the UI mounts elsewhere too: the hotel page renders five room types with Show more, and the photo carousel animates at most two slides.",
    ],
    results: [
      { value: "6,390 → 2,095", label: "native views on the Bookings tab" },
      { value: "121 → 68 MB", label: "peak Java heap, no longer climbing" },
      { value: "54 → 35 MB", label: "peak memory serving a 1,365-booking account" },
    ],
    stack: ["React Native", "FlatList", "FastAPI", "Python tracemalloc", "React"],
  },
  {
    slug: "data-security",
    title: "Customer data, locked at the database",
    summary: "Enforced Postgres row-level security on 20 customer tables and closed an edge-cache leak serving private PDFs.",
    context: "AI travel platform · confidential",
    problem:
      "Customer isolation lived only in application code — one missing WHERE clause from a leak. Separately, the CDN was caching one user's booking PDF and serving it to anyone.",
    approach: [
      "Wrote 28 forced RLS policies with session-scoped user context and shipped them to production.",
      "Replaced 11 ad-hoc rate limiters with one tiered limiter and capped request bodies.",
      "Traced the PDF leak to the edge cache and closed it.",
    ],
    results: [
      { value: "20", label: "tables under forced RLS" },
      { value: "28", label: "policies in production" },
      { value: "11 → 1", label: "rate limiters consolidated" },
    ],
    stack: ["Postgres RLS", "FastAPI", "Cloudflare", "Redis"],
  },
  {
    slug: "ci-rescue",
    title: "Un-breaking CI for the whole team",
    summary: "Took a test gate that had failed 158 runs in a row back to green, and stopped CI burning 1,340 minutes a day.",
    context: "AI travel platform · confidential",
    problem:
      "The backend unit gate had failed on every run that month, so nobody trusted it, and the org kept running out of GitHub Actions minutes.",
    approach: [
      "Audited 8,689 Actions minutes and found dev-branch re-runs alone used 23% of the org's budget.",
      "Fixed 111 of 113 stale tests grouped by root cause, and quarantined the 2 that pointed to a real bug for its owner.",
      "Cached dependencies and cut redundant runs.",
    ],
    results: [
      { value: "15,326", label: "tests passing" },
      { value: "12.3 → 7.0 min", label: "backend test job" },
      { value: "~1,340 min", label: "Actions minutes saved per day" },
    ],
    stack: ["GitHub Actions", "pytest", "Vitest"],
  },
];

/**
 * Case studies from public employers. Sourced from career-ops cv.md and
 * article-digest.md (verified 2026-10-30) — no metric beyond what's there.
 * `context` names the employer, unlike the confidential set above.
 */
export const roleCaseStudies: CaseStudy[] = [
  {
    slug: "trestle-portal",
    title: "A developer portal that sells itself",
    summary: "Redesigned the developer portal's evaluation flow and drove a 2–3× lift in self-serve revenue.",
    context: "Trestle · Developer portal",
    problem:
      "Developers arrived to evaluate the API and left before paying. The self-serve funnel leaked at the evaluation step, and the wallet UI left people unsure of their balance.",
    approach: [
      "Rebuilt the portal homepage around the API evaluation flow so a visitor reaches a working call with less friction.",
      "Rebuilt the wallet UI with simpler transaction flows and clear balance states.",
      "Moved auth tokens out of localStorage into HTTP-only cookies in the Java backend, closing an XSS exposure — in a language outside my main stack.",
    ],
    results: [
      { value: "2–3×", label: "self-serve revenue" },
      { value: "HTTP-only", label: "cookies replace localStorage tokens" },
      { value: "Day one", label: "owned complex features end to end" },
    ],
    stack: ["Next.js", "React", "TypeScript", "Java"],
  },
  {
    slug: "trestle-memory",
    title: "Making a heavy admin portal light",
    summary: "Led a 13-month memory effort on the developer portal: DOM nodes down 46–56% on every audited page, and one leak cut by 97%.",
    context: "Trestle · Developer portal",
    problem:
      "The portal's admin pages got heavier the longer people used them. Paging through users left closed drawers alive in memory, and the usage table mounted all 450 rows at once.",
    approach: [
      "Built a heap-snapshot harness and traced the retained memory to closed MUI drawers that stayed mounted; drawers now unmount after their exit transition.",
      "Windowed the usage table in about 60 lines instead of adding a library, so only the rows on screen exist.",
      "Added timer-cleanup hooks, Chart.js teardown and memoized rows, then CI budgets for bundle size, memory and Lighthouse so it can't creep back. Measured with forced-GC snapshots in the lab.",
    ],
    results: [
      { value: "+13.3 → +0.4 MB", label: "memory kept per cycle on the admin Users page" },
      { value: "13,200 → 1,220", label: "DOM nodes on the same page" },
      { value: "450 → 19", label: "table rows mounted at once" },
    ],
    stack: ["React", "MUI", "Redux", "Chart.js", "Chrome DevTools", "Jenkins"],
  },
  {
    slug: "zania-soc2",
    title: "Compliance features that closed a deal",
    summary: "Built SOC 2 Type II features inside an AI compliance agent that helped close a new enterprise client.",
    context: "Zania · AI compliance platform",
    problem:
      "Enterprise buyers of an AI compliance agent expect SOC 2 Type II workflows built into the product, not bolted on.",
    approach: [
      "Implemented the SOC 2 Type II features in the agent's React front end.",
      "Worked across US time zones with product and backend to ship them reliably.",
      "Cut production bugs along the way to raise trust in the platform.",
    ],
    results: [
      { value: "SOC 2 Type II", label: "features shipped in the AI agent" },
      { value: "1", label: "new enterprise client closed" },
    ],
    stack: ["React", "TypeScript", "AI agents"],
  },
  {
    slug: "factwise-bom",
    title: "A Bill of Materials that scales",
    summary: "Owned the BOM module end to end — recursive trees of hundreds of items — and helped win a $100K ARR client.",
    context: "FactWise · Procurement SaaS",
    problem:
      "The Bill of Materials view slowed down as trees grew past a hundred nested items — exactly the scale an enterprise prospect worked at.",
    approach: [
      "Designed recursive BOM structures for deeply nested items.",
      "Gave every node its own Redux selector so editing one item re-renders only that item, not the tree.",
      "Mentored two to three engineers on the architecture so they could ship modules on their own.",
    ],
    results: [
      { value: "$100K", label: "ARR enterprise client won" },
      { value: "100s", label: "of nested items per tree" },
      { value: "1 node", label: "re-renders per edit" },
    ],
    stack: ["React", "Redux", "TypeScript"],
  },
  {
    slug: "wowrooms-search",
    title: "Hotel search that held at peak",
    summary: "Built the hotel search API in Go and kept it up through festival-season traffic spikes.",
    context: "Wow Rooms · Hotel booking",
    problem:
      "Festival peak hours brought traffic spikes to hotel search, the core of the booking platform.",
    approach: [
      "Built the search API in Go as the platform's core search layer.",
      "Led the vendor app's front end and built Node.js and Prisma services behind it.",
      "Shipped an internal booking system end to end on AWS with Docker.",
    ],
    results: [
      { value: "Go", label: "search API, core of the platform" },
      { value: "Peak", label: "festival traffic held without degradation" },
    ],
    stack: ["Go", "Node.js", "Next.js", "Prisma", "AWS"],
  },
];

/**
 * How the way I build has changed. The user's own account (2026-10-30),
 * anchored to sourced examples: the FactWise BOM module (hand-typed, weeks)
 * and Stripe promo codes on 7 checkout flows (dossier: 2 days).
 */
export const workflow = {
  title: "I keep rebuilding how I build",
  intro:
    "The tools change every few months. I change with them, because the goal isn't the editor — it's how much good work reaches production.",
  stages: [
    {
      era: "Then",
      setup: "VS Code, scripts, AI autocomplete",
      body: "I typed the code. A module like the FactWise Bill of Materials took weeks of focused work.",
      example: "BOM module · weeks",
    },
    {
      era: "Next",
      setup: "Claude Code agents in tmux",
      body: "Several Claude Code sessions in tmux panes and windows, each on its own thread of work, while I review and steer.",
      example: "Parallel work threads",
    },
    {
      era: "Now",
      setup: "T3 Code orchestration",
      body: "Agents run in isolated worktrees with multi-model review, and I own the design, review, merge and release. Complex changes land in one to two days.",
      example: "Promo codes on 7 checkout flows · 2 days",
    },
  ],
} as const;

/**
 * Standout "AI Wrapped" (standout.work), scored 2026-10-30 from Claude Code /
 * Codex history. Source: the card image in public/standout-wrapped.png.
 * Retail token cost is intentionally omitted.
 */
export const standout = {
  score: "97",
  outOf: "100",
  rank: "Top 3% of 5,456 developers",
  tier: "Unicorn",
  style: "AI-Native Engineer",
  bars: [
    { label: "Intensity", value: 92 },
    { label: "Consistency", value: 96 },
  ],
  stats: [
    { value: "2.6", label: "parallel agents on average" },
    { value: "4,364", label: "agent sessions" },
    { value: "11B", label: "tokens in the last 30 days" },
    { value: "02:00", label: "peak hour in India — mid-afternoon in the US" },
  ],
  card: "/standout-wrapped.png",
  href: "https://standout.work",
  command: "npx standout",
} as const;

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  metric: string;
  summary: string;
  /** Fuller account for the experience section. Sourced from career-ops cv.md. */
  highlights: string[];
  stack: string[];
}

/** Public employment history. The confidential platform is intentionally absent. */
export const roles: Role[] = [
  {
    company: "Trestle",
    title: "Full-Stack Engineer, Developer Portal",
    period: "2025 — now",
    location: "Remote · US",
    metric: "2–3× self-serve revenue",
    summary:
      "Redesigned the developer portal's evaluation flow and rebuilt the wallet UI. Moved auth tokens from localStorage to HTTP-only cookies in the Java backend.",
    highlights: [
      "Redesigned the developer portal homepage around the API evaluation flow, driving a 2–3× increase in self-serve revenue.",
      "Rebuilt the wallet UI with simpler transaction flows and clear balance states, cutting user confusion and support load.",
      "Led a 13-month, ~90-ticket memory effort on the portal: DOM nodes down 46–56% on every audited page, an admin-page leak cut 97% (+13.3 → +0.4 MB per cycle), and a windowed usage table (450 → 19 mounted rows, heap −53%).",
      "Owned complex features from day one — diagnosis, design and production — without hand-holding.",
      "Moved auth tokens from localStorage to HTTP-only cookies in the Java backend, closing an XSS exposure; ramped on Java with AI tooling.",
    ],
    stack: ["Next.js", "React", "TypeScript", "MUI", "Java"],
  },
  {
    company: "Zania",
    title: "Software Engineer, Frontend",
    period: "2024 — 2025",
    location: "Remote · San Francisco",
    metric: "Enterprise client closed",
    summary: "Built SOC 2 Type II features inside an AI compliance agent that helped close a new enterprise customer.",
    highlights: [
      "Implemented SOC 2 Type II compliance features inside an AI compliance agent, contributing directly to closing a new enterprise client.",
      "Worked with US product and engineering teams across time zones on an AI-driven platform.",
      "Reduced production bugs, raising the platform's reliability and user trust.",
    ],
    stack: ["React", "TypeScript", "AI agents"],
  },
  {
    company: "FactWise",
    title: "Frontend Engineer",
    period: "2023 — 2024",
    location: "Remote · India",
    metric: "$100K ARR client won",
    summary:
      "Owned the Bill of Materials module: recursive trees of hundreds of items, with per-node Redux selectors so one edit never re-renders the tree. Mentored junior engineers.",
    highlights: [
      "Owned the Bill of Materials module end to end, helping secure a $100K ARR enterprise client.",
      "Designed recursive BOM trees of hundreds of nested items, with per-node Redux selectors so one edit never re-renders the tree.",
      "Built data-heavy dashboards for real-time bid analysis, pricing trends and purchase decisions inside a large legacy codebase, without performance regressions.",
      "Mentored two to three junior engineers on architecture and code review until they shipped modules on their own.",
    ],
    stack: ["React", "Redux", "TypeScript"],
  },
  {
    company: "Wow Rooms",
    title: "Software Engineer I",
    period: "2022 — 2023",
    location: "Mumbai",
    metric: "Held festival peak traffic",
    summary: "Built the hotel search API in Go and the vendor booking app; shipped an internal booking system end to end on AWS.",
    highlights: [
      "Built a high-performance hotel search API in Go — the platform's core search layer — that held festival peak traffic without degradation.",
      "Led the front end of the vendor mobile app (bookings, inventory, real-time availability) and built its Node.js / Express services on Prisma.",
      "Built an internal booking management app end to end in Next.js, Express and Prisma, deployed on AWS with Docker.",
      "Designed vendor-to-operations workflows that reduced booking conflicts and made fulfilment more reliable.",
    ],
    stack: ["Go", "Node.js", "Next.js", "Prisma"],
  },
];

export interface OpenWork {
  name: string;
  kind: string;
  summary: string;
  detail: string;
  href: string;
}

export const openWork: OpenWork[] = [
  {
    name: "termbridge",
    kind: "Open source · MCP",
    summary: "A terminal an AI agent and a human can drive at the same time.",
    detail:
      "MCP server over tmux with write-lock arbitration — grab the keyboard and the agent pauses, let go and it resumes. Five-package Bun monorepo, 600+ tests, core package on npm.",
    href: "https://github.com/shivang2000/termbridge",
  },
  {
    name: "Alertforge",
    kind: "Open source · AI devtool",
    summary: "Sentry alert in, reviewed draft PR out.",
    detail:
      "Self-hosted pipeline: alert → Claude triage → Claude Code fix in an isolated worktree → draft PR with a second-pass review. Never auto-merges.",
    href: "https://github.com/shivang2000/sentry-fixer-bot",
  },
  {
    name: "Archestra",
    kind: "Merged contribution",
    summary: "Copy buttons for code blocks in an MCP gateway's chat artifacts.",
    detail:
      "PR #3868: reused the codebase's existing CodeBlock pair through a ReactMarkdown pre override, with tests for single, inline and multiple blocks. +102 / −1.",
    href: "https://github.com/archestra-ai/archestra/pull/3868",
  },
];

/** Grouped by how often used, not by category. */
export const stack = [
  { label: "Every day", items: ["TypeScript", "React 19", "Next.js", "React Native / Expo", "Tailwind", "Python", "FastAPI", "Postgres"] },
  { label: "Production", items: ["Stripe", "Redis", "Terraform", "AWS", "Cloudflare", "Docker", "GitHub Actions"] },
  { label: "Observability", items: ["Sentry", "PostHog", "k6 load tests"] },
  { label: "AI", items: ["Claude Code", "MCP", "LangGraph", "Multi-agent review"] },
] as const;

export const howIWork = [
  {
    title: "Own it to production",
    body: "I don't hand off at the PR. I release, watch the dashboards, and fix what breaks.",
  },
  {
    title: "Data before opinions",
    body: "Telemetry first, then the hypothesis. Most 'obvious' causes I've chased turned out to be red herrings.",
  },
  {
    title: "AI-native, human-accountable",
    body: "I run parallel coding agents with multi-model review. The design, the review and the merge are mine.",
  },
] as const;
