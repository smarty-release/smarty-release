import { changelog } from "../changelog.ts";
import { ReleaseContext, UserConfig } from "../config/types.ts";
import { renderTemplate } from "../utils/index.js";
import type { RequiredDeep } from "type-fest";

type EnabledChangelogConfig = RequiredDeep<
  Omit<UserConfig, "changelog"> & {
    changelog: Exclude<UserConfig["changelog"], false | undefined>;
  }
>;

export async function genChangelog(
  config: EnabledChangelogConfig,
  ctx: ReleaseContext,
) {
  // 格式化args参数
  config.changelog.args = transformArgs(config.changelog.args, ctx);

  await changelog(config, {
    stdio: "ignore",
  });
}

function transformArgs(input: string | string[], ctx: ReleaseContext) {
  if (typeof input !== "string" && !Array.isArray(input)) {
    throw new TypeError("Expected string or array");
  }
  const arr = typeof input === "string" ? input.trim().split(/\s+/) : input;

  return arr.map((v) => renderTemplate(v, ctx));
}
