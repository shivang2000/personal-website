import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    // Optional: only needed when the gateway runs on a different origin (e.g. `bun run dev:web`).
    NEXT_PUBLIC_SERVER_URL: z.url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
});
