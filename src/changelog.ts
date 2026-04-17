import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parse, stringify } from "smol-toml";
import crypto from "node:crypto";
import { NormalizedChangelogOptions } from "./config/types.ts";
import { defu } from "./utils/index.ts";
import { outputFile, remove } from "./utils/fs.ts";
import { getExePath } from "./utils/getExePath.ts";
import { x } from "tinyexec";
import { SpawnOptions } from "node:child_process";
import { NAME } from "./constants.ts";

// 当前脚本所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.resolve(process.cwd(), "node_modules", `.${NAME}`);

// 生成变更日志
export async function changelog(
  options: NormalizedChangelogOptions,
  spawnOptions: SpawnOptions = {},
) {
  const args = filterArgs(options.args);

  const tmpConfigFile = await resolveTemplateConfig(options);

  args.push(...["--config", tmpConfigFile]);

  const bin = await getExePath();

  await x(bin, args, {
    nodeOptions: {
      stdio: "inherit",
      ...spawnOptions,
    },
    throwOnError: true,
  });

  remove(tmpConfigFile);
}

function filterArgs(args: string[]): string[] {
  const skip = new Set(["--config", "-c"]);

  const result: string[] = [];

  for (const arg of args) {
    if (arg.startsWith("--config=")) continue;

    if (skip.has(arg)) {
      continue;
    }

    result.push(arg);
  }

  return result;
}

async function resolveTemplateConfig(options: NormalizedChangelogOptions) {
  const defaultTplPath = path.resolve(
    __dirname,
    "..",
    "templates",
    `${options.template}.toml`,
  );

  if (!existsSync(defaultTplPath)) {
    throw new Error(`Default template file not found: ${defaultTplPath}`);
  }

  const defaultTplRaw = await readFile(defaultTplPath, "utf-8");
  const defaultTplConfig = parse(defaultTplRaw);

  const finalConfig = defu(
    options.config ? options.config : {},
    defaultTplConfig,
  );

  const tmpFile = path.join(cacheDir, `gitcliff-${crypto.randomUUID()}.toml`);

  await outputFile(tmpFile, stringify(finalConfig));

  return tmpFile;
}

export async function clearCache() {
  await remove(cacheDir);
}
