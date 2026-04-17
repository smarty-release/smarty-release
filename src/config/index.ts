import { resolve } from "node:path";
import { lilconfig } from "lilconfig";
import type { Loader } from "lilconfig";
import { pathExists } from "../utils/fs.ts";

export * from "./types.ts";

const loadTs: Loader = async (filepath) => {
  const { createJiti } = await import("jiti");
  return createJiti(import.meta.url, { interopDefault: true }).import(
    filepath,
    { default: true },
  );
};

export async function loadConfig<T>(
  name: string,
  configPath?: string,
): Promise<T> {
  const explorer = lilconfig(name, {
    loaders: {
      ".mts": loadTs,
      ".ts": loadTs,
    },
    searchPlaces: [`${name}.config.ts`, `${name}.config.mts`],
  });

  let result;

  if (configPath) {
    const filepath = resolve(process.cwd(), configPath);

    if (!(await pathExists(filepath))) {
      throw new Error(`Config file not found: ${filepath}`);
    }
    result = await explorer.load(filepath);
  } else {
    result = await explorer.search();
  }

  return (result?.config ?? {}) as T;
}
