import { select, input } from "@inquirer/prompts";
import { inc, valid, prerelease, gt } from "semver";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { renderTemplate } from "../utils/index.ts";

export async function selectVersion(
  config: ResolvedConfig,
  ctx: ReleaseContext,
) {
  let targetVersion;
  const currentVersion = ctx.version;
  const isPrerelease = prerelease(currentVersion);

  // 构建版本选项
  const choices = config.increments.map((type) => ({
    name: `${type} (${inc(currentVersion, type)})`,
    value: inc(currentVersion, type),
  }));

  // 如果当前是预发布版本，插入 prerelease 选项
  if (isPrerelease) {
    choices.unshift({
      name: `prerelease (${inc(currentVersion, "prerelease")})`,
      value: inc(currentVersion, "prerelease"),
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
      default: currentVersion,
      validate(value) {
        const v = value.trim();

        if (!valid(v)) {
          return "Invalid semver version";
        }

        if (!gt(v, currentVersion)) {
          return `Version must be greater than current version: ${currentVersion}`;
        }

        return true;
      },
    });

    targetVersion = customVersion;
  }

  ctx.version = targetVersion;
  const tagName = renderTemplate(config.git.tagName, ctx);
  ctx.git = {
    ...ctx.git,
    tagName,
  };
}
