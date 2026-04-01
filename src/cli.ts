#!/usr/bin/env node

import { Command } from "commander";
import { releaseCommand } from "./commands/release.ts";
import { changelogCommand } from "./commands/changelog.ts";
import { logger } from "./utils/index.js";
import { CancelledError } from "./errors.js";
import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name("release-pls")
  .description("A lightweight, generic release CLI.")
  .version(pkg.version);

// 注册命令
releaseCommand(program);
changelogCommand(program);

try {
  await program.parseAsync(process.argv);
} catch (err) {
  if (err) {
    err instanceof CancelledError
      ? logger.warn(err.message)
      : logger.error(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
}
