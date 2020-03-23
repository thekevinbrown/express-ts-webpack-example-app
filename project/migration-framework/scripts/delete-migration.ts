import "reflect-metadata";
import fs from "fs";
import path from "path";
import { promisify } from "util";

import { writeIndex } from "../utils";

const unlink = promisify(fs.unlink);

const run = async () => {
  // Did they pass a sortKey?
  const migrationFileName = process.argv[2];
  if (!migrationFileName) throw new Error("No migration file name passed");

  console.log("Deleting migration %s", migrationFileName);

  // Delete the file.
  await unlink(path.join("src", "migrations", `${migrationFileName}.ts`));

  console.log("Updating index.ts");
  await writeIndex();
};

run()
  .catch(error => {
    throw error;
  })
  .then(() => {
    console.log("Done!");

    process.exit(0);
  });
