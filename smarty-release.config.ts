import { defineConfig } from "./src/config.ts";

export default defineConfig({
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },
  hooks: {
    "after:changelog": "prettier --write CHANGELOG.md",
  },
});
