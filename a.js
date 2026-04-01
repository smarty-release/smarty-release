// save as dumpSrcFiles.js
import fs from "fs";
import path from "path";

const srcDir = path.resolve("./src"); // 你的 src 目录
const outputFile = path.resolve("./src_contents.txt"); // 输出文件

// 递归获取所有文件路径
function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function dumpFiles() {
  const files = getAllFiles(srcDir);
  const contents = files
    .map((filePath) => {
      const relativePath = path.relative(".", filePath).replace(/\\/g, "/"); // 支持 Windows
      const data = fs.readFileSync(filePath, "utf-8");
      return `${relativePath}内容如下：\n\n${data}\n`;
    })
    .join("\n");

  fs.writeFileSync(outputFile, contents, "utf-8");
  console.log(`文件内容已写入 ${outputFile}`);
}

dumpFiles();
