import { NormalizedChangelogOptions, ResolvedConfig } from "../config/types.ts";
import type { MergeDeep } from "type-fest";

export type ResolvedConfigWithChangelog = MergeDeep<
  ResolvedConfig,
  {
    git: {
      changelog: NormalizedChangelogOptions;
    };
  }
>;

export function hasChangelog(
  config: ResolvedConfig,
): config is ResolvedConfigWithChangelog {
  return config.git.changelog !== false;
}
