import { BucketObjectType } from "./BucketObject";
import { CorsInput } from "./CorsInput";
import { builder } from "../builder";

export const bucket = builder.mutationField("bucket", (t) =>
  t.field({
    type: BucketObjectType,
    args: {
      cors: t.arg({ type: [CorsInput] }),
    },
    resolve: async (_parent, { cors }, { user, storageService }) => {
      if (!user) throw new Error("Unauthorized");
      const cors2 = cors?.map((c) => {
        return {
          origin: c.origin ?? undefined,
          method: c.method ?? undefined,
          responseHeader: c.responseHeader ?? undefined,
          maxAgeSeconds: c.maxAgeSeconds ?? undefined,
        };
      });
      storageService.updateBucket({ body: { cors: cors2 } });
      return storageService.infoBucket({});
    },
  })
);
