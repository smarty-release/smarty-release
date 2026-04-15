import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { run, renderTemplate } from "../utils/index.ts";
import ora from "ora";

export async function gitAdd(config: ResolvedConfig, ctx: ReleaseContext) {
  await run("git", ["add", "."], { cwd: config.cwd });
}

export async function gitCommit(config: ResolvedConfig, ctx: ReleaseContext) {
  const message = renderTemplate(config.git.commitMessage, ctx);
  await run("git", ["commit", "--no-verify", "-s", "-m", message], {
    cwd: config.cwd,
  });
}

export async function gitTag(config: ResolvedConfig, ctx: ReleaseContext) {
  const tagName = renderTemplate(config.git.tagName, ctx);
  await run("git", ["tag", tagName], { cwd: config.cwd });
}

export async function gitPush(config: ResolvedConfig, ctx: ReleaseContext) {
  const spinner = ora("Releasing…").start();
  const tagName = renderTemplate(config.git.tagName, ctx);
  await run("git", ["push"], { cwd: config.cwd });
  await run("git", ["push", "origin", `refs/tags/${tagName}`], {
    cwd: config.cwd,
  });
  spinner.stop();
}
