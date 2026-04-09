import { ResolvedConfig } from "../config/types.ts";

export type ResolvedConfigWithChangelog = ResolvedConfig & {
  git: ResolvedConfig["git"] & {
    changelog: Exclude<ResolvedConfig["git"]["changelog"], false>;
  };
};

export function hasChangelog(
  config: ResolvedConfig,
): config is ResolvedConfigWithChangelog {
  return config.git.changelog !== false;
}
