import { promises as fs } from "node:fs";
import { dirname } from "node:path";

export const ensureDir = (dir: string) => fs.mkdir(dir, { recursive: true });

export const remove = (p: string) => fs.rm(p, { recursive: true, force: true });

export const copy = (src: string, dest: string) =>
  fs.cp(src, dest, { recursive: true });

export const outputFile = async (file: string, data: string | Uint8Array) => {
  await fs.mkdir(dirname(file), { recursive: true });
  await fs.writeFile(file, data);
};
