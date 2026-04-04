import type { UserConfig } from "./types.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],

  git: {
    // 变更日志
    changelog: {
      args: "-o --tag ${version}",
      preset: "github",
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },

  hooks: {
    "before:init": undefined,
  },
} satisfies UserConfig;

export default defaults;
