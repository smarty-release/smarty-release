import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.ts";
import { x } from "tinyexec";
import ora from "ora";
import { GitCommitError, GitPushError, GitTagError } from "../errors.ts";

export async function gitAdd() {
  await x("git", ["add", "."], {
    throwOnError: true,
  });
}

export async function gitCommit(config: ResolvedConfig, ctx: ReleaseContext) {
  const message = renderTemplate(config.git.commitMessage, ctx);

  try {
    await x("git", ["commit", ...config.git.commitArgs, "-m", message], {
      throwOnError: true,
    });
  } catch (error) {
    throw new GitCommitError();
  }
}

export async function gitTag(config: ResolvedConfig, ctx: ReleaseContext) {
  try {
    await x("git", ["tag", "-f", ctx.git.tagName], {
      throwOnError: true,
    });
  } catch (error) {
    throw new GitTagError();
  }
}

export async function gitPush(config: ResolvedConfig, ctx: ReleaseContext) {
  const spinner = ora("Releasing…").start();

  try {
    await x("git", ["push", "origin", "HEAD", `refs/tags/${ctx.git.tagName}`], {
      throwOnError: true,
    });
    spinner.stop();
  } catch (error) {
    throw new GitPushError();
  }
}
