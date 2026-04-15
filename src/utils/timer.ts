import { logger } from "./index.ts";
import chalk from "chalk";
export async function withTimer<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();

  try {
    return await fn();
  } finally {
    const cost = formatDuration(performance.now() - start);
    logger.log(chalk.green(`🎉 ${label} successfully! (in ${cost})`));
  }
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;

  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(2)}s`;

  const m = Math.floor(s / 60);
  const rest = (s % 60).toFixed(1);
  return `${m}m ${rest}s`;
}
