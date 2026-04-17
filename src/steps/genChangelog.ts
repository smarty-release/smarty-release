import { changelog } from "../changelog.ts";
import { ReleaseContext } from "../config/types.ts";
import { renderTemplate, gitRestore } from "../utils/index.js";
import { ResolvedConfigWithChangelog } from "../utils/type.ts";
import ora from "ora";
import { confirm } from "@inquirer/prompts";
import { CancelledError } from "../errors.ts";

export async function genChangelog(
  config: ResolvedConfigWithChangelog,
  ctx: ReleaseContext,
) {
  config.git.changelog.args = renderArgs(config.git.changelog.args, ctx);

  const spinner = ora("Generating changelog, please wait…").start();
  await changelog(config.git.changelog, {
    stdio: "ignore",
  });
  spinner.stop();

  // 再来一个询问,询问用户变更日志是否正常
  const normal = await confirm({
    message: "Changelog generated. Does it look good?",
    default: true,
  });

  if (normal === false) {
    await gitRestore();
    throw new CancelledError();
  }
}

function renderArgs(args: string[], ctx: ReleaseContext) {
  return args.map((v) => renderTemplate(v, ctx));
}
