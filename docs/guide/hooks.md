# Hooks

该设计的思想来自于release-it。

你可能会想,你可以自己利用比如[npm-run-all](https://github.com/bcomnes/npm-run-all2)的`run-s`或者`run-p`在 package.json 里用就像下面一样编排流程：

```json{5-7} [package.json]
{
  "name": "you-awesome-project",
  "type": "module",
  "scripts": {
    "test": "...",
    "build": "...",
    "release": "run-s test build smarty-release"
  },
}
```

但它的特点：

- 在 CLI 外部
- 粗粒度（整个 release 前后）
- 无法感知内部状态

hooks 解决的是：

在 release 内部的具体某个阶段,比如：

```
"before:init"
"after:changelog"
"before:git:commit"
"after:release"
```

在某个阶段做一些自己想做的事情。

## 示例1：格式化变更日志

我们可以举一个简单的例子,在生成变更日志之后，自动 format 一下

```ts
import { defineConfig } from "smarty-release";

export default defineConfig({
  //...
  hooks: {
    "after:changelog": "prettier --write CHANGELOG.md",
  },
});
```

刚好钩子可以解决这个问题,那就是可以让用户使用外部自己的格式化工具来进行处理,这样可以和项目保持一致的风格。因为每个项目用的formatter工具可能都不一样：

- prettier
- Biome
- Oxfmt
- dprint

使用钩子的设计则刚好可以解决这个问题

## 示例2：使用自己的变更日志生成工具

假如你真的不喜欢内置的`git-cliff`,你想使用自己的日志生成工具,你可以这样做：

- 1.关闭内置的日志生成功能，把`git.changelog`设置为false
- 2.安装你喜欢的日志生成工具
- 3.在生命周期钩子中直接调用

这里我就用`conventional-changelog`来演示,先安装它

::: code-group

```sh [npm]
npm install conventional-changelog-cli conventional-changelog-angular -D
```

```sh [yarn]
yarn add conventional-changelog-cli conventional-changelog-angular -D
```

```sh [pnpm]
pnpm add conventional-changelog-cli conventional-changelog-angular -D
```

:::

然后在钩子中直接调用它，我们可以选择在选择完毕tag之后就可以生成变更日志了。

::: info
如果您不知道在什么步骤添加操作,可以查阅[生命周期钩子](/reference/lifecycle)文档。
:::

```ts
import { defineConfig } from "smarty-release";

export default defineConfig({
  // ...
  git: {
    // 禁用掉内置的日志生成功能
    changelog: false,
  },
  hooks: {
    "after:selectTag": "conventional-changelog -p angular -i CHANGELOG.md -s",
  },
});
```

## 上下文

## 钩子输出

默认`Smarty-Release`是不会输出钩子中的任何打印信息的。因为很多命令的输出太多内容会破坏
