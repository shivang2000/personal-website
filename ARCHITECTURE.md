# Architecture Plan

This document outlines the target microservices architecture for the personal website project.

## Overview

A hybrid architecture using:
- **tRPC** for frontend-to-gateway communication (type-safe DX)
- **gRPC** for inter-service communication (high performance, binary protocol)
- **NestJS** as the framework for gateway and all microservices

```
┌─────────────┐      tRPC/HTTP       ┌─────────────────┐
│   Next.js   │ ◄──────────────────► │  NestJS Gateway │
│   Frontend  │   (type-safe DX)     │   (tRPC API)    │
└─────────────┘                      └────────┬────────┘
                                              │
                                              │ gRPC (protobuf)
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
            ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
            │ Blogs Service│ ◄─gRPC─►│ Docs Service │ ◄─gRPC─►│ Core Service │
            │   (NestJS)   │         │   (NestJS)   │         │   (NestJS)   │
            └──────────────┘         └──────────────┘         └──────────────┘
                    │                         │                         │
                    ▼                         ▼                         ▼
               [Postgres]              [Postgres]                [Postgres]
```

## Why This Architecture

| Layer | Protocol | Reasoning |
|-------|----------|-----------|
| Frontend ↔ Gateway | tRPC | Type inference in React, React Query integration, excellent DX |
| Gateway ↔ Services | gRPC | Binary protocol (~10x faster than JSON), HTTP/2 multiplexing |
| Service ↔ Service | gRPC | Low latency, streaming support, language-agnostic |

## Monorepo Structure

```
personal-website/
├── apps/
│   ├── web/                     # Next.js frontend (tRPC client)
│   ├── gateway/                 # NestJS gateway (tRPC server + gRPC clients)
│   ├── blogs-service/           # NestJS microservice (gRPC server)
│   ├── docs-service/            # NestJS microservice (gRPC server)
│   └── core-service/            # NestJS microservice (gRPC server)
│
├── packages/
│   ├── proto/                   # Shared protobuf definitions
│   │   ├── blogs.proto
│   │   ├── docs.proto
│   │   └── core.proto
│   │
│   ├── grpc-types/              # Generated TypeScript types from proto
│   │   └── generated/
│   │
│   ├── api-gateway/             # tRPC router definitions (AppRouter type)
│   │   └── src/
│   │       ├── routers/
│   │       │   ├── blogs.ts
│   │       │   ├── docs.ts
│   │       │   └── core.ts
│   │       └── index.ts
│   │
│   ├── db-blogs/                # Drizzle schema for blogs service
│   ├── db-docs/                 # Drizzle schema for docs service
│   ├── db-core/                 # Drizzle schema for core service
│   │
│   ├── env/                     # Environment validation (existing)
│   └── config/                  # Shared TypeScript config (existing)
│
├── docker-compose.yml           # Local development orchestration
├── turbo.json
└── package.json
```

## Service Responsibilities

### Gateway (`apps/gateway`)
- Exposes tRPC API to frontend
- Authenticates requests (JWT validation)
- Routes requests to appropriate microservices via gRPC
- Aggregates responses from multiple services
- Rate limiting and request validation

### Blogs Service (`apps/blogs-service`)
- Blog post CRUD operations
- Categories and tags management
- Search and filtering
- Draft/publish workflow

### Docs Service (`apps/docs-service`)
- Documentation pages management
- Version management
- MDX/Markdown processing
- Navigation structure

### Core Service (`apps/core-service`)
- Homepage content
- Site configuration
- Contact form handling
- Analytics events

---

## Implementation Details

### 1. Protobuf Definitions

```protobuf
// packages/proto/blogs.proto
syntax = "proto3";

package blogs;

service BlogsService {
  rpc GetPosts (GetPostsRequest) returns (GetPostsResponse);
  rpc GetPost (GetPostRequest) returns (Post);
  rpc CreatePost (CreatePostRequest) returns (Post);
  rpc UpdatePost (UpdatePostRequest) returns (Post);
  rpc DeletePost (DeletePostRequest) returns (Empty);
}

message Post {
  string id = 1;
  string title = 2;
  string slug = 3;
  string content = 4;
  string excerpt = 5;
  PostStatus status = 6;
  repeated string tags = 7;
  int64 created_at = 8;
  int64 updated_at = 9;
}

enum PostStatus {
  DRAFT = 0;
  PUBLISHED = 1;
  ARCHIVED = 2;
}

message GetPostsRequest {
  int32 limit = 1;
  int32 offset = 2;
  PostStatus status = 3;
}

message GetPostsResponse {
  repeated Post posts = 1;
  int32 total = 2;
}

message GetPostRequest {
  string id = 1;
}

message CreatePostRequest {
  string title = 1;
  string content = 2;
  string excerpt = 3;
  repeated string tags = 4;
}

message UpdatePostRequest {
  string id = 1;
  optional string title = 2;
  optional string content = 3;
  optional string excerpt = 4;
  optional PostStatus status = 5;
  repeated string tags = 6;
}

message DeletePostRequest {
  string id = 1;
}

message Empty {}
```

### 2. NestJS Microservice (gRPC Server)

```typescript
// apps/blogs-service/src/main.ts
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { BlogsModule } from "./blogs.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlogsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "blogs",
        protoPath: join(__dirname, "../../../packages/proto/blogs.proto"),
        url: "0.0.0.0:5001",
      },
    },
  );
  await app.listen();
  console.log("Blogs microservice running on grpc://0.0.0.0:5001");
}
bootstrap();
```

```typescript
// apps/blogs-service/src/blogs.controller.ts
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { BlogsService } from "./blogs.service";
import type {
  GetPostsRequest,
  GetPostRequest,
  CreatePostRequest,
} from "@personal-website/grpc-types";

@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @GrpcMethod("BlogsService", "GetPosts")
  async getPosts(request: GetPostsRequest) {
    return this.blogsService.findAll(request);
  }

  @GrpcMethod("BlogsService", "GetPost")
  async getPost(request: GetPostRequest) {
    return this.blogsService.findOne(request.id);
  }

  @GrpcMethod("BlogsService", "CreatePost")
  async createPost(request: CreatePostRequest) {
    return this.blogsService.create(request);
  }
}
```

### 3. Gateway (tRPC + gRPC Client)

```typescript
// apps/gateway/src/grpc/blogs.client.ts
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom, Observable } from "rxjs";
import type {
  BlogsServiceClient,
  GetPostsRequest,
  GetPostsResponse,
  Post,
} from "@personal-website/grpc-types";

@Injectable()
export class BlogsGrpcClient implements OnModuleInit {
  private blogsService: BlogsServiceClient;

  constructor(@Inject("BLOGS_PACKAGE") private client: ClientGrpc) {}

  onModuleInit() {
    this.blogsService =
      this.client.getService<BlogsServiceClient>("BlogsService");
  }

  async getPosts(request: GetPostsRequest): Promise<GetPostsResponse> {
    return firstValueFrom(this.blogsService.getPosts(request));
  }

  async getPost(id: string): Promise<Post> {
    return firstValueFrom(this.blogsService.getPost({ id }));
  }
}
```

```typescript
// apps/gateway/src/grpc/grpc.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { BlogsGrpcClient } from "./blogs.client";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "BLOGS_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "blogs",
          protoPath: join(__dirname, "../../../../packages/proto/blogs.proto"),
          url: "localhost:5001",
        },
      },
      {
        name: "DOCS_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "docs",
          protoPath: join(__dirname, "../../../../packages/proto/docs.proto"),
          url: "localhost:5002",
        },
      },
      {
        name: "CORE_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "core",
          protoPath: join(__dirname, "../../../../packages/proto/core.proto"),
          url: "localhost:5003",
        },
      },
    ]),
  ],
  providers: [BlogsGrpcClient],
  exports: [BlogsGrpcClient],
})
export class GrpcModule {}
```

### 4. tRPC Router in Gateway

```typescript
// packages/api-gateway/src/routers/blogs.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import type { BlogsGrpcClient } from "@personal-website/gateway/grpc";

export const createBlogsRouter = (blogsClient: BlogsGrpcClient) =>
  router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(10),
          offset: z.number().min(0).default(0),
        }),
      )
      .query(async ({ input }) => {
        const response = await blogsClient.getPosts({
          limit: input.limit,
          offset: input.offset,
        });
        return {
          posts: response.posts,
          total: response.total,
        };
      }),

    get: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        return blogsClient.getPost(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(200),
          content: z.string().min(1),
          excerpt: z.string().max(500).optional(),
          tags: z.array(z.string()).default([]),
        }),
      )
      .mutation(async ({ input }) => {
        return blogsClient.createPost(input);
      }),
  });
```

```typescript
// packages/api-gateway/src/index.ts
import { router } from "./trpc";
import { createBlogsRouter } from "./routers/blogs";
import { createDocsRouter } from "./routers/docs";
import { createCoreRouter } from "./routers/core";

export const createAppRouter = (clients: GrpcClients) =>
  router({
    blogs: createBlogsRouter(clients.blogs),
    docs: createDocsRouter(clients.docs),
    core: createCoreRouter(clients.core),
  });

export type AppRouter = ReturnType<typeof createAppRouter>;
```

### 5. Gateway Main Entry

```typescript
// apps/gateway/src/main.ts
import { NestFactory } from "@nestjs/core";
import * as trpcExpress from "@trpc/server/adapters/express";
import { AppModule } from "./app.module";
import { createAppRouter } from "@personal-website/api-gateway";
import { BlogsGrpcClient } from "./grpc/blogs.client";
import { DocsGrpcClient } from "./grpc/docs.client";
import { CoreGrpcClient } from "./grpc/core.client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get gRPC clients from NestJS DI container
  const blogsClient = app.get(BlogsGrpcClient);
  const docsClient = app.get(DocsGrpcClient);
  const coreClient = app.get(CoreGrpcClient);

  // Create tRPC router with injected gRPC clients
  const appRouter = createAppRouter({
    blogs: blogsClient,
    docs: docsClient,
    core: coreClient,
  });

  // Mount tRPC middleware
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }) => ({ req }),
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  await app.listen(3000);
  console.log("Gateway running on http://localhost:3000");
}
bootstrap();
```

---

## Proto Compilation

Add script to generate TypeScript types from proto files:

```json
// package.json (root)
{
  "scripts": {
    "proto:generate": "turbo run proto:generate",
    "proto:generate:blogs": "protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./packages/grpc-types/generated --ts_proto_opt=nestJs=true,outputServices=grpc-js packages/proto/blogs.proto"
  }
}
```

---

## Environment Variables

### Gateway
```env
PORT=3000
CORS_ORIGIN=http://localhost:3001
BLOGS_SERVICE_URL=localhost:5001
DOCS_SERVICE_URL=localhost:5002
CORE_SERVICE_URL=localhost:5003
JWT_SECRET=your-secret-key
```

### Blogs Service
```env
PORT=5001
DATABASE_URL=postgresql://user:pass@localhost:5432/blogs_db
```

### Docs Service
```env
PORT=5002
DATABASE_URL=postgresql://user:pass@localhost:5432/docs_db
```

### Core Service
```env
PORT=5003
DATABASE_URL=postgresql://user:pass@localhost:5432/core_db
```

---

## Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: "3.8"

services:
  gateway:
    build:
      context: .
      dockerfile: apps/gateway/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - BLOGS_SERVICE_URL=blogs-service:5001
      - DOCS_SERVICE_URL=docs-service:5002
      - CORE_SERVICE_URL=core-service:5003
    depends_on:
      - blogs-service
      - docs-service
      - core-service

  blogs-service:
    build:
      context: .
      dockerfile: apps/blogs-service/Dockerfile
    ports:
      - "5001:5001"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@blogs-db:5432/blogs
    depends_on:
      - blogs-db

  docs-service:
    build:
      context: .
      dockerfile: apps/docs-service/Dockerfile
    ports:
      - "5002:5002"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@docs-db:5432/docs
    depends_on:
      - docs-db

  core-service:
    build:
      context: .
      dockerfile: apps/core-service/Dockerfile
    ports:
      - "5003:5003"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@core-db:5432/core
    depends_on:
      - core-db

  blogs-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: blogs
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - blogs-data:/var/lib/postgresql/data

  docs-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: docs
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - docs-data:/var/lib/postgresql/data

  core-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: core
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - core-data:/var/lib/postgresql/data

volumes:
  blogs-data:
  docs-data:
  core-data:
```

---

## Dependencies to Add

```bash
# Gateway
bun add @nestjs/core @nestjs/common @nestjs/microservices
bun add @grpc/grpc-js @grpc/proto-loader
bun add @trpc/server rxjs

# Microservices
bun add @nestjs/core @nestjs/common @nestjs/microservices
bun add @grpc/grpc-js @grpc/proto-loader

# Proto compilation (dev)
bun add -D ts-proto protobufjs
```

---

## Migration Path

### Phase 1: Gateway Setup
1. Create `apps/gateway` with NestJS
2. Move existing tRPC router to gateway
3. Keep current Express server as `core-service` temporarily
4. Verify frontend still works

### Phase 2: Extract First Microservice
1. Create `apps/blogs-service` with gRPC
2. Define `blogs.proto`
3. Add gRPC client to gateway
4. Update tRPC router to proxy to blogs service

### Phase 3: Complete Extraction
1. Create `apps/docs-service`
2. Create `apps/core-service`
3. Remove old Express server
4. Set up Docker Compose for local dev

### Phase 4: Production Readiness
1. Add health checks to all services
2. Implement distributed tracing (OpenTelemetry)
3. Add service mesh or load balancer configuration
4. Set up CI/CD pipelines per service

---

## Trade-offs

| Aspect | Benefit | Cost |
|--------|---------|------|
| Type safety | Proto → TS codegen keeps types in sync | Extra build step for proto compilation |
| Performance | gRPC is significantly faster than HTTP/JSON | Harder to debug (binary protocol) |
| Scalability | Services scale independently | More infrastructure to manage |
| Flexibility | Services can use different languages | Team needs to learn gRPC |
| Frontend DX | tRPC unchanged, excellent inference | Gateway becomes translation layer |
| Local dev | Docker Compose orchestrates everything | Higher resource usage |
