import { confirm } from "@inquirer/prompts";
import { CancelledError } from "../errors.ts";
import { gitRestore } from "../utils/index.js";

export async function confirmChangelog() {
  // 再来一个询问,询问用户变更日志是否正常
  const normal = await confirm({
    message: "Changelog generated. Does it look good?",
    default: true,
  });
  if (normal === false) {
    await gitRestore();
    throw new CancelledError();
  }
}
