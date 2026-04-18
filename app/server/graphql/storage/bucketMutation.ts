import { BucketObjectType } from "./BucketObject";
import { CorsInput } from "./CorsInput";
import { builder } from "../builder";

export const bucket = builder.mutationField("bucket", (t) =>
  t.field({
    type: BucketObjectType,
    args: {
      cors: t.arg({ type: [CorsInput] }),
    },
    resolve: async (_parent, { cors }, { env, user , storageService }) => {
      if (!user) throw new Error("Unauthorized");
      const s = storage({
        projectId: env.GOOGLE_PROJECT_ID ?? "",
        clientEmail: env.GOOGLE_CLIENT_EMAIL ?? "",
        privateKey: env.GOOGLE_PRIVATE_KEY ?? "",
      });
      const cors2 = cors?.map((c) => {
        return {
          origin: c.origin ?? undefined,
          method: c.method ?? undefined,
          responseHeader: c.responseHeader ?? undefined,
          maxAgeSeconds: c.maxAgeSeconds ?? undefined,
        };
      });
      s.updateBucket({ body: { cors: cors2 } });
      return s.infoBucket({});
    },
  })
);
