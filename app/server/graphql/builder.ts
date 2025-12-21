import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { getTableConfig } from "drizzle-orm/pg-core";
import PothosDrizzleGeneratorPlugin, {
  isOperation,
  OperationMutation,
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
        // Prohibit write operations if the user is not authenticated
        if (isOperation(OperationMutation, operation) && !ctx.user?.id) {
          return false;
        }
        return true;
      },
    },
    models: {
      post: {
        inputData: ({ ctx }) => {
          return { authorId: ctx.user?.id };
        },
      },
    },
  },
});
