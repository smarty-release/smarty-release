import { checkGitRepoStatus, matchBranch } from "../utils/index.js";
import {
  NotGitRepoError,
  GitDirtyError,
  NotAllowedBranchError,
} from "../errors.js";
import { execa } from "execa";
import hostedGitInfo from "hosted-git-info";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ReleaseContext, ResolvedConfig, UserConfig } from "../config/types.ts";
import { isUndefined } from "lodash-es";
import { RequiredDeep } from "type-fest";

export async function collectContext(
  config: ResolvedConfig,
): Promise<ReleaseContext> {
  const ctx: ReleaseContext = {
    cwd: process.cwd(),
    env: process.env,
  };

  const { isGitRepo, isClean } = await checkGitRepoStatus();

  if (!isGitRepo) throw new NotGitRepoError();
  if (!isClean) throw new GitDirtyError();

  await collectGitContext(config, ctx);
  await collectRepoContext(config, ctx);
  await collectPackageContext(config, ctx);

  return ctx;
}

async function collectPackageContext(
  _config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  const pkgPath = resolve(ctx.cwd!, "package.json");

  let pkg;
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
  console.log(config);

  console.log("--------------");

  const { stdout: branch } = await execa("git", [
    "rev-parse",
    "--abbrev-ref",
    "HEAD",
  ]);

  Object.assign((ctx.git ??= {}), {
    branch,
  });

  await assertAllowedBranch(config, ctx);
}

async function collectRepoContext(config: ResolvedConfig, ctx: ReleaseContext) {
  let remoteUrl;

  try {
    const { stdout } = await execa("git", ["remote", "get-url", "origin"]);
    remoteUrl = stdout.trim();
  } catch {
    return;
  }

  const info = hostedGitInfo.fromUrl(remoteUrl);
  if (!info) return; // 这里应该直接报错
  console.log("----------------------");
  console.log(info);
  console.log("----------------------");

  Object.assign((ctx.repo ??= {}), {
    repository: info.project,
    owner: info.user,
  });
}

async function assertAllowedBranch(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  const { requireBranch } = config.git;

  if (requireBranch === false) return;

  const currentBranch = ctx.git!.branch;
  if (isUndefined(currentBranch)) {
    return;
  }

  if (!matchBranch(requireBranch, currentBranch)) {
    throw new NotAllowedBranchError(
      `Release is only allowed on ${String(requireBranch)}, current: ${currentBranch}`,
    );
  }
}
