import { importFile } from "../../libs/importFile";
import { builder } from "../builder";
import * as schema from "~/db/schema";
import { db } from "~/server/db";

builder.mutationField("restore", (t) =>
  t.boolean({
    args: {
      file: t.arg({ type: "Upload", required: true }),
    },
    resolve: async (_root, { file }, { user }) => {
      if (!user) {
        if (await db.$count(schema.user)) {
          throw new Error("Unauthorized");
        }
      }
      await importFile({
        file: await file.text(),
      });
      return true;
    },
  })
);
