import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/{index,cli}.ts"],
  dts: true,
  platform: "node",
});
