import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { createRequestHandler } from "react-router";
// @ts-ignore
import * as build from "../build/server/index.js";

const cache = await caches.open("app");

const app = new Hono();
app.use(contextStorage());

app.use(async (c) => {
  const isUser = c.req.header("cookie")?.includes("auth-token");
  if (!isUser) {
    const cachedResponse = await cache.match(c.req.raw);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  // @ts-ignore
  const handler = createRequestHandler(build, import.meta.env?.MODE);

  const next = (input: Request | string, init?: RequestInit) => {
    return handler(new Request(input, init), {
      cloudflare: { env: c.env },
    });
  };
  const context = {
    cloudflare: {
      env: c.env,
      ctx: c.executionCtx,
      next,
    },
  };

  const response = await handler(c.req.raw, context);

  if (!isUser && response.status === 200) {
    c.executionCtx.waitUntil(cache.put(c.req.raw, response.clone()));
  }

  return response;
});

export default app;
