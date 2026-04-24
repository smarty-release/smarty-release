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
import { effect, gitReset, runHook } from "./utils/index.ts";

export async function release(inlineConfig: InlineConfig = {}) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig(inlineConfig);
  // 验证git仓库状态
  await checkGitRepoStatus(config);
  const ctx = await createContext(config);

  try {
    await withTimer(async () => {
      // 流程开始

      await effect(config, `run hook before:init`, async () => {
        await runHook(config.hooks?.["before:init"], ctx);
      });

      // 选择版本
      await effect(config, `run hook before:selectVersion`, async () => {
        await runHook(config.hooks?.["before:selectVersion"], ctx);
      });

      await selectVersion(config, ctx);

      await effect(config, `run hook after:selectVersion`, async () => {
        await runHook(config.hooks?.["after:selectVersion"], ctx);
      });

      // 选择tag

      await effect(config, `run hook before:selectTag`, async () => {
        await runHook(config.hooks?.["before:selectTag"], ctx);
      });

      await selectTag(config, ctx);

      await effect(config, `run hook after:selectTag`, async () => {
        await runHook(config.hooks?.["after:selectTag"], ctx);
      });

      // 变更日志
      if (hasChangelog(config)) {
        await effect(config, `run hook before:changelog`, async () => {
          await runHook(config.hooks?.["before:changelog"], ctx);
        });

        await effect(config, `generate changelog`, async () => {
          await genChangelog(config, ctx);
        });

        await effect(config, `run hook after:changelog`, async () => {
          await runHook(config.hooks?.["after:changelog"], ctx);
        });

        await confirmChangelog(ctx);
      }

      // bump
      await effect(config, `run hook before:bump`, async () => {
        await runHook(config.hooks?.["before:bump"], ctx);
      });

      await effect(
        config,
        `bump version: ${ctx.latestVersion} → ${ctx.version}`,
        async () => {
          await bump(config, ctx);
        },
      );

      await effect(config, `run hook after:bump`, async () => {
        await runHook(config.hooks?.["after:bump"], ctx);
      });

      // 总结阶段
      await summary(config, ctx);

      await effect(config, `run git operations and related hooks`, async () => {
        // git系列
        await runHook(config.hooks?.["before:git"], ctx);
        // git 具体步骤
        await runHook(config.hooks?.["before:git.add"], ctx);
        await gitAdd();
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
      });
    });
  } catch (err) {
    await effect(config, `run git reset`, async () => {
      await gitReset(ctx); // 回滚
    });

    throw err;
  }
}
