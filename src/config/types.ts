import type { MergeDeep, OverrideProperties, RequiredDeep } from "type-fest";

import type {
  ChangelogOptions,
  Hook,
  HookEvent,
  ReleaseContext,
  StepName,
  UserConfig,
} from "../options.ts";

export interface InternalReleaseContext extends ReleaseContext {
  initialRef: string;
}

export interface InlineConfig extends UserConfig {
  config?: string;
  dryRun?: boolean;
  cwd?: string;
}

export type HookItems = Extract<Hook, unknown[]>;
export type NormalizedHooks = Partial<Record<HookEvent, HookItems>>;

export type NormalizedChangelogOptions = Required<
  OverrideProperties<
    ChangelogOptions,
    {
      args: string[];
    }
  >
>;

export type ResolvedConfig = MergeDeep<
  RequiredDeep<InlineConfig>,
  {
    git: {
      changelog: false | NormalizedChangelogOptions;
    };
    hooks: NormalizedHooks;
    config?: string;
  }
>;

export interface Step {
  name: StepName;
  run?: () => Promise<void>;
  children?: Step[];
  skip?: (ctx: InternalReleaseContext) => boolean;

  effect?: boolean; //  是否是副作用
}
