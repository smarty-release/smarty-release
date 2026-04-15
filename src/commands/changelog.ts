import { Command } from "commander";
import { changelog } from "../changelog.ts";

export function changelogCommand(program: Command) {
  program
    .command("changelog [args...]")
    .description("生成 changelog 并透传 git-cliff 参数")
    .allowUnknownOption(true)
    .action(async (args) => {
      console.log(args);
      const opts = program.opts();
      // 合并参数

      console.log(opts);

      // await changelog(args);
    });
}
