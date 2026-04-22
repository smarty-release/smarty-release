import type { InlineConfig } from "./types.ts";
import { NAME } from "../constants.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    // 变更日志
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
      config: {
        changelog: {
          footer: `<!-- powered by ${NAME} -->`,
        },
      },
    },
    requireBranch: ["main", "master"],
    commitMessage: "release: v${version}",
    commitArgs: ["--no-verify", "-s"],
    tagName: "v${version}",
  },
  hooks: {},
  cwd: process.cwd(),
  dryRun: false,
} satisfies InlineConfig;

export default defaults;
