import { resolveConfig } from "./config/resolve.ts";
import type { InlineConfig, ResolvedConfig } from "./config/types.ts";
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

      await effect(config, `run hook before:init`, async () => {
        await runHook("before:init", config.hooks?.["before:init"], context);
      });

      // 选择版本
      await effect(config, `run hook before:selectVersion`, async () => {
        await runHook(
          "before:selectVersion",
          config.hooks?.["before:selectVersion"],
          context,
        );
      });

      await selectVersion(config, context);

      await effect(config, `run hook after:selectVersion`, async () => {
        await runHook(
          "after:selectVersion",
          config.hooks?.["after:selectVersion"],
          context,
        );
      });

      // 选择tag
      await effect(config, `run hook before:selectTag`, async () => {
        await runHook(
          "before:selectTag",
          config.hooks?.["before:selectTag"],
          context,
        );
      });

      await selectTag(config, context);

      await effect(config, `run hook after:selectTag`, async () => {
        await runHook(
          "after:selectTag",
          config.hooks?.["after:selectTag"],
          context,
        );
      });

      // 变更日志
      if (hasChangelog(config)) {
        await effect(config, `run hook before:changelog`, async () => {
          await runHook(
            "before:changelog",
            config.hooks?.["before:changelog"],
            context,
          );
        });

        await genChangelog(config, context);

        await effect(config, `run hook after:changelog`, async () => {
          await runHook(
            "after:changelog",
            config.hooks?.["after:changelog"],
            context,
          );
        });
        await confirmChangelog(context);
      }

      // bump
      await effect(config, `run hook before:bump`, async () => {
        await runHook("before:bump", config.hooks?.["before:bump"], context);
      });

      await effect(
        config,
        `bump version: ${context.latestVersion} → ${context.version}`,
        async () => {
          await bump(config, context);
        },
      );

      await effect(config, `run hook after:bump`, async () => {
        await runHook("after:bump", config.hooks?.["after:bump"], context);
      });

      // 总结阶段
      await summary(context);

      await effect(config, `run git operations and related hooks`, async () => {
        // git系列
        await runHook("before:git", config.hooks?.["before:git"], context);
        // git 具体步骤
        await runHook(
          "before:git.add",
          config.hooks?.["before:git.add"],
          context,
        );
        await gitAdd();
        await runHook(
          "after:git.add",
          config.hooks?.["after:git.add"],
          context,
        );

        await runHook(
          "before:git.commit",
          config.hooks?.["before:git.commit"],
          context,
        );
        await gitCommit(config, context);
        await runHook(
          "after:git.commit",
          config.hooks?.["after:git.commit"],
          context,
        );

        await runHook(
          "before:git.tag",
          config.hooks?.["before:git.tag"],
          context,
        );
        await gitTag(context);
        await runHook(
          "after:git.tag",
          config.hooks?.["after:git.tag"],
          context,
        );

        await runHook(
          "before:git.push",
          config.hooks?.["before:git.push"],
          context,
        );
        await gitPush(context);
        await runHook(
          "after:git.push",
          config.hooks?.["after:git.push"],
          context,
        );

        await runHook("after:git", config.hooks?.["after:git"], context);

        // 流程走完之后
        await runHook(
          "after:release",
          config.hooks?.["after:release"],
          context,
        );
      });
    });
  } catch (err) {
    await effect(config, `run git reset`, async () => {
      await gitReset(context); // 回滚
    });

    throw err;
  }
}
