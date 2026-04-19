import { confirm } from "@inquirer/prompts";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import {
  gitReset,
  gitChangeset,
  blank,
  renderTemplate,
} from "../utils/index.js";
import { logger } from "../utils/index.js";
import chalk from "chalk";

export async function summary(config: ResolvedConfig, ctx: ReleaseContext) {
  const tagName = renderTemplate(config.git.tagName, ctx);

  const entries: [string, string][] = [
    ["Version", ctx.version],
    ["Npm Dist Tag", ctx.tag],
    ["Owner", ctx.repo.owner],
    ["Repository", ctx.repo.repository],
    ["Branch", ctx.git.branch],
    ["Git Tag", tagName],
  ];

  blank();
  logger.log(chalk.cyan("Summary:"));
  for (const [key, val] of entries) {
    logger.log(chalk.green(key.padEnd(20)), chalk.yellow(val));
  }
  blank();
  logger.log(chalk.cyan("Changeset:"));
  await gitChangeset(config.cwd);
  blank();

  const ok = await confirm({
    message: `Releasing v${ctx.version} on ${ctx.tag}. Confirm?`,
    default: false,
  });

  if (ok === false) {
    await gitReset(ctx);
    ctx.cancel();
  }
}
