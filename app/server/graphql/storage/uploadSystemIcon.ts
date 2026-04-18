import { eq } from "drizzle-orm";
import { isolatedFiles, uploadFile } from "../../libs/uploadFile";
import { builder } from "../builder";
import { system } from "~/db/schema";

export const uploadSystemIcon = builder.mutationField("uploadSystemIcon", (t) =>
  t.drizzleField({
    type: "fireStore",
    args: {
      file: t.arg({ type: "Upload", required: true }),
    },
    resolve: async (_query, _root, { file }, { db, user, env , storageService }) => {
      if (!user) throw new Error("Unauthorized");
      const firestore = await uploadFile({
        storageService,
        binary: file,
      });
      await db
        .update(system)
        .set({
          iconId: firestore.id,
        })
        .where(eq(system.id, "system"))
        .returning();
      await isolatedFiles({ storageService });
      if (!firestore) throw new Error("icon is not found");
      return firestore;
    },
  })
);
