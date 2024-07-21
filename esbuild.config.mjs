/** @type{import("esbuild").BuildOptions} */

import esbuild from "esbuild";
import { wasmLoader } from "esbuild-plugin-wasm";

esbuild
  .build({
    entryPoints: ["public/main.js"],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: "public/bundle.js",
    logLevel: "info",
    plugins: [wasmLoader()],
  })
  .catch(() => process.exit(1));
