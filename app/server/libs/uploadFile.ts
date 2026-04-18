import { eq, and, or, isNull } from "drizzle-orm";
import { db } from "../db";
import type { storage } from "./getStorage";
import * as schema from "~/db/schema";

export const uploadFile = async ({
  binary,
  storageService,
}: {
  storageService: ReturnType<typeof storage>;
  binary: File;
}) => {
  const uuid = (await import("pure-uuid")).default;
  const id = `${new uuid(4).format()}-[${binary.name}]`;
  await storageService.upload({
    name: id,
    file: binary,
    published: true,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
  });
  return db
    .insert(schema.fireStore)
    .values({ id, name: binary.name, mimeType: binary.type ?? "" })
    .returning()
    .then((v) => v[0]);
};

export const isolatedFiles = async ({
  storageService,
}: {
  storageService: ReturnType<typeof storage>;
}) => {
  const files = await db
    .selectDistinctOn([schema.fireStore.id], { id: schema.fireStore.id })
    .from(schema.fireStore)
    .leftJoin(schema.post, eq(schema.post.cardId, schema.fireStore.id))
    .leftJoin(
      schema.system,
      or(
        eq(schema.system.iconId, schema.fireStore.id),
        eq(schema.system.cardId, schema.fireStore.id)
      )
    )
    .leftJoin(
      schema.fireStoreToPost,
      eq(schema.fireStoreToPost.fireStoreId, schema.fireStore.id)
    )
    .where(
      and(
        isNull(schema.post.cardId),
        isNull(schema.system.iconId),
        isNull(schema.system.cardId),
        isNull(schema.fireStoreToPost.fireStoreId)
      )
    )
    .execute();
  for (const { id } of files) {
    await storageService
      .del({ name: id })
      .catch(undefined)
      .catch(() => undefined);
    await db.delete(schema.fireStore).where(eq(schema.fireStore.id, id));
  }
};

export const isolatedFirebase = async ({
  storageService,
}: {
  storageService: ReturnType<typeof storage>;
}) => {
  const files = await db.select().from(schema.fireStore).execute();
  const firebaseFiles = await storageService.list({});
  const setFiles = new Set(files.map((v) => v.id));
  for (const { name } of firebaseFiles) {
    if (!setFiles.has(name)) {
      await storageService.del({ name }).catch((e) => console.error(e));
    }
  }
};
