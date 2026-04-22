# 配置文件

默认情况下，`Smarty-Release` 会在当前工作目录中查找配置文件。它支持以下文件名：

- smarty-release.config.ts
- smarty-release.config.mts
- smarty-release.config.cts
- smarty-release.config.js
- smarty-release.config.mjs
- smarty-release.config.cjs
- smarty-release.config.json

此外，您还可以直接在 package.json 文件的 `smarty-release` 字段中定义配置。

## 编写配置文件

配置文件允许您以集中且可复用的方式定义和自定义构建设置。以下是一个简单的 `smarty-release` 配置文件示例：

```ts [smarty-release.config.ts]
import { defineConfig } from "smarty-release";

export default defineConfig({
  // 控制版本号递增类型
  increments: [],
  // npm dist-tag
  tags: [],
  // git相关的配置
  git: {},
  // 钩子配置
  hooks: {},
});
```

可以看到它主要分为四个部分

## 指定自定义配置文件

如果您的配置文件位于其他位置或具有不同的名称，可以使用 --config（或 -c）选项指定其路径：

```bash
smarty-release --config ./path/to/config
```
