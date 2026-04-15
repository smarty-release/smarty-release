import {
  getGitCurrentBranch,
  getGitRemoteUrl,
  matchBranch,
} from "../utils/index.js";
import hostedGitInfo from "hosted-git-info";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ReleaseContext, ResolvedConfig } from "../config/types.ts";
import { GitRemoteParseError, NotAllowedBranchError } from "../errors.ts";
import type { PackageJson } from "pkg-types";

export async function createContext(
  config: ResolvedConfig,
): Promise<ReleaseContext> {
  const ctx: ReleaseContext = Object.create(null);

  await collectGitContext(config, ctx);
  await collectRepoContext(config, ctx);
  await collectPackageContext(config, ctx);

  return ctx;
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
    );
  }

  if (!pkg.version || typeof pkg.version !== "string") {
    throw new Error(`package.json does not contain a valid "version" field.`);
  }

  Object.assign(ctx, {
    name: pkg.name,
    version: pkg.version,
  });
}

async function collectGitContext(config: ResolvedConfig, ctx: ReleaseContext) {
  const branch = await getGitCurrentBranch(config.cwd);

  ctx.git.branch = branch;

  await assertAllowedBranch(config, ctx);
}

async function collectRepoContext(config: ResolvedConfig, ctx: ReleaseContext) {
  const remoteUrl = await getGitRemoteUrl(config.cwd);

  const info = hostedGitInfo.fromUrl(remoteUrl);

  if (!info) throw new GitRemoteParseError();

  ctx.repo.owner = info.user;
  ctx.repo.repository = info.project;
}

async function assertAllowedBranch(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  let { git } = config;

  const { requireBranch } = git;

  if (requireBranch === false) return;

  const currentBranch = ctx.git.branch;

  if (currentBranch === undefined) return;

  if (!matchBranch(requireBranch, currentBranch)) {
    throw new NotAllowedBranchError(
      `Release is only allowed on ${String(requireBranch)}, current: ${currentBranch}`,
    );
  }
}
