import { storage } from "../../libs/getStorage";
import { builder } from "../builder";
import { BucketObjectType } from "../objects";

builder.queryField("bucket", (t) =>
  t.field({
    type: BucketObjectType,
    resolve: async (_parent, _input, { env, user }) => {
      if (!user) throw new Error("Unauthorized");
      const s = storage({
        projectId: env.GOOGLE_PROJECT_ID ?? "",
        clientEmail: env.GOOGLE_CLIENT_EMAIL ?? "",
        privateKey: env.GOOGLE_PRIVATE_KEY ?? "",
      });
      return s.infoBucket({});
    },
  })
);
