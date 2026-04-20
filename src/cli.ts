#!/usr/bin/env node

import { NAME } from "./constants.ts";
import { logger } from "./utils/index.js";
import pkg from "../package.json" with { type: "json" };
import lt from "semver/functions/lt.js";
import { cac } from "cac";
import { release } from "./release.ts";
import { CancelledError } from "./errors.ts";
import { changelog } from "./changelog.ts";
import { InlineConfig } from "./config/types.ts";

if (lt(process.version, "22.18.0")) {
  logger.warn(
    `[${NAME}] Node.js ${process.version} is deprecated. Support will be removed in the next minor release. Please upgrade to Node.js 22.18.0 or later.`,
  );
}

const cli = cac(NAME);
cli.help().version(pkg.version);

cli
  .command("[run]", "Start release process")
  .alias("run")
  .option("--dry-run", "preview without publishing")
  .option("-c, --config <path>", "Path to the config file")
  .action(async (root, options: InlineConfig) => {
    await release(options);
  });

cli
  .command("changelog", "Options to pass to git-cliff", {
    allowUnknownOptions: true,
  })
  .option("-c, --config <path>", "Path to the config file")
  .action(async (files, options) => {
    const raw = cli.rawArgs;
    const idx = raw.findIndex((arg) => arg === "changelog");
    // 取后面的参数（排除 node / script）
    const args = idx !== -1 ? raw.slice(idx + 1) : [];

    await changelog(args);
  });

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (err: unknown) {
  if (!err) process.exit(0);

  if (err instanceof CancelledError) {
    logger.warn(err.message);
  } else if (err instanceof Error) {
    logger.error(err.message);
  } else {
    logger.error(`Unknown error`, err);
  }

  process.exit(1);
}
