import { x } from "tinyexec";
import { createConsola } from "consola";
import { NAME } from "../constants.ts";
import { ReleaseContext, UserConfig } from "../config/types.ts";
import { createDefu } from "defu";

type RequireBranch = NonNullable<
  NonNullable<UserConfig["git"]>["requireBranch"]
>;

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
  await x("git", ["status", "--porcelain"], {
    nodeOptions: {
      stdio: "inherit",
      cwd,
    },
  });
}

export async function isGitRepo(cwd: string) {
  try {
    const { stdout } = await x("git", ["rev-parse", "--is-inside-work-tree"], {
      nodeOptions: {
        cwd,
      },
    });

    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

export async function isGitClean(cwd: string) {
  const { stdout } = await x("git", ["status", "--porcelain"], {
    nodeOptions: {
      cwd,
    },
  });
  return stdout.trim().length === 0;
}

export async function gitRestore() {
  await x("git", ["restore", "."]);
  await x("git", ["clean", "-f"]);
}

export async function hasGit() {
  try {
    await x("git", ["--version"], { throwOnError: true });
    return true;
  } catch {
    return false;
  }
}

export async function getGitRemoteUrl(cwd: string): Promise<string> {
  try {
    const { stdout } = await x("git", ["remote", "get-url", "origin"], {
      nodeOptions: {
        cwd,
      },
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

export async function getGitCurrentBranch(cwd: string): Promise<string> {
  const { stdout } = await x("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    nodeOptions: {
      cwd,
    },
  });
  return stdout.trim();
}
