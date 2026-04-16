import { select } from "@inquirer/prompts";
import { prerelease } from "semver";
import { CancelledError } from "../errors.ts";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";

export async function selectTag(config: ResolvedConfig, ctx: ReleaseContext) {
  const isPrerelease = Boolean(prerelease(ctx.version));

  const enabled: any[] = [];
  const disabled: any[] = [];

  for (const tag of config.tags) {
    const item = {
      title: tag,
      value: tag,
      disabled: isPrerelease && tag === "latest",
    };
    (item.disabled ? disabled : enabled).push(item);
  }

  const choices = [...enabled, ...disabled];

  const tag = await select({
    message: "What do you want to tag",
    choices: choices,
  });

  if (!tag) throw new CancelledError();

  ctx.tag = tag;
}
