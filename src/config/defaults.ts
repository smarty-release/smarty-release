import type { InlineConfig } from "./types.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    // 变更日志
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
      config: {
        git: {
          commit_parsers: [{ message: "^release", skip: true }],
        },
      },
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    commitArgs: ["--no-verify", "-s"],
    tagName: "v${version}",
  },
  hooks: {},
  cwd: process.cwd(),
  dryRun: false,
} satisfies InlineConfig;

export default defaults;
