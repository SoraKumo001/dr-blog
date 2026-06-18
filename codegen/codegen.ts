import { resolvers } from "graphql-scalars";
import type { CodegenConfig } from "@graphql-codegen/cli";
import type { GraphQLScalarType } from "graphql";

const scalars = (resolvers: GraphQLScalarType[]) => {
  return Object.fromEntries(
    resolvers.map((v) => [v.name, v.extensions.codegenScalarType]),
  );
};

export const defineConfig: CodegenConfig = {
  schema: "codegen/schema.graphql",
  documents: ["codegen/*.graphql", "!codegen/schema.graphql"],
  overwrite: true,
  generates: {
    "app/generated/graphql.ts": {
      plugins: ["typescript-operations", "typescript-urql"],
      config: {
        scalars: scalars(Object.values(resolvers)),
      },
    },
  },
};

export default defineConfig;
