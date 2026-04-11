import { Command } from "commander";
import { loadConfig } from "../config/index.ts";
import { NAME } from "../constants/index.ts";
import { release } from "../release.ts";

export function releaseCommand(program: Command) {
  program
    .option("--dry-run", "preview without publishing")
    .option("-c, --config <path>", "Path to the config file")
    .action(async () => {
      const opts = program.opts();
      console.log(opts);
    });
}
