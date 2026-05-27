import { GraphQLScalarType } from "graphql";
import { builder } from "./builder";
import "./auth";
import "./post";
import "./storage";
import "./system";

if (!builder.configStore.hasConfig("Upload")) {
  const Upload = new GraphQLScalarType({
    name: "Upload",
  });
  builder.addScalarType("Upload", Upload, {});
}

export const schema = builder.toSchema({ sortSchema: false });
