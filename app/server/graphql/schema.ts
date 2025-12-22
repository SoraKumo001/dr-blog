import { GraphQLScalarType } from "graphql";
import { builder } from "./builder";
import * as mutations from "./mutations";
import * as queries from "./queries";

// dummy
const dummy = () => ({
  queries,
  mutations,
});
dummy();

if (!builder.configStore.hasConfig("Upload")) {
  const Upload = new GraphQLScalarType({
    name: "Upload",
  });
  builder.addScalarType("Upload", Upload, {});
}

export const schema = builder.toSchema({ sortSchema: false });
