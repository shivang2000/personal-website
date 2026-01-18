# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for the target microservices architecture (NestJS gateway + gRPC services).

## Development Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (individual apps)
bun run dev:web      # Web at http://localhost:3001
bun run dev:gateway  # NestJS gateway at http://localhost:3000

# Build
bun run build

# Type checking
bun run check-types

# Linting & Formatting (Oxlint + Oxfmt)
bun run check

# Database (PostgreSQL + Drizzle)
bun run db:start     # Start PostgreSQL container
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio UI
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:stop      # Stop PostgreSQL container
```

## Architecture

### Monorepo Structure (Turborepo + Bun workspaces)

**Apps:**

- `apps/web` - Next.js 16 frontend (React 19, port 3001)
- `apps/gateway` - NestJS gateway (port 3000, transitioning to gRPC)

**Packages:**

- `packages/api` - tRPC router definitions and business logic
- `packages/db` - Drizzle ORM schema and database client
- `packages/env` - Type-safe environment variables (T3 Env + Zod)
- `packages/config` - Shared TypeScript configuration

### Type-Safe API Layer (tRPC)

The API uses end-to-end type safety through tRPC:

1. Define procedures in `packages/api/src/routers/index.ts`
2. The `AppRouter` type is exported and used by the web client
3. Web client in `apps/web/src/utils/trpc.ts` imports `AppRouter` for type inference
4. API calls via `trpc.procedureName.useQuery()` or `trpc.procedureName.useMutation()`

### Environment Variables

Server (`packages/env/src/server.ts`):

- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Must be valid URL
- `NODE_ENV` - development/production/test

Web (`packages/env/src/web.ts`):

- `NEXT_PUBLIC_SERVER_URL` - Server API URL

### UI Stack

- TailwindCSS 4 for styling
- shadcn/ui components in `apps/web/src/components/ui/`
- Use `cn()` utility from `apps/web/src/lib/utils.ts` for conditional classes
- Biome enforces sorted Tailwind classes via `useSortedClasses` rule

## Code Style

- Formatter: Biome with tabs, double quotes for JS/TS
- Linting: Oxlint (runs via `bun run check`)
- Import alias: `@/*` maps to `apps/web/src/*`
- Strict TypeScript: `noUncheckedIndexedAccess`, `verbatimModuleSyntax`
- React Query for server state management

## Gateway Testing (NestJS)

```bash
# Run all tests
cd apps/gateway && bun test

# Run specific test file
cd apps/gateway && bun test app.controller

# Run tests with coverage
cd apps/gateway && bun test:cov

# Run e2e tests
cd apps/gateway && bun test:e2e
```
