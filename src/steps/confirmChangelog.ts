import { confirm } from "@inquirer/prompts";
import { gitRestore } from "../utils/index.js";
import { ReleaseContext } from "../config/types.ts";

export async function confirmChangelog(ctx: ReleaseContext) {
  // 再来一个询问,询问用户变更日志是否正常
  const normal = await confirm({
    message: "Changelog generated. Does it look good?",
    default: true,
  });
  if (normal === false) {
    await gitRestore();
    ctx.cancel();
  }
}
