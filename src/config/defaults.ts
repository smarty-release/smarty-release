import type { UserConfig } from "./types.ts";

const defaults = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],

  git: {
    // 变更日志
    changelog: {
      // 也支持使用 数组的方式传递
      // args:["-o","--tag","${version}"],
      args: "-o --tag ${version}",
      template: "github",
      // 这里默认可以不传递，也可以传递类型 ChangelogPresetOverride
      config: undefined,
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },

  hooks: {
    // hook 支持字符串，数组，函数，数组里的元素也只能是字符串和函数
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
