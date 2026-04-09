import { changelog } from "../changelog.ts";
import { ReleaseContext, ResolvedConfig } from "../config/types.ts";
import { renderTemplate } from "../utils/index.js";
import { ResolvedConfigWithChangelog } from "../utils/type.ts";

export async function genChangelog(
  config: ResolvedConfigWithChangelog,
  ctx: ReleaseContext,
) {
  // if (config.git.changelog === false) return;

  // 格式化args参数
  config.git.changelog.args = transformArgs(config.git.changelog.args, ctx);

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
