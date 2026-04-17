import { defineConfig } from "./src/config.ts";

export default defineConfig({
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
      // 是用来覆盖上面的预设的
      config: {
        changelog: {
          header: "a",
        },
      },
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },
  hooks: {},
});
