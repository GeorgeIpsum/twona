import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const readJson = async (path: string) =>
  readFile(resolve(path), "utf-8").then((data) => JSON.parse(data));
