import { promises as fs } from "node:fs";
import { dirname } from "node:path";

export const remove = (p: string) => fs.rm(p, { recursive: true, force: true });

export const outputFile = async (file: string, data: string | Uint8Array) => {
  await fs.mkdir(dirname(file), { recursive: true });
  await fs.writeFile(file, data);
};
