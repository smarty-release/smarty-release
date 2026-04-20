import { resolveConfig } from "./config/resolve.ts";
import { ResolvedConfig } from "./config/types.ts";
import { runGitCliff } from "./git-cliff.ts";
import { checkGitRepoStatus } from "./steps/checkGitRepoStatus.ts";

export async function changelog(args: string[]) {
  // 处理参数
  const config: ResolvedConfig = await resolveConfig();
  // 验证git仓库状态
  await checkGitRepoStatus(config);

  if (config.git.changelog === false) return;

  config.git.changelog.args = args;

  // 开始调用git-cliff
  await runGitCliff(config.git.changelog);
}
