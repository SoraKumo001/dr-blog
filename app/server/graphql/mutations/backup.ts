import { builder } from "../builder";

builder.mutationField("backup", (t) =>
  t.string({
    nullable: false,
    resolve: async (_root, {}, { user, db }) => {
      if (!user) throw new Error("Unauthorized");

      const [users, categories, system, posts, files] = await db.transaction(
        async (tx) =>
          Promise.all([
            tx.query.user.findMany(),
            tx.query.category.findMany(),
            tx.query.system.findMany(),
            tx.query.post.findMany({
              with: { categories: { columns: { id: true } } },
            }),
            tx.query.fireStore.findMany(),
          ])
      );
      return JSON.stringify({
        system,
        users,
        categories,
        posts,
        files,
      });
    },
  })
);
