import type { UserConfig } from "./types.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],

  git: {
    // 变更日志
    changelog: {
      args: "-o --tag ${version}",
      preset: "github",
      presetOverride: undefined,
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },

  hooks: {
    "before:init": undefined,
    "before:selectVersion": undefined,
    "after:selectVersion": undefined,
    "after:bump": undefined,
    "after:release": undefined,
    "before:selectTag": undefined,
    "after:selectTag": undefined,
    "before:changelog": undefined,
    "after:changelog": undefined,
    "before:bump": undefined,
    "before:git": undefined,
    "before:git.add": undefined,
    "after:git.add": undefined,
    "before:git.commit": undefined,
    "after:git.commit": undefined,
    "before:git.tag": undefined,
    "after:git.tag": undefined,
    "before:git.push": undefined,
    "after:git.push": undefined,
    "after:git": undefined,
  },
} satisfies UserConfig;

export default defaults;
