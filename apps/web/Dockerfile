# ═══════════════════════════════════════════════════════════════
# Multi-stage Dockerfile for Next.js with Bun
# Optimized for monorepo with catalog dependencies
# ═══════════════════════════════════════════════════════════════

# Stage 1: Install dependencies
FROM oven/bun:1.3.5 AS deps
WORKDIR /app

# Copy entire monorepo for workspace resolution
# .dockerignore excludes node_modules, .next, etc.
COPY . .

# Install all dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build the app
FROM oven/bun:1.3.5 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the Next.js app
WORKDIR /app/apps/web
RUN bun run build

# Stage 3: Production runner
FROM oven/bun:1.3.5-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy standalone build output (maintains monorepo structure)
COPY --from=builder /app/apps/web/.next/standalone ./

# Copy static assets to where server.js expects them (apps/web/)
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Set proper ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Server.js is in apps/web due to monorepo structure
WORKDIR /app/apps/web
CMD ["bun", "server.js"]
