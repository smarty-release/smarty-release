import { defu } from "defu";

import type {
  InternalReleaseContext,
  ResolvedConfig,
  Step,
} from "../config/types.ts";
import { HOOKS } from "../constants.ts";
import {
  bump,
  confirmChangelog,
  genChangelog,
  selectTag,
  selectVersion,
} from "../steps/index.ts";
import { runHook } from "../utils/hook.ts";
import { effect, hasChangelog } from "../utils/index.ts";

const steps: Step[] = [
  {
    beforeHook: HOOKS.BEFORE_INIT,
    effect: `run hook ${HOOKS.BEFORE_INIT}`,
  },
  {
    beforeHook: HOOKS.BEFORE_SELECT_VERSION,
    afterHook: HOOKS.AFTER_SELECT_VERSION,
    run: selectVersion,
    effect: `run hook ?`, // 这里就只能对这整个步骤进行dryrun模式打印
  },
  {
    afterHook: HOOKS.AFTER_RELEASE,
    effect: `run hook ${HOOKS.AFTER_RELEASE}`,
  },
];

export async function runStep(
  config: ResolvedConfig,
  ctx: InternalReleaseContext,
) {
  for (const step of steps) {
    const runner = async () => {
      if (step.beforeHook) {
        await runHook(step.beforeHook, config.hooks?.[step.beforeHook], ctx);
      }

      if (step.run) {
        await step.run(config, ctx);
      }

      if (step.afterHook) {
        await runHook(step.afterHook, config.hooks?.[step.afterHook], ctx);
      }
    };

    if (!step.effect) {
      await runner();
    } else {
      await effect(config, step.effect, runner);
    }
  }
}
