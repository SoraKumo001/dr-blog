/* eslint-disable @typescript-eslint/no-require-imports */
import { GraphQLScalarType } from "graphql";
import { builder } from "./builder";

require("./queries");
require("./mutations");

if (!builder.configStore.hasConfig("Upload")) {
  const Upload = new GraphQLScalarType({
    name: "Upload",
  });
  builder.addScalarType("Upload", Upload, {});
}

export const schema = builder.toSchema({ sortSchema: false });
