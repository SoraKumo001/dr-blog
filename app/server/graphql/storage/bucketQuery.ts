import { BucketObjectType } from "./BucketObject";
import { builder } from "../builder";

export const bucket = builder.queryField("bucket", (t) =>
  t.field({
    type: BucketObjectType,
    resolve: async (_parent, _input, { user, storageService }) => {
      if (!user) throw new Error("Unauthorized");
      return storageService.infoBucket({});
    },
  })
);
