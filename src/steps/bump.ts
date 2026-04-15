import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { readPackageJSON, writePackageJSON } from "pkg-types";

export async function bump(config: ResolvedConfig, ctx: ReleaseContext) {
  const pkg = await readPackageJSON(config.cwd);
  pkg.version = ctx.version;

  pkg.publishConfig = {
    ...pkg.publishConfig,
    tag: ctx.tag,
  };

  await writePackageJSON(config.cwd, pkg);
}
