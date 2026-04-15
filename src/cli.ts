#!/usr/bin/env node

import { NAME } from "./constants.ts";
import { logger } from "./utils/index.js";
import { BaseError } from "./errors.js";
import pkg from "../package.json" with { type: "json" };
import lt from "semver/functions/lt.js";
import { cac } from "cac";

if (lt(process.version, "22.18.0")) {
  logger.warn(
    `[${NAME}] Node.js ${process.version} is deprecated. Support will be removed in the next minor release. Please upgrade to Node.js 22.18.0 or later.`,
  );
}

const cli = cac(NAME);
cli.help().version(pkg.version);

cli
  .command("[root]", "开始运行release流程")
  .alias("run")
  .option("--dry-run", "preview without publishing")
  .option("-c, --config <path>", "Path to the config file")
  .action((root, options) => {
    console.log(options);

    console.log("release-start");
  });

cli
  .command("changelog", "生成 changelog 并透传 git-cliff 参数", {
    allowUnknownOptions: true,
  })
  .option("-c, --config <path>", "Path to the config file")
  .action((files, options) => {
    console.log(files, options);
  });

try {
  cli.parse(process.argv);
} catch (err) {
  if (!err) process.exit(0);

  if (err instanceof BaseError) {
    logger[err.level](err.message);
  } else {
    logger.error(err.message);
  }
  process.exit(1);
}
