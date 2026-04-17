import { ResolvedConfig, ReleaseContext } from "../config/types.ts";
import { readPackageJSON, writePackageJSON } from "pkg-types";
import { detect } from "package-manager-detector/detect";
import { x } from "tinyexec";

export async function bump(config: ResolvedConfig, ctx: ReleaseContext) {
  const pkg = await readPackageJSON(config.cwd);

  pkg.version = ctx.version;

  pkg.publishConfig = {
    ...pkg.publishConfig,
    tag: ctx.tag,
  };

  await writePackageJSON(`${config.cwd}/package.json`, pkg);

  // 更新锁文件
  const pm = await detect();
  if (!pm) return;
  x(pm.agent, ["install"]);
}
