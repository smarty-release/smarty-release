import PackageJson from "@npmcli/package-json";
import { ResolvedConfig, ReleaseContext } from "../config/types.ts";

export async function bump(config: ResolvedConfig, ctx: ReleaseContext) {
  const pkgJson = await PackageJson.load(config.cwd);

  pkgJson.update({
    version: ctx.version,
    publishConfig: {
      tag: ctx.tag,
    },
  });

  await pkgJson.save();
}
