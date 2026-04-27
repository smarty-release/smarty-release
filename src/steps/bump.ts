import { ResolvedConfig, InternalReleaseContext } from "../config/types.ts";
import { readPackageJSON, writePackageJSON } from "pkg-types";
import { detect } from "package-manager-detector/detect";
import { x } from "tinyexec";

export async function bump(
  config: ResolvedConfig,
  context: InternalReleaseContext,
) {
  const pkg = await readPackageJSON(config.cwd);

  pkg.version = context.version;

  pkg.publishConfig = {
    ...pkg.publishConfig,
    tag: context.tag,
  };

  await writePackageJSON(`${config.cwd}/package.json`, pkg);

  // 更新锁文件
  const pm = await detect();
  if (!pm) return;
  await x(pm.agent, ["install"]);
}
