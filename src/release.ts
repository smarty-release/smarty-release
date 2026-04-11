import { runHook } from "./utils/hooks.ts";
import { formatDuration, createTimer } from "./utils/timer.ts";
import { logger } from "./utils/index.ts";
import defaultsConf from "./config/defaults.ts";
import chalk from "chalk";
import type { UserConfig, ReleaseContext } from "./config/types.ts";
import { merge } from "./config/merge.ts";

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
import { hasChangelog, ResolvedConfigWithChangelog } from "./utils/type.ts";

export async function release(config: UserConfig = {}) {
  // 1.合并参数
  const merged = merge(config, defaultsConf);

  console.log(merged);

  // // 2.验证参数合法性，比如用zod，valibot啥的

  // // 3.参数归一化处理,比如 args还有hooks里面的都最终要转成数组

  // // 4.验证仓库本地状态,比如当前仓库是否干净，是否是一个已经初始化的仓库，是否是一个已经提交到远程的库

  // const ctx: ReleaseContext = await collectContext(resolvedConfig);
  // const timer = createTimer();

  // // 流程开始
  // await runHook(resolvedConfig.hooks?.["before:init"], ctx);
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
