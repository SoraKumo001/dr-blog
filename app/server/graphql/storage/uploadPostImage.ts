import { uploadFile } from "../../libs/uploadFile";
import { builder } from "../builder";
import { fireStoreToPost } from "~/db/schema";

export const uploadPostImage = builder.mutationField("uploadPostImage", (t) =>
  t.drizzleField({
    type: "fireStore",
    nullable: false,
    args: {
      postId: t.arg({ type: "String", required: true }),
      file: t.arg({ type: "Upload", required: true }),
    },
    resolve: async (_query, _root, { postId, file }, { db, user, env , storageService }) => {
      if (!user) throw new Error("Unauthorized");
      const firestore = await uploadFile({
        storageService,
        binary: file,
      });
      await db.insert(fireStoreToPost).values({
        postId,
        fireStoreId: firestore.id,
      });
      return firestore;
    },
  })
);
