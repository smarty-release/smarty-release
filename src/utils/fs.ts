import { promises as fs } from "node:fs";

export const ensureDir = (dir: string) => fs.mkdir(dir, { recursive: true });

export const remove = (p: string) => fs.rm(p, { recursive: true, force: true });

export const copy = (src: string, dest: string) =>
  fs.cp(src, dest, { recursive: true });
