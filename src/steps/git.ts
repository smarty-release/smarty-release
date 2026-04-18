import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.ts";
import { x } from "tinyexec";
import ora from "ora";

export async function gitAdd() {
  await x("git", ["add", "."], {
    throwOnError: true,
  });
}

export async function gitCommit(config: ResolvedConfig, ctx: ReleaseContext) {
  const message = renderTemplate(config.git.commitMessage, ctx);
  await x("git", ["commit", ...config.git.commitArgs, "-m", message], {
    throwOnError: true,
  });
}

export async function gitTag(config: ResolvedConfig, ctx: ReleaseContext) {
  const tagName = renderTemplate(config.git.tagName, ctx);
  await x("git", ["tag", tagName], {
    throwOnError: true,
  });
}

export async function gitPush(config: ResolvedConfig, ctx: ReleaseContext) {
  const spinner = ora("Releasing…").start();
  const tagName = renderTemplate(config.git.tagName, ctx);
  await x("git", ["push"], {
    throwOnError: true,
  });
  await x("git", ["push", "origin", `refs/tags/${tagName}`], {
    throwOnError: true,
  });
  spinner.stop();
}
