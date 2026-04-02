import { FullUserConfig, ReleaseContext } from "../config/types.ts";
import { run, renderTemplate } from "../utils/index.ts";
import ora from "ora";

export async function gitAdd(config: FullUserConfig, ctx: ReleaseContext) {
  await run("git", ["add", "."]);
}

export async function gitCommit(config: FullUserConfig, ctx: ReleaseContext) {
  const message = renderTemplate(config.git.commitMessage, ctx);
  await run("git", ["commit", "--no-verify", "-s", "-m", message]);
}

export async function gitTag(config: FullUserConfig, ctx: ReleaseContext) {
  const tagName = renderTemplate(config.git.tagName, ctx);
  await run("git", ["tag", tagName]);
}

export async function gitPush(config: FullUserConfig, ctx: ReleaseContext) {
  const spinner = ora("Releasing…").start();
  const tagName = renderTemplate(config.git.tagName, ctx);
  await run("git", ["push"]);
  await run("git", ["push", "origin", `refs/tags/${tagName}`]);
  spinner.stop();
}
