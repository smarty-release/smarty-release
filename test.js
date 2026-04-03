import { parse, stringify } from "smol-toml";
import fs from "fs-extra";

const cnt = fs.readFileSync("test.toml", "utf-8");

const doc = cnt;
const parsed = parse(doc);

fs.outputJSONSync("test.json", parsed, { spaces: 2 });

console.log(parsed);
