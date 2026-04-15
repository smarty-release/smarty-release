import { x } from "tinyexec";
import { createConsola } from "consola";
import { NAME } from "../constants.ts";
import { ReleaseContext, UserConfig } from "../config/types.ts";
import { access, constants } from "node:fs/promises";
import { createDefu } from "defu";

type RequireBranch = NonNullable<
  NonNullable<UserConfig["git"]>["requireBranch"]
>;

export async function run(
  bin: string,
  args: string[] = [],
  opts: { cwd?: string; stdio?: "pipe" | "inherit" } = {},
) {
  const { stdout, stderr, exitCode } = await x(bin, args, {
    nodeOptions: { cwd: opts.cwd, stdio: opts.stdio },
  });

  if (exitCode !== 0) {
    const err = new Error(stderr || `Command failed: ${bin}`);
    (err as any).exitCode = exitCode;
    throw err;
  }

  if (opts.stdio === "inherit") {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
  }

  return { stdout, stderr };
}

export const logger = createConsola({
  defaults: {
    tag: NAME,
  },
});

export const defu = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value; // 直接覆盖
    return true;
  }
});

export async function gitChangeset(cwd: string) {
  await run("git", ["status", "--porcelain"], { stdio: "inherit", cwd });
}

export async function isGitRepo(cwd: string) {
  try {
    const { stdout } = await run(
      "git",
      ["rev-parse", "--is-inside-work-tree"],
      {
        cwd,
      },
    );

    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

export async function isGitClean(cwd: string) {
  const { stdout } = await run("git", ["status", "--porcelain"], {
    cwd,
  });

  return stdout.trim().length === 0;
}

export async function workerDirRestore(cwd: string) {
  await run("git", ["restore", "."], { cwd });
  await run("git", ["clean", "-f"], { cwd });
}

export async function hasGit() {
  try {
    await run("git", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

export async function getGitRemoteUrl(cwd: string): Promise<string> {
  try {
    const { stdout } = await run("git", ["remote", "get-url", "origin"], {
      cwd,
    });
    return stdout.trim();
  } catch {
    return "";
  }
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

export async function fileExists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getGitCurrentBranch(cwd: string): Promise<string> {
  const { stdout } = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd,
  });

  return stdout.trim();
}
