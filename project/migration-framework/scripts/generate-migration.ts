import "reflect-metadata";
import path from "path";
import { MikroORM, ReflectMetadataProvider } from "mikro-orm";
import { CodeBlockWriter, Project } from "ts-morph";

import { Entities } from "../../app/entities";
import * as Migrations from "../../migrations";

import { databaseName, writeIndex } from "../utils";

const generateAndSave = async (
  diff: string[],
  sortKey: number,
  name: string
) => {
  const fileName = `${sortKey.toString().padStart(3, "0")}-${name}.ts`;
  const project = new Project();

  const createStatement = (writer: CodeBlockWriter, sql: string) => {
    if (sql) {
      writer.writeLine(`await database.query(\`${sql}\`);`);
    } else {
      writer.blankLine();
    }
  };

  const migration = project.createSourceFile(
    path.join("migrations", fileName),
    writer => {
      writer.writeLine(
        `import { Migration } from '../migration-framework/migration';`
      );
      writer.writeLine(`import { Client } from 'pg';`);
      writer.blankLine();
      writer.write(`export class ${name} implements Migration`);
      writer.block(() => {
        writer.write(`sortKey = ${sortKey};`);
        writer.blankLine();
        writer.write("public async up(database: Client): Promise<any>");
        writer.block(() => diff.forEach(sql => createStatement(writer, sql)));
        writer.blankLine();
      });
      writer.write("");
    }
  );

  await migration.save();
};

const run = async () => {
  // Did they pass a name?
  const migrationName = process.argv[2];
  if (!migrationName) throw new Error("No migration name passed");

  console.log(`Creating migration ${migrationName}`);

  // Validate existing migrations
  const sortKeys = new Set();
  const migrationInstances = Object.values(Migrations).map(
    (Instance: any) => new Instance()
  );

  for (const migration of migrationInstances) {
    if (sortKeys.has(migration.sortKey)) {
      throw new Error(`Duplicate sort key: ${migration.sortKey}`);
    }

    sortKeys.add(migration.sortKey);
  }

  // Ok, sort and find the max sort key
  migrationInstances.sort((left, right) => left.sortKey - right.sortKey);

  let maxSortKey = -1;

  if (migrationInstances.length) {
    maxSortKey = migrationInstances[migrationInstances.length - 1].sortKey;
  }

  // Ok, generate the SQL and save it.
  const orm = await MikroORM.init({
    type: "postgresql",
    entities: Entities,

    dbName: databaseName,

    metadataProvider: ReflectMetadataProvider,
    discovery: { disableDynamicFileAccess: true }
  });

  console.log("Generating diff");
  const generator = orm.getSchemaGenerator();
  const dump = await generator.getUpdateSchemaSQL(false);
  const lines = dump.split("\n").filter(line => line.length > 0);

  console.log("Saving...");
  await generateAndSave(lines, maxSortKey + 1, migrationName);

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
