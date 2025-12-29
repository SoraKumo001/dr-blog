import fs from "fs";
import { printSchema } from "graphql";
import { schema } from "~/server/graphql/schema";

const main = async () => {
  fs.writeFileSync("./codegen/schema.graphql", printSchema(schema));
};

main();
