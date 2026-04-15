import { runHook } from "./utils/hooks.ts";
// import { formatDuration, createTimer } from "./utils/timer.ts";
// import { logger } from "./utils/index.ts";
import chalk from "chalk";
import type {
  ReleaseContext,
  InlineConfig,
  ResolvedConfig,
} from "./config/types.ts";
import { resolveConfig } from "./config/resolve.ts";
import { createContext } from "./steps/index.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";

export async function release(inlineConfig: InlineConfig = {}) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig(inlineConfig);

  // 验证git仓库状态
  await checkGitRepoStatus(config);

  const ctx: ReleaseContext = await createContext(config);

  console.log(ctx);

  // const timer = createTimer();

  // // 流程开始
  // await runHook(config.hooks?.["before:init"], ctx);
  // // 选择版本
  // await runHook(resolvedConfig.hooks?.["before:selectVersion"], ctx);
  // await selectVersion(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:selectVersion"], ctx);

  // // 选择tag
  // await runHook(resolvedConfig.hooks?.["before:selectTag"], ctx);
  // await selectTag(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:selectTag"], ctx);

  // // 变更日志
  // if (hasChangelog(resolvedConfig)) {
  //   await runHook(resolvedConfig.hooks?.["before:changelog"], ctx);
  //   await genChangelog(resolvedConfig, ctx);
  //   await runHook(resolvedConfig.hooks?.["after:changelog"], ctx);
  // }
  // // bump
  // await runHook(resolvedConfig.hooks?.["before:bump"], ctx);
  // await bump(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:bump"], ctx);

  // // 总结阶段
  // await summary(resolvedConfig, ctx);
  // // git系列
  // await runHook(resolvedConfig.hooks?.["before:git"], ctx);

  // // git 具体步骤
  // await runHook(resolvedConfig.hooks?.["before:git.add"], ctx);
  // await gitAdd(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:git.add"], ctx);

  // await runHook(resolvedConfig.hooks?.["before:git.commit"], ctx);
  // await gitCommit(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:git.commit"], ctx);

  // await runHook(resolvedConfig.hooks?.["before:git.tag"], ctx);
  // await gitTag(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:git.tag"], ctx);

  // await runHook(resolvedConfig.hooks?.["before:git.push"], ctx);
  // await gitPush(resolvedConfig, ctx);
  // await runHook(resolvedConfig.hooks?.["after:git.push"], ctx);

  // await runHook(resolvedConfig.hooks?.["after:git"], ctx);

  // // 流程走完之后
  // await runHook(resolvedConfig.hooks?.["after:release"], ctx);

  // const cost = formatDuration(timer.end());
  // logger.log(chalk.green(`🎉 Released successfully! (in ${cost})`));
}
