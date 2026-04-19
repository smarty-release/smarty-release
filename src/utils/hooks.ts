import { x } from "tinyexec";
import { CancelledError } from "../errors.ts";
import { renderTemplate } from "../utils/index.ts";
import { logger } from "../utils/index.ts";
import { ReleaseContext } from "../config.ts";
import { HookContext, HookItems } from "../config/types.ts";

export function createHookContext(ctx: ReleaseContext) {
  return {
    ...ctx,
    logger,
    cancel(message?: string) {
      throw new CancelledError(message);
    },
  } as HookContext;
}

export async function runHook(hook?: HookItems, hookCtx?: HookContext) {
  if (!hook || !hookCtx) return;

  for (const hookItem of hook) {
    if (typeof hookItem === "string") {
      const cmd = renderTemplate(hookItem, hookCtx);
      await x(cmd, [], {
        nodeOptions: {
          shell: true,
          stdio: "inherit",
        },
      });
    } else {
      await hookItem(hookCtx);
    }
  }
}
