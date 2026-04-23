import { confirm } from "@inquirer/prompts";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { gitReset, gitChangeset, blank } from "../utils/index.js";
import { logger } from "../utils/index.js";
import chalk from "chalk";

export async function summary(config: ResolvedConfig, ctx: ReleaseContext) {
  const summary = {
    Version: ctx.version,
    "Npm Dist Tag": ctx.tag,
    Owner: ctx.repo.owner,
    Repository: ctx.repo.repository,
    Branch: ctx.branchName,
    "Git Tag": ctx.git.tagName,
  };

  await renderSection("Summary:", () => {
    renderKeyValue(summary);
  });

  await renderSection("Changeset:", async () => {
    await gitChangeset();
  });

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

function renderSection(title: string, fn: () => Promise<void> | void) {
  blank();
  logger.log(chalk.cyan(title));
  return fn();
}

function renderKeyValue(data: Record<string, string>) {
  const maxKeyLength = Math.max(...Object.keys(data).map((k) => k.length));

  for (const [key, val] of Object.entries(data)) {
    logger.log(chalk.green(key.padEnd(maxKeyLength + 2)), chalk.yellow(val));
  }
}
