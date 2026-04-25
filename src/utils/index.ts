import { x } from "tinyexec";
import { createConsola } from "consola";
import { NAME } from "../constants.ts";
import { HookItems, ReleaseContext, ResolvedConfig } from "../config/types.ts";
import { createDefu } from "defu";
import type { Get } from "type-fest";
import chalk from "chalk";

type RequireBranch = Get<ResolvedConfig, "git.requireBranch">;

export async function getGitHead(): Promise<string> {
  const { stdout } = await x("git", ["rev-parse", "HEAD"], {
    throwOnError: true,
  });
  return stdout.trim();
}

export async function gitReset(ctx: ReleaseContext) {
  if (!ctx._initialRef) return;
  // 删除可能已经创建的tag
  await x("git", ["tag", "-d", ctx.git.tagName]);
  await x("git", ["reset", "--hard", ctx._initialRef]);
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

export async function gitChangeset() {
  await x("git", ["status", "--porcelain"], {});
}

export async function isGitRepo() {
  try {
    const { stdout } = await x("git", ["rev-parse", "--is-inside-work-tree"], {
      throwOnError: true,
    });
    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

export async function isGitClean() {
  const { stdout } = await x("git", ["status", "--porcelain"]);
  return stdout.trim().length === 0;
}

export async function hasGit() {
  try {
    await x("git", ["--version"], { throwOnError: true });
    return true;
  } catch {
    return false;
  }
}

export async function getGitRemoteUrl(): Promise<string> {
  try {
    const { stdout } = await x("git", ["remote", "get-url", "origin"], {
      throwOnError: true,
    });
    return stdout.trim();
  } catch {
    return "";
  }
}

export function renderTemplate(template: string, ctx: ReleaseContext): string {
  if (!template || typeof template !== "string") return template;

  return template.replace(/\$\{([^}]+)\}/g, (_, expr: string) => {
    const value = expr.split(".").reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object") {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, ctx);

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

export async function getGitCurrentBranch(): Promise<string> {
  const { stdout } = await x("git", ["symbolic-ref", "--short", "HEAD"], {
    throwOnError: true,
  });
  return stdout.trim();
}

export async function runHook(hook?: HookItems, hookCtx?: ReleaseContext) {
  if (!hook || !hookCtx) return;

  for (const hookItem of hook) {
    if (typeof hookItem === "string") {
      const cmd = renderTemplate(hookItem, hookCtx);
      logger.info(`Running hook: ${cmd}`);
      await x(cmd, [], {
        nodeOptions: {
          shell: true,
          stdio: "inherit",
        },
      });
    } else {
      const name = hookItem.name || "anonymous";
      logger.info(`Running hook: ${name}`);
      await hookItem(hookCtx);
    }
  }
}

export function getCommandRawArgs(
  rawArgs: string[],
  commandNames: string[],
): string[] {
  const idx = rawArgs.findIndex((arg) => commandNames.includes(arg));

  return idx === -1 ? [] : rawArgs.slice(idx + 1);
}

export function effect<T>(
  config: ResolvedConfig,
  desc: string | null,
  fn: () => Promise<T>,
  options: {
    runInDryRun?: boolean;
  } = {},
) {
  const shouldSkip = config.dryRun && !options.runInDryRun;

  if (desc) {
    logger.info(chalk.yellow(`[dry-run] would ${desc}`));
  }

  if (shouldSkip) {
    return Promise.resolve(undefined as T);
  }

  return fn();
}
