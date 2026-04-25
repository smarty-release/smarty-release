# 快速开始

## 安装

::: code-group

```sh [npm]
npm install smarty-release -D
```

```sh [yarn]
yarn add smarty-release -D
```

```sh [pnpm]
pnpm add smarty-release -D
```

:::

恭喜你🎉,已经可以使用`smarty-release`了

## 使用 CLI

要验证 `smarty-release` 是否正确安装，请在项目目录中运行以下命令：

```sh
./node_modules/.bin/smarty-release --version
```

您还可以通过以下命令查看可用的 CLI 选项和示例：

```sh
./node_modules/.bin/smarty-release --help
```

## 在 npm 脚本中使用 CLI

为了简化命令，您可以将其添加到 `package.json` 的脚本中：

```json{5} [package.json]
{
  "name": "you-awesome-project",
  "type": "module",
  "scripts": {
    "release": "smarty-release"
  },
  "devDependencies": {
    "smarty-release": "^0.0.1"
  }
}
```

现在，您可以通过以下命令释放项目：

```sh
npm run release
```

## 使用配置文件

虽然可以直接使用 CLI，但对于更加复杂且更个性化的项目，推荐使用配置文件。这可以让您以集中且可复用的方式定义和管理发行设置。

有关更多详细信息，请参阅 [配置文件](./config-file.md) 文档。
