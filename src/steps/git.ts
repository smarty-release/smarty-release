import { ResolvedConfig, InternalReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.ts";
import { x } from "tinyexec";
import ora from "ora";
import { GitCommitError, GitPushError, GitTagError } from "../errors.ts";

export async function gitAdd() {
  await x("git", ["add", "."], {
    throwOnError: true,
  });
}

export async function gitCommit(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  const message = renderTemplate(config.git.commitMessage, context);

  try {
    await x("git", ["commit", ...config.git.commitArgs, "-m", message], {
      throwOnError: true,
    });
  } catch (error) {
    throw new GitCommitError();
  }
}

export async function gitTag(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  try {
    await x("git", ["tag", "-f", context.git.tagName], {
      throwOnError: true,
    });
  } catch (error) {
    throw new GitTagError();
  }
}

export async function gitPush(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  const spinner = ora("Releasing…").start();

  try {
    await x(
      "git",
      ["push", "origin", "HEAD", `refs/tags/${context.git.tagName}`],
      {
        throwOnError: true,
      },
    );
    spinner.stop();
  } catch (error) {
    throw new GitPushError();
  }
}
