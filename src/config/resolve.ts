import { NAME } from "../constants/index.ts";
import merge from "lodash.merge";
import { loadConfig } from "./index.ts";
import type {
  ChangelogOptions,
  InlineConfig,
  ResolvedConfig,
  UserConfig,
  Hooks,
  HooksArray,
  HookEvent,
  Hook,
} from "./types.ts";
import defaultsConfig from "./defaults.ts";
import { SetOptional } from "type-fest";

type Argss = NonNullable<ChangelogOptions["args"]>;

export async function resolveConfig(
  inlineConfig: InlineConfig = {},
): Promise<ResolvedConfig> {
  // 加载配置
  const fileConfig = await loadConfig<UserConfig>(NAME, inlineConfig.config);

  // Merge options
  const merged = merge({}, defaultsConfig, fileConfig, inlineConfig);

  // 验证参数合法性

  // 参数归一化处理
  const resolved: ResolvedConfig = {
    ...merged,
    git: {
      ...merged.git,
      changelog: normalizeChangelog(merged.git.changelog),
    },
    hooks: normalizeHooks(merged.hooks),
  };

  return resolved;
}

function normalizeHooks(hooks: Hooks = {}) {
  const result = {} as HooksArray;

  for (const [event, hook] of Object.entries(hooks) as [HookEvent, Hook][]) {
    result[event] = normalizeHookValue(hook);
  }

  return result;
}

function normalizeHookValue(hook?: Hook) {
  if (!hook) return [];
  return Array.isArray(hook) ? hook : [hook];
}

function normalizeChangelog(
  changelog: false | SetOptional<Required<ChangelogOptions>, "config">,
) {
  if (changelog === false) return false;

  return {
    ...changelog,
    args: normalizeArgs(changelog.args),
  };
}

function normalizeArgs(args: Argss): string[] {
  if (Array.isArray(args)) return args;
  return args.trim().split(/\s+/);
}
