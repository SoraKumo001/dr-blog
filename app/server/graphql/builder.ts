import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { getTableConfig } from "drizzle-orm/pg-core";
import PothosDrizzleGeneratorPlugin, {
  isOperation,
} from "pothos-drizzle-generator";
import { db, type Context } from "../db";
import { relations } from "~/db/relations";

/**
 * Create a new schema builder instance
 */

export type BuilderType = {
  DrizzleRelations: typeof relations;
  Scalars: {
    Upload: {
      Input: File;
      Output: File;
    };
  };
  Context: Context;
};

export const builder = new SchemaBuilder<BuilderType>({
  plugins: [DrizzlePlugin, PothosDrizzleGeneratorPlugin],
  drizzle: {
    client: () => db,
    relations,
    getTableConfig,
  },
  pothosDrizzleGenerator: {
    all: {
      executable: ({ operation, ctx }) => {
        if (isOperation("mutation", operation) && !ctx.user) {
          return false;
        }
        return true;
      },
    },
    models: {
      post: {
        where: ({ operation, ctx }) => {
          if (isOperation("query", operation)) {
            return {
              OR: [
                { authorId: { eq: ctx.user?.id } },
                { published: { eq: true } },
              ],
            };
          }
          return undefined;
        },
        inputFields: ({}) => {
          return { exclude: ["authorId"] };
        },
        inputData: ({ ctx }) => {
          return {
            authorId: ctx.user?.id,
          };
        },
      },
    },
  },
});
