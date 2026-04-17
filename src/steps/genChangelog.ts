import { changelog } from "../changelog.ts";
import { ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.js";
import { ResolvedConfigWithChangelog } from "../utils/type.ts";

export async function genChangelog(
  config: ResolvedConfigWithChangelog,
  ctx: ReleaseContext,
) {
  config.git.changelog.args = renderArgs(config.git.changelog.args, ctx);

  await changelog(config.git.changelog, {
    stdio: "ignore",
  });
}

function renderArgs(args: string[], ctx: ReleaseContext) {
  return args.map((v) => renderTemplate(v, ctx));
}
