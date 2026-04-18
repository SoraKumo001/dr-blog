import { sql } from "drizzle-orm";
import {
  boolean,
  primaryKey,
  text,
  timestamp,
  uuid,
  pgSchema,
  pgTable,
  type PgTableFn,
} from "drizzle-orm/pg-core";

const createSchemaTable = (): PgTableFn<string | undefined> => {
  if (process.argv[2] !== "generate" && process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const searchPath = url.searchParams.get("schema");
    if (searchPath) {
      return pgSchema(searchPath).table;
    }
  }
  return pgTable;
};

const table = createSchemaTable();

export const timestamps = {
  createdAt: timestamp({ precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp({ precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

export const user = table("User", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  name: text().notNull().default("User"),
  ...timestamps,
});

export const post = table("Post", {
  id: text()
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid ()`),
  published: boolean().notNull(),
  title: text().notNull().default("New Post"),
  content: text().notNull(),
  authorId: uuid()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  cardId: text().references(() => fireStore.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...timestamps,
  publishedAt: timestamp("publishedAt", { precision: 3 })
    .notNull()
    .defaultNow(),
});

export const category = table("Category", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: text().notNull(),
  ...timestamps,
});

export const system = table("System", {
  id: text().notNull().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  iconId: text().references(() => fireStore.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  cardId: text().references(() => fireStore.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...timestamps,
});

export const fireStore = table("FireStore", {
  id: text().notNull().primaryKey(),
  name: text().notNull(),
  mimeType: text().notNull(),
  ...timestamps,
});

export const categoryToPost = table(
  "CategoryToPost",
  {
    postId: text()
      .notNull()
      .primaryKey()
      .references(() => post.id, { onDelete: "cascade", onUpdate: "cascade" }),
    categoryId: uuid()
      .notNull()
      .primaryKey()
      .references(() => category.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })]
);

export const fireStoreToPost = table(
  "FireStoreToPost",
  {
    postId: text()
      .notNull()
      .primaryKey()
      .references(() => post.id, { onDelete: "cascade", onUpdate: "cascade" }),
    fireStoreId: text()
      .notNull()
      .primaryKey()
      .references(() => fireStore.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.fireStoreId] })]
);
