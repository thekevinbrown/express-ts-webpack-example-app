import { Client } from "pg";

import { Migration } from "./migration";
import * as Migrations from "../migrations";
import { databaseName } from "./utils";

const getLastMigrationVersion = async (database: Client) => {
  await database.query(`
        CREATE TABLE IF NOT EXISTS migration (
			"id" serial primary key,
			"last_migration" int4 not null,
			"run_at" timestamptz(0) not null
        )
    `);

  const result = await database.query(`
        SELECT last_migration
        FROM migration
        ORDER BY last_migration DESC
        LIMIT 1
    `);

  if (result.rowCount < 1) return -1;

  return result.rows[0].last_migration as number;
};

const setLastMigrationVersion = async (database: Client, version: number) => {
  console.log(`Setting migration version to ${version}`);

  await database.query(`DELETE FROM migration`);
  await database.query(
    `
        INSERT INTO migration (last_migration, run_at)
        VALUES ($1, NOW())
    `,
    [version]
  );
};

const connectToDatabase = async () => {
  console.log("Connecting to database");

  const client = new Client({ database: databaseName });
  await client.connect();

  console.log("Successfully connected.");

  return client;
};

export const runMigrations = async () => {
  console.log("Connecting to DB.");
  const database = await connectToDatabase();

  console.log("Connected! Sorting migrations.");

  const migrations = Object.values(Migrations).map(
    instance => new instance()
  ) as Migration[];
  migrations.sort((left, right) => left.sortKey - right.sortKey);

  console.log(`${migrations.length} migration(s) present.`);

  try {
    console.log("Starting transaction");
    await database.query("BEGIN");

    // Find last run.
    const lastMigration = await getLastMigrationVersion(database);

    console.log(`Last migration sort key is ${lastMigration}`);

    const filteredMigrations = migrations.filter(
      migration => migration.sortKey > lastMigration
    );
    console.log(`Running ${filteredMigrations.length} migration(s)`);

    for (const migration of filteredMigrations) {
      console.log(`Running migration with sortKey ${migration.sortKey}`);

      await migration.up(database);
    }

    console.log(`Successfully ran ${filteredMigrations.length} migration(s).`);

    if (filteredMigrations.length) {
      console.log("Updating migrations table.");
      await setLastMigrationVersion(
        database,
        migrations[migrations.length - 1].sortKey
      );
    }

    console.log("Committing transaction");
    await database.query("COMMIT");
  } catch (error) {
    console.error(error);
    await database.query("ROLLBACK");

    console.log("Closing connection");
    await database.end();

    throw error;
  }

  console.log("Closing connection");
  await database.end();

  console.log("Success");
};
