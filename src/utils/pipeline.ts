import type {
  InternalReleaseContext,
  ResolvedConfig,
  Step,
} from "../config/types.ts";
import { runHook } from "../utils/hook.ts";
import { effect } from "../utils/index.ts";

export const pipeline: Step[] = [
  {
    name: "init",
    run: () => {
      console.log("init");

      return Promise.resolve();
    }, // 只是 hook
  },

  // {
  //   name: "select_version",
  //   run: async () => {
  //     console.log("w");
  //     return Promise.resolve();
  //   },
  // },
  // {
  //   name: "git",
  //   effect: true,
  // },
];

export async function runPipeline(
  steps: Step[],
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  for (const step of steps) {
    if (step.skip?.(context)) continue;

    const runner = async () => {
      await runHook(
        `before:${step.name}`,
        config.hooks?.[`before:${step.name}`],
        context,
      );

      if (step.run) {
        await step.run();
        console.log("ww");
      }

      await runHook(
        `after:${step.name}`,
        config.hooks?.[`after:${step.name}`],
        context,
      );
    };

    if (step.effect) {
      await effect(config, step.name, runner);
    } else {
      await runner();
    }
  }
}
