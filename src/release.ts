import { createHookContext, runHook } from "./utils/hooks.ts";
import { withTimer } from "./utils/timer.ts";
import type { InlineConfig, ResolvedConfig } from "./config/types.ts";
import { resolveConfig } from "./config/resolve.ts";
import {
  createContext,
  selectVersion,
  selectTag,
  genChangelog,
} from "./steps/index.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";

export async function release(inlineConfig: InlineConfig = {}) {
  await withTimer("Released", async () => {
    // 处理参数
    const config: ResolvedConfig = await resolveConfig(inlineConfig);

    // 验证git仓库状态
    // await checkGitRepoStatus(config);
    const ctx = await createContext(config);
    const hookCtx = createHookContext(ctx);

    // 流程开始
    await runHook(config.hooks?.["before:init"], hookCtx);
    // 选择版本
    await runHook(config.hooks?.["before:selectVersion"], hookCtx);
    await selectVersion(config, hookCtx);
    await runHook(config.hooks?.["after:selectVersion"], hookCtx);

    // 选择tag
    await runHook(config.hooks?.["before:selectTag"], hookCtx);
    await selectTag(config, hookCtx);
    await runHook(config.hooks?.["after:selectTag"], hookCtx);

    // 变更日志
    if (config.git.changelog !== false) {
      await runHook(config.hooks?.["before:changelog"], hookCtx);
      await genChangelog(config, hookCtx);
      await runHook(config.hooks?.["after:changelog"], hookCtx);
    }
    // // bump
    // await runHook(config.hooks?.["before:bump"], hookCtx);
    // await bump(config, hookCtx);
    // await runHook(config.hooks?.["after:bump"], hookCtx);

    // // 总结阶段
    // await summary(config, hookCtx);
    // // git系列
    // await runHook(config.hooks?.["before:git"], hookCtx);

    // // git 具体步骤
    // await runHook(config.hooks?.["before:git.add"], hookCtx);
    // await gitAdd(config, hookCtx);
    // await runHook(config.hooks?.["after:git.add"], hookCtx);

    // await runHook(config.hooks?.["before:git.commit"], hookCtx);
    // await gitCommit(config, hookCtx);
    // await runHook(config.hooks?.["after:git.commit"], hookCtx);

    // await runHook(config.hooks?.["before:git.tag"], hookCtx);
    // await gitTag(config, hookCtx);
    // await runHook(config.hooks?.["after:git.tag"], hookCtx);

    // await runHook(config.hooks?.["before:git.push"], hookCtx);
    // await gitPush(config, hookCtx);
    // await runHook(config.hooks?.["after:git.push"], hookCtx);

    // await runHook(config.hooks?.["after:git"], hookCtx);

    // // 流程走完之后
    // await runHook(config.hooks?.["after:release"], hookCtx);
  });
}
