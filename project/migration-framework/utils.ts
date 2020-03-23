import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import { Project } from "ts-morph";

const readdir = promisify(fs.readdir);

export const databaseName = "mikro-orm-webpack-express-ts";

export const writeIndex = async () => {
  // Update the index.ts file in the migrations directory.
  const files = await readdir("migrations");
  const filteredFiles = files.filter(
    file => file !== "index.ts" && file !== ".DS_Store"
  );

  const project = new Project();

  const index = project.createSourceFile(
    path.join("migrations", "index.ts"),
    writer => {
      for (const file of filteredFiles) {
        writer.writeLine(
          `export * from './${path.basename(file, path.extname(file))}';`
        );
      }
    },
    { overwrite: true }
  );

  await index.save();
};
