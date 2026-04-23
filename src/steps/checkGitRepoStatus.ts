import { ResolvedConfig } from "../config/types.ts";
import {
  effect,
  getGitRemoteUrl,
  hasGit,
  isGitClean,
  isGitRepo,
} from "../utils/index.ts";
import {
  NotGitRepoError,
  GitDirtyError,
  GitNotInstalledError,
  GitRemoteNotFoundError,
} from "../errors.js";

export async function checkGitRepoStatus(config: ResolvedConfig) {
  const { cwd } = config;
  // 检查是否安装过了git
  const isGitInstalled = await hasGit();
  if (!isGitInstalled) throw new GitNotInstalledError();
  // 检查是否是一个git仓库
  const isRepo = await isGitRepo(cwd);
  if (!isRepo) throw new NotGitRepoError();

  await effect(config, `check if working directory is clean`, async () => {
    // 检查是否是一个干净的Git仓库
    const isClean = await isGitClean(cwd);
    if (!isClean) throw new GitDirtyError();
  });

  // 获取远程提交地址
  const remoteUrl = getGitRemoteUrl(cwd);
  if (!remoteUrl) throw new GitRemoteNotFoundError();
}
