import { changelog } from "../changelog.ts";
import { ReleaseContext, ResolvedConfig } from "../config/types.ts";
import { renderTemplate } from "../utils/index.js";
import { ResolvedConfigWithChangelog } from "../utils/type.ts";

export async function genChangelog(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  if (config.git.changelog === false) return;

  config.git.changelog.args = renderArgs(config.git.changelog.args, ctx);

  await changelog(config.git.changelog);
}

function renderArgs(args: string[], ctx: ReleaseContext) {
  return args.map((v) => renderTemplate(v, ctx));
}
