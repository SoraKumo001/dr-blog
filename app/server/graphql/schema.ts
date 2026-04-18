import { GraphQLScalarType } from "graphql";
import * as auth from "./auth";
import { builder } from "./builder";
import * as post from "./post";
import * as storage from "./storage";
import * as system from "./system";

// dummy
const dummy = () => ({
  auth,
  system,
  post,
  storage,
});
dummy();

if (!builder.configStore.hasConfig("Upload")) {
  const Upload = new GraphQLScalarType({
    name: "Upload",
  });
  builder.addScalarType("Upload", Upload, {});
}

export const schema = builder.toSchema({ sortSchema: false });
