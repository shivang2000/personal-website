import type { AppRouter } from "@personal-website/api/routers/index";

import { env } from "@personal-website/env/web";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: query.invalidate,
        },
      });
    },
  }),
});

function getTrpcUrl() {
  // Server-side in Vercel functions: call the gateway privately via its service binding.
  // GATEWAY_URL is injected at runtime only (not during builds or in middleware).
  if (typeof window === "undefined" && process.env.GATEWAY_URL) {
    return new URL("/api/trpc", process.env.GATEWAY_URL).toString();
  }
  // Browser: same-origin by default, since Vercel routes /api/* to the gateway service.
  return `${env.NEXT_PUBLIC_SERVER_URL ?? ""}/api/trpc`;
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
