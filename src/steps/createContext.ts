import {
  getGitCurrentBranch,
  getGitHead,
  getGitRemoteUrl,
  logger,
  matchBranch,
} from "../utils/index.js";
import hostedGitInfo from "hosted-git-info";
import semver from "semver";
import { InternalReleaseContext, ResolvedConfig } from "../config/types.ts";
import {
  CancelledError,
  GitBranchError,
  GitRemoteParseError,
  NotAllowedBranchError,
} from "../errors.ts";
import { readPackageJSON } from "pkg-types";

export async function createContext(
  config: ResolvedConfig,
): Promise<InternalReleaseContext> {
  const context: InternalReleaseContext = Object.create(null);

  await collectGitContext(config, context);
  await collectRepoContext(context);
  await collectPackageContext(config, context);

  context.initialRef = await getGitHead();

  return {
    ...context,
    logger,
    cancel(message?: string) {
      throw new CancelledError(message);
    },
  };
}

async function collectPackageContext(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  const pkg = await readPackageJSON(config.cwd);

  if (!pkg.name || pkg.name.trim() === "") {
    throw new Error(`package.json "name" must be a non-empty string.`);
  }

  if (!pkg.version || !semver.valid(pkg.version)) {
    throw new Error(`package.json "version" must be a valid semver version.`);
  }

  // 赋值给上下文
  context.name = pkg.name;
  context.latestVersion = pkg.version;
}

async function collectGitContext(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  const { requireBranch } = config.git;

  try {
    context.branchName = await getGitCurrentBranch();
  } catch (err) {
    throw new GitBranchError();
  }

  if (!requireBranch) return; // 不需要校验分支 -> 直接跳过 git IO
  if (!matchBranch(requireBranch, context.branchName)) {
    throw new NotAllowedBranchError(
      `Release is only allowed on ${String(requireBranch)}, current: ${context.branchName}`,
    );
  }
}

async function collectRepoContext(context: InternalReleaseContext) {
  const remoteUrl = await getGitRemoteUrl();

  const info = hostedGitInfo.fromUrl(remoteUrl);

  if (!info) throw new GitRemoteParseError();
  const { user, project } = info;
  // 赋值给上下文
  context.repo = {
    ...context.repo,
    owner: user,
    repository: project,
  };
}
