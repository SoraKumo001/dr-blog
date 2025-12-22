import process from "node:process";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { getContext } from "hono/context-storage";
import { format } from "sql-formatter";
import type { Hyperdrive } from "@cloudflare/workers-types/experimental";
import type { serialize } from "cookie";
import type { user } from "~/db/schema";
import { relations } from "~/db/relations";
export type Context = {
  req: Request;
  db: NodePgDatabase<typeof relations, typeof relations>;
  user?: typeof user.$inferSelect;
  cookies: { [key: string]: string };
  setCookie: typeof serialize;
  env: { [key: string]: string };
};

type Env = {
  Variables: {
    db: NodePgDatabase;
  };
  Bindings: {
    database: Hyperdrive;
  };
};

// Create a proxy that returns a Drizzle instance on SessionContext with the variable name db
export const db: NodePgDatabase<typeof relations, typeof relations> = new Proxy<
  NodePgDatabase<typeof relations, typeof relations>
>({} as never, {
  get(_target: unknown, props: keyof NodePgDatabase) {
    const context = getContext<Env>();
    if (!context.get("db")) {
      const connectionString = context.env.database.connectionString;
      if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
      }
      const url = new URL(process.env.DATABASE_URL);
      const searchPath = url.searchParams.get("schema") ?? "public";
      const db = drizzle({
        connection: {
          connectionString,
          options: `--search_path=${searchPath}`,
        },
        relations,
        logger: {
          logQuery: (query, params) => {
            console.info(
              "===========================\n",
              format(query, { language: "postgresql" }),
              "\n--\n",
              params
            );
          },
        },
      });
      context.set("db", db);
    }
    return context.get("db")[props];
  },
});
