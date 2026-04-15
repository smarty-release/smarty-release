import { run } from "./index.ts";
import { CancelledError } from "../errors.ts";
import { renderTemplate } from "../utils/index.ts";
import { logger } from "../utils/index.ts";
import { ReleaseContext } from "../config.ts";
import { Hook, HookContext } from "../config/types.ts";

export function createHookContext(ctx: ReleaseContext) {
  return {
    ...ctx,
    logger,
    cancel(message?: string) {
      throw new CancelledError(message);
    },
  } as HookContext;
}

export async function runHook(hook?: Hook, hookCtx?: HookContext) {
  if (!hook || !hookCtx) return;

  // string：shell 命令
  if (typeof hook === "string") {
    const cmd = renderTemplate(hook, hookCtx);
    await run(cmd, [], { shell: true });
    return;
  }

  // function
  if (typeof hook === "function") {
    await hook(hookCtx);
    return;
  }

  // array
  if (Array.isArray(hook)) {
    for (const h of hook) {
      await runHook(h, hookCtx); // 继续传原始 ctx
    }
  }
}
