import { resolveConfig } from "./config/resolve.ts";
import { ResolvedConfig, InlineConfig } from "./config/types.ts";
import { runGitCliff } from "./git-cliff.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";
import { logger } from "./utils/index.ts";

export async function changelog(
  inlineConfig: InlineConfig = {},
  args: string[],
) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig(inlineConfig);

  // 验证git仓库状态
  // await checkGitRepoStatus(config);

  if (config.git.changelog === false) {
    logger.warn("Changelog generation is disabled.");
    return;
  }

  config.git.changelog.args = args;

  // 开始调用git-cliff
  // await runGitCliff(config.git.changelog);
}
