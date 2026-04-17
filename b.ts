import { x } from "tinyexec";
import { execa } from "execa";

const result = await x("echo", ["hello"]);

console.log(result.stdout); //hello\n

// 因为 CLI 输出本来就是：
// hello\n

const { stdout } = await execa("echo", ["hello"]);
console.log(stdout); // "hello"
