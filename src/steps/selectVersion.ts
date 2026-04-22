import { select, input } from "@inquirer/prompts";
import { inc, valid, prerelease, gt } from "semver";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.ts";

export async function selectVersion(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  let targetVersion;
  const isPrerelease = prerelease(ctx.latestVersion);

  // 构建版本选项
  const choices = config.increments.map((type) => ({
    name: `${type} (${inc(ctx.latestVersion, type)})`,
    value: inc(ctx.latestVersion, type),
  }));

  // 如果当前是预发布版本，插入 prerelease 选项
  if (isPrerelease) {
    choices.unshift({
      name: `prerelease (${inc(ctx.latestVersion, "prerelease")})`,
      value: inc(ctx.latestVersion, "prerelease"),
    });
  }

  // custom 始终放最后
  choices.push({
    name: "custom",
    value: "custom",
  });

  const release = await select({
    message: "What do you want to release",
    choices,
  });

  if (!release) ctx.cancel();

  targetVersion = release;

  // 自定义版本号
  if (release === "custom") {
    const customVersion = await input({
      message: "Input custom version",
      default: ctx.latestVersion,
      validate(value) {
        const v = value.trim();

        if (!valid(v)) {
          return "Invalid semver version";
        }

        if (!gt(v, ctx.latestVersion)) {
          return `Version must be greater than current version: ${ctx.latestVersion}`;
        }

        return true;
      },
    });

    targetVersion = customVersion;
  }

  // 赋值给上下文
  ctx.version = targetVersion;
  ctx.git = {
    ...ctx.git,
    tagName: renderTemplate(config.git.tagName, ctx),
    commitMessage: renderTemplate(config.git.commitMessage, ctx),
  };
}
