import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import {chromeExtension, simpleReloader} from "rollup-plugin-chrome-extension";
import {emptyDir} from "rollup-plugin-empty-dir";
import zip from "rollup-plugin-zip";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import {readFileSync, writeFileSync, existsSync} from "fs";

const isProduction = process.env.NODE_ENV === "production";


// Dirty trick to adjust web_accessible_resources
const tweakManifestPlugin = (options = {}) => {
  const {targets = [], hook = "buildEnd"} = options;
  return {
    name: "tweak-manifest",
    [hook]: async () => {
      console.log("Attempt to tweak dist manifest.");

      setTimeout(() => {
        const path = new URL("./dist/manifest.json", import.meta.url);

        if(existsSync(path)) {
          console.log("Tweaking dist manifest.");
          const manifest = JSON.parse(readFileSync(path, "utf8"));

          const additionalWebAccessibleResources = ["chunks/wa-sqlite.wasm", "wa-sqlite.wasm", "sql-wasm.wasm"];

          for (const additionalWebAccessibleResource of additionalWebAccessibleResources) {
            if (!manifest.web_accessible_resources.includes(additionalWebAccessibleResource)) {
              manifest.web_accessible_resources.push(additionalWebAccessibleResource);
            }
          }

          console.log("Resulting manifest", manifest);

          writeFileSync(new URL("./dist/manifest.json", import.meta.url), JSON.stringify(manifest, null, '\t'), "utf8")
        }
      }, 10000);
    },
  };
};

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    chunkFileNames: path.join("chunks", "[name]-[hash].js"),
  },
  plugins: [
    // emptyDir(),
    copy({
      targets: [
        {src: "./node_modules/@kikko-land/sql.js/dist/sql-wasm.wasm", dest: "dist"},
        {src: "./node_modules/wa-sqlite/dist/wa-sqlite.wasm", dest: "dist"},
        {src: "./node_modules/wa-sqlite/dist/wa-sqlite.wasm", dest: "dist/chunks"},
      ],
      hook: "buildStart",
      verbose: true,
    }),
    replace({
      "process.env.NODE_ENV": isProduction ? JSON.stringify("production") : JSON.stringify("development"),
      preventAssignment: true,
    }),
    chromeExtension(),
    // Adds a Chrome extension reloader during watch mode
    simpleReloader(),
    resolve(),
    commonjs(),
    typescript(),
    // Outputs a zip file in ./releases
    isProduction && zip({dir: "releases"}),
    tweakManifestPlugin(),
  ],
};
