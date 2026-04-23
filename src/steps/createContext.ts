import {
  getGitCurrentBranch,
  getGitHead,
  getGitRemoteUrl,
  logger,
  matchBranch,
} from "../utils/index.js";
import hostedGitInfo from "hosted-git-info";
import semver from "semver";
import { ReleaseContext, ResolvedConfig } from "../config/types.ts";
import {
  CancelledError,
  GitBranchError,
  GitRemoteParseError,
  NotAllowedBranchError,
} from "../errors.ts";
import { readPackageJSON } from "pkg-types";

export async function createContext(
  config: ResolvedConfig,
): Promise<ReleaseContext> {
  const ctx: ReleaseContext = Object.create(null);

  await collectGitContext(config, ctx);
  await collectRepoContext(config, ctx);
  await collectPackageContext(config, ctx);

  const initialRef = await getGitHead();
  ctx._initialRef = initialRef;

  return {
    ...ctx,
    logger,
    cancel(message?: string) {
      throw new CancelledError(message);
    },
  };
}

async function collectPackageContext(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  const pkg = await readPackageJSON(config.cwd);

  if (!pkg.name || pkg.name.trim() === "") {
    throw new Error(`package.json "name" must be a non-empty string.`);
  }

  if (!pkg.version || !semver.valid(pkg.version)) {
    throw new Error(`package.json "version" must be a valid semver version.`);
  }

  // 赋值给上下文
  ctx.name = pkg.name;
  ctx.latestVersion = pkg.version;
}

async function collectGitContext(config: ResolvedConfig, ctx: ReleaseContext) {
  const { requireBranch } = config.git;

  try {
    ctx.branchName = await getGitCurrentBranch();
  } catch (err) {
    throw new GitBranchError();
  }

  if (!requireBranch) return; // 不需要校验分支 -> 直接跳过 git IO
  if (!matchBranch(requireBranch, ctx.branchName)) {
    throw new NotAllowedBranchError(
      `Release is only allowed on ${String(requireBranch)}, current: ${ctx.branchName}`,
    );
  }
}

async function collectRepoContext(config: ResolvedConfig, ctx: ReleaseContext) {
  const remoteUrl = await getGitRemoteUrl(config.cwd);

  const info = hostedGitInfo.fromUrl(remoteUrl);

  if (!info) throw new GitRemoteParseError();
  const { user, project } = info;
  // 赋值给上下文
  ctx.repo = {
    ...ctx.repo,
    owner: user,
    repository: project,
  };
}
