import {
  getGitCurrentBranch,
  getGitRemoteUrl,
  logger,
  matchBranch,
} from "../utils/index.js";
import hostedGitInfo from "hosted-git-info";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ReleaseContext, ResolvedConfig } from "../config/types.ts";
import {
  CancelledError,
  GitRemoteParseError,
  NotAllowedBranchError,
} from "../errors.ts";
import type { PackageJson } from "pkg-types";

export async function createContext(
  config: ResolvedConfig,
): Promise<ReleaseContext> {
  const ctx: ReleaseContext = Object.create(null);

  await collectGitContext(config, ctx);
  await collectRepoContext(config, ctx);
  await collectPackageContext(config, ctx);

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
  const pkgPath = resolve(config.cwd, "package.json");

  let pkg: PackageJson;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch (err) {
    throw new Error(
      `Cannot read package.json in current directory: ${pkgPath}\n` +
        `Please run this command in a Node.js project root.`,
      { cause: err },
    );
  }

  if (!pkg.version || typeof pkg.version !== "string") {
    throw new Error(`package.json does not contain a valid "version" field.`);
  }

  if (!pkg.name || typeof pkg.name !== "string") {
    throw new Error(`package.json does not contain a valid "name" field.`);
  }

  // 赋值给上下文
  ctx.name = pkg.name;
  ctx.version = pkg.version;
}

async function collectGitContext(config: ResolvedConfig, ctx: ReleaseContext) {
  const { requireBranch } = config.git;

  const branch = await getGitCurrentBranch(config.cwd);
  ctx.git = {
    ...ctx.git,
    branch,
  };

  if (!requireBranch) return; // 不需要校验分支 -> 直接跳过 git IO
  if (!matchBranch(requireBranch, branch)) {
    throw new NotAllowedBranchError(
      `Release is only allowed on ${String(requireBranch)}, current: ${branch}`,
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
