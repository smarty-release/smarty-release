import type { UserConfig, ReleaseContext } from "./config/index.ts";

export function defineConfig(options: UserConfig): UserConfig {
  return options;
}

export type { UserConfig, ReleaseContext };
