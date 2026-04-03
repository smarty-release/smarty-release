import { execa, type Options, ResultPromise } from "execa";
import { createConsola } from "consola";
import { NAME } from "../constants/index.js";
import { ReleaseContext, UserConfig } from "../config/types.ts";

type RequireBranch = NonNullable<
  NonNullable<UserConfig["git"]>["requireBranch"]
>;

export const run = (
  bin: string,
  args: readonly string[] = [],
  opts: Options = {},
): ResultPromise => execa(bin, args, { stdio: "pipe", ...opts });

export const logger = createConsola({
  defaults: {
    tag: NAME,
  },
});

export async function gitChangeset(cwd = process.cwd()) {
  await run("git", ["status", "--porcelain"], { stdio: "inherit", cwd });
}

/**
 * 判断当前目录是否是一个干净的 git 仓库
 */
export async function checkGitRepoStatus(cwd = process.cwd()) {
  // 1. 是否是 git 仓库
  try {
    await execa("git", ["rev-parse", "--is-inside-work-tree"], { cwd });
  } catch {
    return {
      isGitRepo: false,
      isClean: false,
    };
  }

  // 2. 是否干净
  const { stdout } = await execa("git", ["status", "--porcelain"], { cwd });

  return {
    isGitRepo: true,
    isClean: stdout.trim().length === 0,
  };
}

export async function workerDirRestore(cwd = process.cwd()) {
  await run("git", ["restore", "."], { cwd });
  await run("git", ["clean", "-f"], { cwd });
}

export function renderTemplate(template: string, ctx: ReleaseContext): string {
  if (!template || typeof template !== "string") return template;

  return template.replace(/\$\{([^}]+)\}/g, (_, expr: string) => {
    const value = expr.split(".").reduce<any>((acc, key) => acc?.[key], ctx);

    if (value == null) {
      throw new Error(`Template variable "${expr}" is not defined`);
    }

    return String(value);
  });
}

export function blank(lines: number = 1): void {
  process.stdout.write("\n".repeat(lines));
}

export function matchBranch(rule: RequireBranch, current: string): boolean {
  if (rule === false) return true;

  if (typeof rule === "string") {
    return current === rule;
  }

  if (Array.isArray(rule)) {
    return rule.includes(current);
  }

  if (rule instanceof RegExp) {
    return rule.test(current);
  }

  return false;
}
