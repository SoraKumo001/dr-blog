import fs from "fs";
import { printSchema } from "graphql";
import { schema } from "~/server/graphql/schema";

const main = async () => {
  const s = schema();
  fs.writeFileSync("./codegen/schema.graphql", printSchema(s));
};

main();
