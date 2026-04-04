import { runHook } from "./utils/hooks.ts";
import { formatDuration, createTimer } from "./utils/timer.ts";
import { logger } from "./utils/index.ts";
import { merge } from "lodash-es";
import defaultsConf from "./config/defaults.ts";
import chalk from "chalk";
import type { UserConfig, ReleaseContext } from "./config/types.ts";

import {
  selectVersion,
  selectTag,
  bump,
  gitAdd,
  gitCommit,
  gitTag,
  gitPush,
  collectContext,
  summary,
  genChangelog,
} from "./steps/index.ts";

export async function release(config: UserConfig = {}) {
  const resolvedConfig = merge({}, defaultsConf, config);

  const ctx: ReleaseContext = await collectContext(resolvedConfig);
  const timer = createTimer();

  // 流程开始
  await runHook(resolvedConfig.hooks?.["before:init"], ctx);
  // 选择版本
  await runHook(resolvedConfig.hooks?.["before:selectVersion"], ctx);
  await selectVersion(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:selectVersion"], ctx);

  // 选择tag
  await runHook(resolvedConfig.hooks?.["before:selectTag"], ctx);
  await selectTag(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:selectTag"], ctx);

  // 变更日志
  if (resolvedConfig.changelog) {
    await runHook(resolvedConfig.hooks?.["before:changelog"], ctx);
    await genChangelog(resolvedConfig, ctx);
    await runHook(resolvedConfig.hooks?.["after:changelog"], ctx);
  }
  // bump
  await runHook(resolvedConfig.hooks?.["before:bump"], ctx);
  await bump(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:bump"], ctx);

  // 总结阶段
  await summary(resolvedConfig, ctx);
  // git系列
  await runHook(resolvedConfig.hooks?.["before:git"], ctx);

  // git 具体步骤
  await runHook(resolvedConfig.hooks?.["before:git.add"], ctx);
  await gitAdd(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:git.add"], ctx);

  await runHook(resolvedConfig.hooks?.["before:git.commit"], ctx);
  await gitCommit(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:git.commit"], ctx);

  await runHook(resolvedConfig.hooks?.["before:git.tag"], ctx);
  await gitTag(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:git.tag"], ctx);

  await runHook(resolvedConfig.hooks?.["before:git.push"], ctx);
  await gitPush(resolvedConfig, ctx);
  await runHook(resolvedConfig.hooks?.["after:git.push"], ctx);

  await runHook(resolvedConfig.hooks?.["after:git"], ctx);

  // 流程走完之后
  await runHook(resolvedConfig.hooks?.["after:release"], ctx);

  const cost = formatDuration(timer.end());
  logger.log(chalk.green(`🎉 Released successfully! (in ${cost})`));
}
