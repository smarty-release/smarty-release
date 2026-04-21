# 🤖 Smarty-Release

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![npm](https://img.shields.io/npm/v/smarty-release)](https://www.npmjs.com/package/smarty-release)

更好，更智能的 `npm publish` 替代品 🚀。

## 特性

- 交互式 UI
- 确保你是从发布分支进行发布（默认是关闭）
- 确保工作目录是干净的
- 每个步骤都有钩子
- package.json 和 package-lock.json(如果存在)文件版本提升
- 自动Git操作 add,commit, tag, push
- 防止将预发布版本意外发布到 npm 的 `latest` 标签下
- 可灵活的配置npm[dist tags](https://docs.npmjs.com/cli/dist-tag)
- 如果发布失败，会将项目回滚到之前状态
- 自动生成变更日志

## 文档

如需完整文档，请访问[Documentation](https://smarty-release.github.io/smarty-release/)。

## 安装

```bash
npm i -D smarty-release
```

## 使用

```bash
npx smarty-release
```

## 谁在用

- adminlts

## License

[MIT](https://github.com/smarty-release/smarty-release/blob/main/LICENSE)
