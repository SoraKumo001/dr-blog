import { normalizationPostFiles as _normalizationPostFiles } from "../../libs/normalizationPostFiles";
import { isolatedFiles } from "../../libs/uploadFile";
import { builder } from "../builder";

export const normalizationPostFiles = builder.mutationField(
  "normalizationPostFiles",
  (t) =>
    t.boolean({
      args: {
        postId: t.arg({ type: "String", required: true }),
        removeAll: t.arg({ type: "Boolean" }),
      },
      resolve: async (_root, { postId, removeAll }, { db, user, env }) => {
        if (!user) throw new Error("Unauthorized");
        await _normalizationPostFiles(db, postId, removeAll === true, {
          projectId: env.GOOGLE_PROJECT_ID ?? "",
          clientEmail: env.GOOGLE_CLIENT_EMAIL ?? "",
          privateKey: env.GOOGLE_PRIVATE_KEY ?? "",
        }).catch(() => null);
        await isolatedFiles({
          projectId: env.GOOGLE_PROJECT_ID ?? "",
          clientEmail: env.GOOGLE_CLIENT_EMAIL ?? "",
          privateKey: env.GOOGLE_PRIVATE_KEY ?? "",
        }).catch(() => null);
        return true;
      },
    }),
);
