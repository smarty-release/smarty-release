import { withTimer } from "./utils/timer.ts";
import type { InlineConfig, ResolvedConfig } from "./config/types.ts";
import { resolveConfig } from "./config/resolve.ts";
import {
  createContext,
  selectVersion,
  selectTag,
  genChangelog,
  bump,
  gitAdd,
  gitCommit,
  summary,
  gitTag,
  gitPush,
  confirmChangelog,
} from "./steps/index.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";
import { hasChangelog } from "./utils/type.ts";
import { effect, gitReset } from "./utils/index.ts";
import { runHook } from "./utils/hook.ts";

export async function release(inlineConfig: InlineConfig = {}) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig(inlineConfig);
  // 验证git仓库状态
  await checkGitRepoStatus(config);
  const context = await createContext(config);

  try {
    await withTimer(async () => {
      // 流程开始

      await effect(config, `run hook before:init`, async () => {
        await runHook(config.hooks?.["before:init"], context);
      });

      // 选择版本
      await effect(config, `run hook before:selectVersion`, async () => {
        await runHook(config.hooks?.["before:selectVersion"], context);
      });

      await selectVersion(config, context);

      await effect(config, `run hook after:selectVersion`, async () => {
        await runHook(config.hooks?.["after:selectVersion"], context);
      });

      // 选择tag

      await effect(config, `run hook before:selectTag`, async () => {
        await runHook(config.hooks?.["before:selectTag"], context);
      });

      await selectTag(config, context);

      await effect(config, `run hook after:selectTag`, async () => {
        await runHook(config.hooks?.["after:selectTag"], context);
      });

      // 变更日志
      if (hasChangelog(config)) {
        await effect(config, `run hook before:changelog`, async () => {
          await runHook(config.hooks?.["before:changelog"], context);
        });

        await genChangelog(config, context);

        await effect(config, `run hook after:changelog`, async () => {
          await runHook(config.hooks?.["after:changelog"], context);
        });
        await confirmChangelog(context);
      }

      // bump
      await effect(config, `run hook before:bump`, async () => {
        await runHook(config.hooks?.["before:bump"], context);
      });

      await effect(
        config,
        `bump version: ${context.latestVersion} → ${context.version}`,
        async () => {
          await bump(config, context);
        },
      );

      await effect(config, `run hook after:bump`, async () => {
        await runHook(config.hooks?.["after:bump"], context);
      });

      // 总结阶段
      await summary(context);

      await effect(config, `run git operations and related hooks`, async () => {
        // git系列
        await runHook(config.hooks?.["before:git"], context);
        // git 具体步骤
        await runHook(config.hooks?.["before:git.add"], context);
        await gitAdd();
        await runHook(config.hooks?.["after:git.add"], context);

        await runHook(config.hooks?.["before:git.commit"], context);
        await gitCommit(config, context);
        await runHook(config.hooks?.["after:git.commit"], context);

        await runHook(config.hooks?.["before:git.tag"], context);
        await gitTag(config, context);
        await runHook(config.hooks?.["after:git.tag"], context);

        await runHook(config.hooks?.["before:git.push"], context);
        await gitPush(config, context);
        await runHook(config.hooks?.["after:git.push"], context);

        await runHook(config.hooks?.["after:git"], context);

        // 流程走完之后
        await runHook(config.hooks?.["after:release"], context);
      });
    });
  } catch (err) {
    await effect(config, `run git reset`, async () => {
      await gitReset(context); // 回滚
    });

    throw err;
  }
}
