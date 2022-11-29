import {absurdWebBackend} from "@kikko-land/absurd-web-backend";
import {initDbClient, sql} from "@kikko-land/kikko";
import {sqlWasmUrl} from "../vars";
import {IMigration, migrationsPlugin} from "@kikko-land/migrations-plugin";

const createNotesTableMigration: IMigration = {
  up: async (db) => {
    await db.runQuery(
      sql`
      CREATE TABLE IF NOT EXISTS notes (
        id varchar(20) PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `
    );

    await db.runQuery(
      sql`
      CREATE INDEX IF NOT EXISTS idx_note_title ON notes(title);
    `
    );
  },
  id: 1653668686076,
  name: "createNotesTable",
};

export const startKikkoAbsurd = async () => {
  const absurdConfig = {
    dbName: "db-kikko-absurd",
    dbBackend: absurdWebBackend({
      wasmUrl: sqlWasmUrl,
      pageSize: 64 * 1024,
      cacheSize: -10000,
    }),
    plugins: [migrationsPlugin({ migrations: [createNotesTableMigration] })],
  };

  const db = await initDbClient(absurdConfig);
  console.log("kikko-absurd db.__state", db.__state);
};
