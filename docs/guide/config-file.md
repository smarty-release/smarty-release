# 配置文件

配置文件允许您以集中且可复用的方式定义和自定义发行设置。

## 配置文件

默认情况下，`Smarty-Release` 会在当前工作目录中查找配置文件。它支持以下文件名：

- smarty-release.config.js
- smarty-release.config.mjs
- smarty-release.config.cjs
- smarty-release.config.json
- smarty-release.config.ts （需要[额外配置](#typescript-config-file)）
- smarty-release.config.mts （需要[额外配置](#typescript-config-file)）
- smarty-release.config.cts （需要[额外配置](#typescript-config-file)）

此外，您还可以直接在 package.json 文件的 `smarty-release` 字段中定义配置。

::: tip
虽然**smarty-release**支持直接在package.json文件和单独的json后缀配置文件进行配置,但是依然建议您使用javascript配置文件,以或者更好的支持。
:::

::: details 关于文件扩展名的说明：
`.mjs` 扩展名会使文件采用 [ES 模块（ESM）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)格式。默认情况下，Node 会将 `.js` 文件按 [CommonJS（CJS）](https://nodejs.org/api/modules.html)格式解析，但如果你在 package.json 中设置了 `"type": "module"`，那么也可以使用 `smarty-release.config.js`。
:::

<a id="config-object"></a>

## 配置对象

需要在配置文件中导出一个配置对象,对象中主要由下面的属性组成：

- `increments` - 一个数组,包含版本递增类型
- `tags` - 一个数组,表示npm dist-tag
- `git` - 一个对象,git相关的配置
- `hooks` - 一个对象，配置钩子生命周期

可以看到它的配置非常简单的,主要分为四个属性组成。

<a id="writing-a-config-file"></a>

## 编写配置文件

以下是一个简单的 `smarty-release` 配置文件示例：

:::tabs variant:code
== CommonJs

```js
const { defineConfig } = require("smarty-release");

module.exports = defineConfig({
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    requireBranch: "master",
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
  },
  hooks: {
    "before:init": "pnpm test",
    "after:release": "echo 已推送 v${version} ",
  },
});
```

== ESM

```js
import { defineConfig } from "smarty-release";

export default defineConfig({
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    requireBranch: "main",
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
  },
  hooks: {
    "before:init": "pnpm test",
    "after:release": "echo 已推送 v${version} ",
  },
});
```

== CommonJS - (Without TypeHelper Fn)

```js
/** @type { import('smarty-release').UserConfig } */
module.exports = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    requireBranch: "master",
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
  },
  hooks: {
    "before:init": "pnpm test",
    "after:release": "echo 已推送 v${version} ",
  },
};
```

== ESM - (Without TypeHelper Fn)

```js
/** @type { import('smarty-release').UserConfig } */
exports default {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    requireBranch: "master",
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
  },
  hooks: {
    "before:init": "pnpm test",
    "after:release": "echo 已推送 v${version} ",
  },
};
```

:::

### 其它示例 - smarty-release.config.cts

`.cts` 格式结合了 TypeScript 的类型安全和 CommonJS 的模块系统，适合需要类型检查的 CommonJS 项目。对于 TypeScript 代码库，您还可以使用[satisfies](https://www.tslang.org/release-notes/typescript-4-9#satisfies-%E8%BF%90%E7%AE%97%E7%AC%A6)运算符来确保类型安全：

::: details 点此查看代码

```ts
import type { UserConfig } from "smarty-release";

module.exports = {
  increments: ["patch", "minor", "major"],
  tags: ["latest", "next"],
  git: {
    requireBranch: "master",
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    changelog: {
      args: "-o --tag ${version}",
      template: "github",
    },
  },
  hooks: {
    "before:init": ["pnpm test"],
    "after:release": "echo 已推送 v${version} ",
  },
} satisfies UserConfig;
```

:::

## 指定自定义配置文件

如果您的配置文件位于其他位置或具有不同的名称，可以使用 `--config`（或 `-c`）选项指定其路径：

```bash
smarty-release --config ./path/to/config
```

<a id="typescript-config-file"></a>

## TypeScript 配置文件

Deno 和 Bun 原生支持 TypeScript 配置文件；对于 Node.js，您必须jiti在项目中安装 2.2.0 或更高版本的可选开发依赖项（ESLint 不会自动安装此依赖项）：
::: code-group

```sh [npm]
npm install --save-dev jiti
```

```sh [yarn]
yarn add --dev jiti
```

```sh [pnpm]
pnpm add --save-dev jiti
```

```sh [bun]
bun add --dev jiti
```

:::

接着可以创建一个使用 `.ts`、`.mts` 或 `.cts` 扩展名的配置文件，您可以参考[配置对象](#config-object)进行配置
