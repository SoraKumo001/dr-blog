import { BucketObjectType } from "./BucketObject";
import { builder } from "../builder";

export const bucket = builder.queryField("bucket", (t) =>
  t.field({
    type: BucketObjectType,
    resolve: async (_parent, _input, { env, user , storageService }) => {
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
