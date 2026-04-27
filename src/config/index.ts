import { resolve } from "node:path";
import { lilconfig } from "lilconfig";
import type { Loader, LilconfigResult } from "lilconfig";

type LoaderReturn = Promise<Awaited<ReturnType<Loader>>>;
type LoaderFilepath = Parameters<Loader>[0];

export async function loadConfig<T>(
  name: string,
  configPath?: string,
): Promise<T> {
  const explorer = lilconfig(name, {
    loaders: {
      ".mts": loadTS,
      ".ts": loadTS,
      ".cts": loadTS,
    },
    searchPlaces: [
      `${name}.config.ts`,
      `${name}.config.mts`,
      `${name}.config.cts`,
      `${name}.config.json`,
    ],
  });

  const result: LilconfigResult = configPath
    ? await explorer.load(resolve(process.cwd(), configPath))
    : await explorer.search();

  if (!result) {
    return {} as T;
  }
  return result.config as T;
}
async function loadTS(filepath: LoaderFilepath): LoaderReturn {
  const { createJiti } = await import("jiti");
  return createJiti(import.meta.url, { interopDefault: true }).import(
    filepath,
    { default: true },
  );
}
