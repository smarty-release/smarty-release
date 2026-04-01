import { Command } from "commander";
import { loadConfig } from "../config/index.ts";
import { NAME } from "../constants/index.ts";
import { release } from "../release.ts";

export function releaseCommand(program: Command) {
  program
    .option("--dry-run", "只模拟执行，不做实际发布")
    .option("-c, --config <path>", "指定配置文件路径")
    .action(async () => {
      const opts = program.opts();
      const config = await loadConfig(NAME, opts.config);

      await release(config);
    });
}
