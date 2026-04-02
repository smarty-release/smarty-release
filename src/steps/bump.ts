import PackageJson from "@npmcli/package-json";
import { ReleaseContext, UserConfig } from "../config.ts";

export async function bump(_config: UserConfig, ctx: ReleaseContext) {
  const pkgJson = await PackageJson.load(ctx.cwd!);

  pkgJson.update({
    version: ctx.version!,
    publishConfig: {
      tag: ctx.tag!,
    },
  });

  await pkgJson.save();
}
