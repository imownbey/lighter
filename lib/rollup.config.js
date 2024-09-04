import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";
import { arraybuffer } from "./load-buffer";

const pkg = require("./package.json");

const plugins = [
  replace({ __LIGHTER_VERSION__: `${pkg.version}`, preventAssignment: false }),
  json(),
  nodeResolve(),
  typescript({
    tsconfigDefaults: { compilerOptions: { module: "esnext" } },
  }),
  arraybuffer({ include: "**/*.wasm" }),
  terser(),
];

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      inlineDynamicImports: true,
      entryFileNames: "[name].esm.mjs",
      // chunkFileNames: (chunkInfo) => {
      //   // move dynamic imported json grammars to the dist folder as mjs
      //   if (chunkInfo.facadeModuleId.includes("tm-grammars")) {
      //     const fileName = path.basename(chunkInfo.facadeModuleId, ".json");
      //     return `grammar/${fileName}.mjs`;
      //   }
      //   // move dynamic imported json themes to the dist folder as mjs
      //   if (chunkInfo.facadeModuleId.includes("themes")) {
      //     const fileName = path.basename(chunkInfo.facadeModuleId, ".json");
      //     return `theme/${fileName}.mjs`;
      //   }
      //   return "[name].mjs";
      // },
    },
    plugins,
  },
  // {
  //   input: "src/index.ts",
  //   output: [{ file: "dist/worker.esm.mjs", format: "esm" }],
  //   external: ["./onig.wasm?module"],
  //   plugins: [
  //     replace({
  //       "./file-system": "./file-system.browser",
  //       "./network": "./network.browser",
  //       "./wasm": "./wasm.worker",
  //       delimiters: ["", "\\b"],
  //       preventAssignment: false,
  //     }),
  //     ...plugins,
  //   ],
  // },
  // {
  //   input: "src/index.ts",
  //   output: [{ file: "dist/browser.esm.mjs", format: "esm" }],
  //   plugins: [
  //     replace({
  //       "./file-system": "./file-system.browser",
  //       "./network": "./network.browser",
  //       delimiters: ["", "\\b"],
  //       preventAssignment: false,
  //     }),
  //     ...plugins,
  //   ],
  // },
  {
    input: "./src/index.ts",
    output: [
      { file: "dist/index.d.ts", format: "es", inlineDynamicImports: true },
    ],
    plugins: [dts()],
  },
];
