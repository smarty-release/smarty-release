import ora from "ora";
import { x } from "tinyexec";

import type { HookItems, InternalReleaseContext } from "../config/types.ts";
import { logger, renderTemplate } from "./index.ts";

export async function runHook(
  hooks?: HookItems,
  context?: InternalReleaseContext,
) {
  if (!hooks || !hooks.length || !context) return;

  const spinner = ora(`before:init`).start();

  for (const [index, hook] of hooks.entries()) {
    // spinner.text = `aa (${hooks.length})\n   ⠋ ${index}`;

    if (typeof hook === "string") {
      const cmd = renderTemplate(hook, context);
      spinner.start(cmd);
      await x(cmd, [], {
        nodeOptions: {
          shell: true,
          stdio: "pipe",
        },
      });
      spinner.succeed();
    } else {
      const { initialRef: _, ...publicCtx } = context;
      const name = hook.name || "anonymous";
      spinner.start(name);

      await muteStdout(() => hook(publicCtx));

      spinner.succeed();
    }
  }
  spinner.succeed();
}

async function muteStdout<T>(fn: () => Promise<T> | T): Promise<T> {
  const stdoutWrite = process.stdout.write.bind(process.stdout);
  const stderrWrite = process.stderr.write.bind(process.stderr);

  const noop: typeof process.stdout.write = (..._args) => true;

  process.stdout.write = noop;
  process.stderr.write = noop;

  try {
    return await fn();
  } finally {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
  }
}
