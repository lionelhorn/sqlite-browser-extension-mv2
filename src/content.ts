import {startWasqlite} from "./sqlite-backends/wasqlite-direct";
import {startKikkoWaSqlite} from "./sqlite-backends/kikko-wasqlite";
import {startKikkoAbsurd} from "./sqlite-backends/kikko-absurd";

console.log("mv2: Hello from content page");

(async () => {
  try {
    await startWasqlite();
  } catch (e: any) {
    console.error("wasqlite-direct", e);
  }

  try {
    await startKikkoAbsurd();
  } catch (e: any) {
    console.error("kikko-absurd", e);
  }

  try {
    await startKikkoWaSqlite();
  } catch (e: any) {
    console.error("kikko-wasqlite", e);
  }
})();

