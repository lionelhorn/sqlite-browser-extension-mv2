import {waSqliteWebBackend} from "@kikko-land/wa-sqlite-web-backend";
import {initDbClient} from "@kikko-land/kikko";
import {sqlWasmUrl} from "../vars";

export const startKikkoWaSqlite = async () => {
  const waSqliteConfig = {
    dbName: "db-kikko-wasqlite",
    dbBackend: waSqliteWebBackend({
      wasmUrl: sqlWasmUrl,
      pageSize: 64 * 1024,
      cacheSize: -10000,
      vfs: "minimal",
    }),
    // plugins: [migrations],
  };

  const db = await initDbClient(waSqliteConfig);
  console.log(db.__state);
};
