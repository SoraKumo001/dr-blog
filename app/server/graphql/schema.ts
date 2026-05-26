import { GraphQLScalarType } from "graphql";
import { signIn } from "./auth";
import { builder } from "./builder";
import { normalizationPostFiles } from "./post";
import {
  uploadSystemIcon,
  uploadPostImage,
  uploadPostIcon,
  BucketObjectType,
} from "./storage";
import { backup, restore, restoreFiles } from "./system";

if (!builder.configStore.hasConfig("Upload")) {
  const Upload = new GraphQLScalarType({
    name: "Upload",
  });
  builder.addScalarType("Upload", Upload, {});
}

export const schema = builder.toSchema({ sortSchema: false });

// @ts-ignore
schema.extensions = {
  ...schema.extensions,
  _keep: [
    signIn,
    normalizationPostFiles,
    uploadSystemIcon,
    uploadPostImage,
    uploadPostIcon,
    BucketObjectType,
    backup,
    restore,
    restoreFiles,
  ],
};
