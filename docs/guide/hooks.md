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

在某个阶段做一些自己想做的事情

## 示例

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

刚好钩子可以解决这个问题,那就是可以让用户使用外部自己的格式化工具来进行处理,这样可以和项目保持一致的风格
。因为每个项目用的formatter工具可能都不一样：

- prettier
- Biome
- Oxfmt
- dprint

使用钩子的设计则刚好可以解决这个问题
