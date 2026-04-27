import { x } from "tinyexec";

import type { HookItems, InternalReleaseContext } from "../config/types.ts";
import type { ReleaseContext } from "../options.ts";
import { logger, renderTemplate } from "./index.ts";

export async function runHook(
  hook?: HookItems,
  hookCtx?: InternalReleaseContext,
) {
  if (!hook || !hookCtx) return;

  const publicCtx = toPublicContext(hookCtx);

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
      await hookItem(publicCtx);
    }
  }
}

function toPublicContext(ctx: InternalReleaseContext): ReleaseContext {
  const { initialRef: _, ...rest } = ctx;
  return rest;
}
