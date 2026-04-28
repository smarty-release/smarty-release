import { createSpinner } from "nanospinner";

import { resolveConfig } from "./config/resolve.ts";
import type { InlineConfig, ResolvedConfig } from "./config/types.ts";
import { HOOKS } from "./constants.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";
import {
  bump,
  confirmChangelog,
  createContext,
  genChangelog,
  gitAdd,
  gitCommit,
  gitPush,
  gitTag,
  selectTag,
  selectVersion,
  summary,
} from "./steps/index.ts";
import { runHook } from "./utils/hook.ts";
import { effect, gitReset } from "./utils/index.ts";
import { withTimer } from "./utils/timer.ts";
import { hasChangelog } from "./utils/type.ts";

export async function release(inlineConfig: InlineConfig = {}) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig(inlineConfig);
  // 验证git仓库状态
  await checkGitRepoStatus(config);
  const context = await createContext(config);

  try {
    await withTimer(async () => {
      // 流程开始

      await effect(config, `run hook ${HOOKS.BEFORE_INIT}`, async () => {
        await runHook(
          HOOKS.BEFORE_INIT,
          config.hooks?.[HOOKS.BEFORE_INIT],
          context,
        );
      });

      // 选择版本
      await effect(
        config,
        `run hook ${HOOKS.BEFORE_SELECT_VERSION}`,
        async () => {
          await runHook(
            HOOKS.BEFORE_SELECT_VERSION,
            config.hooks?.[HOOKS.BEFORE_SELECT_VERSION],
            context,
          );
        },
      );

      await selectVersion(config, context);

      await effect(
        config,
        `run hook ${HOOKS.AFTER_SELECT_VERSION}`,
        async () => {
          await runHook(
            HOOKS.AFTER_SELECT_VERSION,
            config.hooks?.[HOOKS.AFTER_SELECT_VERSION],
            context,
          );
        },
      );

      // 选择tag
      await effect(config, `run hook ${HOOKS.BEFORE_SELECT_TAG}`, async () => {
        await runHook(
          HOOKS.BEFORE_SELECT_TAG,
          config.hooks?.[HOOKS.BEFORE_SELECT_TAG],
          context,
        );
      });

      await selectTag(config, context);

      await effect(config, `run hook ${HOOKS.AFTER_SELECT_TAG}`, async () => {
        await runHook(
          HOOKS.AFTER_SELECT_TAG,
          config.hooks?.[HOOKS.AFTER_SELECT_TAG],
          context,
        );
      });

      // 变更日志
      if (hasChangelog(config)) {
        await effect(config, `run hook ${HOOKS.BEFORE_CHANGELOG}`, async () => {
          await runHook(
            HOOKS.BEFORE_CHANGELOG,
            config.hooks?.[HOOKS.BEFORE_CHANGELOG],
            context,
          );
        });

        await genChangelog(config, context);

        await effect(config, `run hook ${HOOKS.AFTER_CHANGELOG}`, async () => {
          await runHook(
            HOOKS.AFTER_CHANGELOG,
            config.hooks?.[HOOKS.AFTER_CHANGELOG],
            context,
          );
        });
        await confirmChangelog(context);
      }

      // bump
      await effect(config, `run hook ${HOOKS.BEFORE_BUMP}`, async () => {
        await runHook(
          HOOKS.BEFORE_BUMP,
          config.hooks?.[HOOKS.BEFORE_BUMP],
          context,
        );
      });

      await effect(
        config,
        `bump version: ${context.latestVersion} → ${context.version}`,
        async () => {
          await bump(config, context);
        },
      );

      await effect(config, `run hook ${HOOKS.AFTER_BUMP}`, async () => {
        await runHook(
          HOOKS.AFTER_BUMP,
          config.hooks?.[HOOKS.AFTER_BUMP],
          context,
        );
      });

      // 总结阶段
      await summary(context);

      await effect(config, `run git operations and related hooks`, async () => {
        const spinner = createSpinner("Releasing…").start();

        // git系列
        await runHook(
          HOOKS.BEFORE_GIT,
          config.hooks?.[HOOKS.BEFORE_GIT],
          context,
        );
        // git 具体步骤
        await runHook(
          HOOKS.BEFORE_GIT_ADD,
          config.hooks?.[HOOKS.BEFORE_GIT_ADD],
          context,
        );
        await gitAdd();
        await runHook(
          HOOKS.AFTER_GIT_ADD,
          config.hooks?.[HOOKS.AFTER_GIT_ADD],
          context,
        );
        await runHook(
          HOOKS.BEFORE_GIT_COMMIT,
          config.hooks?.[HOOKS.BEFORE_GIT_COMMIT],
          context,
        );
        await gitCommit(config, context);
        await runHook(
          HOOKS.AFTER_GIT_COMMIT,
          config.hooks?.[HOOKS.AFTER_GIT_COMMIT],
          context,
        );

        await runHook(
          HOOKS.BEFORE_GIT_TAG,
          config.hooks?.[HOOKS.BEFORE_GIT_TAG],
          context,
        );
        await gitTag(context);
        await runHook(
          HOOKS.AFTER_GIT_TAG,
          config.hooks?.[HOOKS.AFTER_GIT_TAG],
          context,
        );

        await runHook(
          HOOKS.BEFORE_GIT_PUSH,
          config.hooks?.[HOOKS.BEFORE_GIT_PUSH],
          context,
        );
        await gitPush(context);
        await runHook(
          HOOKS.AFTER_GIT_PUSH,
          config.hooks?.[HOOKS.AFTER_GIT_PUSH],
          context,
        );

        await runHook(
          HOOKS.AFTER_GIT,
          config.hooks?.[HOOKS.AFTER_GIT],
          context,
        );

        // 流程走完之后
        await runHook(
          HOOKS.AFTER_RELEASE,
          config.hooks?.[HOOKS.AFTER_RELEASE],
          context,
        );
        spinner.stop();
      });
    });
  } catch (err) {
    await effect(config, `run git reset`, async () => {
      await gitReset(context); // 回滚
    });

    throw err;
  }
}
