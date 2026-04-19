import { select } from "@inquirer/prompts";
import { prerelease } from "semver";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";

type Choice = {
  name: string;
  value: string;
  disabled?: boolean;
};

export async function selectTag(config: ResolvedConfig, ctx: ReleaseContext) {
  const isPrerelease = Boolean(prerelease(ctx.version));

  const enabled: Choice[] = [];
  const disabled: Choice[] = [];

  for (const tag of config.tags) {
    const item = {
      name: tag,
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

  if (!tag) ctx.cancel();

  ctx.tag = tag;
}
