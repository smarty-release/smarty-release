import { execa } from "execa";
import { CancelledError } from "../errors.ts";
import { renderTemplate } from "../utils/index.ts";
import { logger } from "../utils/index.ts";
import { ReleaseContext } from "../config.ts";
import { Hook } from "../config/types.ts";
function createHookContext(ctx: ReleaseContext) {
  return {
    ...ctx,

    logger,
    cancel(message: string) {
      throw new CancelledError(message);
    },
  };
}

export async function runHook(hook: Hook, ctx: ReleaseContext) {
  if (!hook) return;

  const hookCtx = createHookContext(ctx);

  // string：shell 命令
  if (typeof hook === "string") {
    const cmd = renderTemplate(hook, ctx);
    await execa(cmd, { shell: true, stdio: "inherit" });
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
      await runHook(h, ctx); // 继续传原始 ctx
    }
  }
}
