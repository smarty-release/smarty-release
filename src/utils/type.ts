import type { MergeDeep } from "type-fest";

import type {
  NormalizedChangelogOptions,
  ResolvedConfig,
} from "../config/types.ts";

export type ResolvedConfigWithChangelog = MergeDeep<
  ResolvedConfig,
  {
    git: {
      changelog: NormalizedChangelogOptions;
    };
  }
>;
