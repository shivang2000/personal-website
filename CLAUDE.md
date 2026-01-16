# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (individual apps)
bun run dev:web      # Web at http://localhost:3001
bun run dev:server   # Server at http://localhost:3000

# Build
bun run build

# Type checking
bun run check-types

# Linting & Formatting (Biome + Oxlint/Oxfmt)
bun run check

# Database (PostgreSQL + Drizzle)
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio UI
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
```

## Architecture

### Monorepo Structure (Turborepo + Bun workspaces)

**Apps:**
- `apps/web` - Next.js 16 frontend (React 19, port 3001)
- `apps/server` - Express 5 backend running on Bun (port 3000)

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
- Import alias: `@/*` maps to `apps/web/src/*`
- Strict TypeScript: `noUncheckedIndexedAccess`, `verbatimModuleSyntax`
- React Query for server state management
