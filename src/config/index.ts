import { resolve } from "node:path";
import type { Loader } from "lilconfig";
import { lilconfig, LilconfigResult } from "lilconfig";
import { access, constants } from "node:fs/promises";
import { merge } from "lodash-es";

export * from "./types.ts";

const loadTs: Loader = async (filepath) => {
  const { createJiti } = await import("jiti");

  return createJiti(import.meta.url, { interopDefault: true }).import(
    filepath,
    {
      default: true,
    },
  );
};

async function loadConfig<T extends Record<string, any> = Record<string, any>>(
  name: string,
  customPath?: string,
  overrides?: Partial<T>,
): Promise<T> {
  let result: LilconfigResult | null;
  const explorer = lilconfig(name, {
    loaders: {
      ".mts": loadTs,
      ".ts": loadTs,
    },
    searchPlaces: [`${name}.config.ts`, `${name}.config.mts`],
  });
  if (customPath) {
    // 传递了config选项
    const filepath = resolve(process.cwd(), customPath);

    // 检查该文件是否存在
    const exists = await fileExists(filepath);

    if (!exists) {
      throw new Error(`No ${name} configuration found.`);
    }
    result = await explorer.load(filepath);
  } else {
    result = await explorer.search();
  }

  const config = (result?.config ?? {}) as T;

  if (!overrides) return config;

  return merge({}, config, overrides);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export { loadConfig };
