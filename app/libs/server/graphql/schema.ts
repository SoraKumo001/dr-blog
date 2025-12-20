import { GraphQLScalarType } from "graphql";
import { builder } from "./builder";
import * as mutations from "./mutations";
import * as queries from "./queries";

builder.queryType({
  fields: (t) =>
    Object.fromEntries(
      Object.entries(queries).map(([name, query]) => [name, query(t)])
    ),
});
builder.mutationType({
  fields: (t) =>
    Object.fromEntries(
      Object.entries(mutations).map(([name, mutation]) => [name, mutation(t)])
    ),
});
const Upload = new GraphQLScalarType({
  name: "Upload",
});
builder.addScalarType("Upload", Upload, {});

export const schema = builder.toSchema({ sortSchema: false });
console.log("5");
