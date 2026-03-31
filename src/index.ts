import { runHook } from "./hooks.js";
import { formatDuration, createTimer } from "./timer.js";
import { logger } from "./utils/index.js";
import { merge } from "lodash-es";
import defaultsConf, { type Config } from "./defaults.js";

export async function release(config: Partial<Config> = {}) {
  config = merge({}, defaultsConf, config) as Config;

  const ctx = await collectContext(config);
  const timer = createTimer();

  // 流程开始
  await runHook(config.hooks?.["before:init"], ctx);
  // 选择版本
  await runHook(config.hooks?.["before:selectVersion"], ctx);
  await selectVersion(config, ctx);
  await runHook(config.hooks?.["after:selectVersion"], ctx);

  // 选择tag
  await runHook(config.hooks?.["before:selectTag"], ctx);
  await selectTag(config, ctx);
  await runHook(config.hooks?.["after:selectTag"], ctx);

  // 变更日志
  if (!config.changelog.disable) {
    await runHook(config.hooks?.["before:changelog"], ctx);
    await genChangelog(config, ctx);
    await runHook(config.hooks?.["after:changelog"], ctx);
  }
  // bump
  await runHook(config.hooks?.["before:bump"], ctx);
  await bump(config, ctx);
  await runHook(config.hooks?.["after:bump"], ctx);

  // 总结阶段
  await summary(config, ctx);
  // git系列
  await runHook(config.hooks?.["before:git"], ctx);

  // git 具体步骤
  await runHook(config.hooks?.["before:git.add"], ctx);
  await gitAdd(config, ctx);
  await runHook(config.hooks?.["after:git.add"], ctx);

  await runHook(config.hooks?.["before:git.commit"], ctx);
  await gitCommit(config, ctx);
  await runHook(config.hooks?.["after:git.commit"], ctx);

  await runHook(config.hooks?.["before:git.tag"], ctx);
  await gitTag(config, ctx);
  await runHook(config.hooks?.["after:git.tag"], ctx);

  await runHook(config.hooks?.["before:git.push"], ctx);
  await gitPush(config, ctx);
  await runHook(config.hooks?.["after:git.push"], ctx);

  await runHook(config.hooks?.["after:git"], ctx);

  // 流程走完之后
  await runHook(config.hooks?.["after:release"], ctx);

  const cost = formatDuration(timer.end());
  logger.log(chalk.green(`🎉 Released successfully! (in ${cost})`));
}
