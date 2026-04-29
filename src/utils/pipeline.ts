import type {
  InternalReleaseContext,
  ResolvedConfig,
  Step,
} from "../config/types.ts";
import {
  bump,
  confirmChangelog,
  genChangelog,
  selectTag,
  selectVersion,
} from "../steps/index.ts";
import { runHook } from "../utils/hook.ts";
import { effect, hasChangelog } from "../utils/index.ts";

export const pipeline: Step[] = [
  {
    name: "init",
  },
  {
    name: "selectVersion",
    effect: false,
    run: async (config, context) => {
      await selectVersion(config, context);
    },
  },
  {
    name: "selectTag",
    effect: false,
    run: async (config, context) => {
      await selectTag(config, context);
    },
  },
  {
    name: "changelog",
    effect: false,
    run: async (config, context) => {
      if (!hasChangelog(config)) return;
      await genChangelog(config, context);
    },
  },
  {
    effect: false,
    run: async (config, context) => {
      if (!hasChangelog(config)) return;
      await confirmChangelog(context);
    },
  },
  {
    name: "bump",
    effect: false,
    run: async (config, context) => {
      await bump(config, context);
    },
  },
  {
    name: "release",
  },
];

export async function runPipeline(
  steps: Step[],
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  for (const step of steps) {
    const stepName = step.name;

    if (!stepName) {
      // 直接运行
      await step.run(config, context);
      continue;
    }

    await effect(config, `run hook ${stepName}`, async () => {
      await runHook(
        `before:${stepName}`,
        config.hooks?.[`before:${stepName}`],
        context,
      );
    });

    await effect(config, `run hook ${stepName}`, async () => {
      await runHook(
        `after:${stepName}`,
        config.hooks?.[`after:${stepName}`],
        context,
      );
    });
  }
}
