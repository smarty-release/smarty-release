import type { InlineConfig } from "./types.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    // 变更日志
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },
  hooks: {},
  cwd: process.cwd(),
  dryRun: false,
} satisfies InlineConfig;

export default defaults;
