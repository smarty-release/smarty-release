# 变更日志

生成变更日志是`Smarty-Release`的核心功能。因此最终选择基于rust的可以高度自定义的日志生成工具[git-cliff](https://github.com/orhun/git-cliff)。

## 启用变更日志生成

`Smarty-Release` 已内置 `git-cliff`，可通过[配置文件](./config-file/#writing-a-config-file)中的 `git.changelog` 进行配置。

```ts{6-13}
import type { UserConfig } from "smarty-release";

export default {
  //...
  git: {
    changelog: {
      // git-cliff 命令行参数
      args: "-o --tag ${version}",
      // 模板
      template: "github",
      // 对所指定模板的扩展(这里就是对github模板进行覆盖)
      config: {},
    },
  },
} satisfies UserConfig;
```

::: tip
如果您想关闭变更日志生成功能可以把`changelog`设置为`false`
:::

## 模板配置(template)

## 自定义配置(config)

git-cliff是需要通过生成`toml`或者`yaml`格式的[配置文件](https://git-cliff.org/docs/usage/initializing)来自定义生成的变更日志的模板,然后把收集到的[上下文](https://git-cliff.org/docs/templating/context)数据,通过`tera`模板引擎来进行渲染生成最终的`CHANGELOG.md`。
