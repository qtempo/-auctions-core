// import "dotenv/config";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  dts: "src/index.ts",
  external: [],
  format: ["esm", "cjs"],
  esbuildPlugins: [],
});
