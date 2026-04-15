import { Command } from "commander";
import { release } from "../release.ts";
import { InlineConfig } from "../config/types.ts";

export function releaseCommand(program: Command) {
  program
    .command("release")
    .option("--dry-run", "preview without publishing")
    .option("-c, --config <path>", "Path to the config file")
    .action(async () => {
      const opts = program.opts<InlineConfig>();
      await release(opts);
    });
}
