import { runGitCliff } from "../git-cliff.ts";
import { ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.js";
import { ResolvedConfigWithChangelog } from "../utils/type.ts";
import ora from "ora";

export async function genChangelog(
  config: ResolvedConfigWithChangelog,
  ctx: ReleaseContext,
) {
  config.git.changelog.args = renderArgs(config.git.changelog.args, ctx);

  const spinner = ora("Generating changelog, please wait…").start();
  await runGitCliff(config.git.changelog, {
    stdio: "ignore",
  });
  spinner.stop();
}

function renderArgs(args: string[], ctx: ReleaseContext) {
  return args.map((v) => renderTemplate(v, ctx));
}
