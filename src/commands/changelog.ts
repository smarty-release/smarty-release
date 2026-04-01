import { Command } from "commander";
import { loadConfig } from "../config/index.ts";
import { NAME } from "../constants/index.ts";
import { changelog } from "../changelog.ts";

export function changelogCommand(program: Command) {
  program
    .command("changelog [args...]")
    .description("生成 changelog 并透传 git-cliff 参数")
    .allowUnknownOption(true)
    .option("-c, --config <path>", "指定配置文件路径")
    .action(async (args) => {
      const opts = program.opts();
      const config = await loadConfig(NAME, opts.config, {
        changelog: {
          args,
        },
      });
      await changelog(config);
    });
}
