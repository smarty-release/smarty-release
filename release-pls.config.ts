import { defineConfig } from "./src/config.ts";

export default defineConfig({
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    changelog: {
      args: "-o --tag ${version}",
      // 也可以是数组
      // args: ["-o", "--tag", "v${version}"],
      template: "cocogitto",
      // 是用来覆盖上面的预设的
      config: {
        remote: {
          github: {
            owner: "ajiho",
            repo: "releaset-it-demo",
          },
        },
        changelog: {
          header: "a",
        },
      },
    },
    requireBranch: false,
    commitMessage: "release: v${version}",
    tagName: "v${version}",
  },
  hooks: {
    // 最后都应该转换成数组(数组元素支持字符串和函数)才合适
    "before:init": ["npm run test"],
    // "before:selectVersion": ({ logger }) => {
    //   logger.info("Before selecting version");
    // },
    // "after:selectVersion": ({ version, logger }) => {
    //   logger.info(`after selecting version:${version}`);
    // },
    // "after:bump": [
    //   "npm run changelog",
    //   async () => {
    //     console.log("after:bump");
    //   },
    // ],
    // "after:release": "echo 已推送 v${version} ",
  },
});
