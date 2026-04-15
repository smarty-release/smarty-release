import { ResolvedConfig } from "../config/types.ts";
import {
  getGitCurrentBranch,
  getGitRemoteUrl,
  hasGit,
  isGitClean,
  isGitRepo,
} from "../utils/index.ts";
import {
  NotGitRepoError,
  GitDirtyError,
  NotAllowedBranchError,
  GitNotInstalledError,
  GitRemoteNotFoundError,
} from "../errors.js";

export async function checkGitRepoStatus(config: ResolvedConfig) {
  let { cwd } = config;
  // 检查是否安装过了git
  const isGitInstalled = await hasGit();
  if (!isGitInstalled) throw new GitNotInstalledError();
  // 检查是否是一个git仓库
  const isRepo = await isGitRepo(cwd);
  if (!isRepo) throw new NotGitRepoError();
  // 检查是否是一个干净的Git仓库
  const isClean = await isGitClean(cwd);
  if (!isClean) throw new GitDirtyError();
  // 获取远程提交地址
  const remoteUrl = getGitRemoteUrl(cwd);
  if (!remoteUrl) throw new GitRemoteNotFoundError();
}
