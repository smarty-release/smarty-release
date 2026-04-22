# 🤖 Smarty-Release

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![npm](https://img.shields.io/npm/v/smarty-release)](https://www.npmjs.com/package/smarty-release)

更好，更智能的 `npm publish` 替代品 🚀。

## 特性

- 交互式 CLI UI
- 交互式语义化版本（SemVer）管理（patch / minor / major / custom）
- 确保在指定发布分支上执行发布
- 确保 Git 工作目录干净
- 基于 git-cliff 自动生成变更日志
- 灵活的生命周期钩子系统
- 自动更新 package.json 和 lock(如果存在) 文件版本
- 自动执行 Git 操作（add / commit / tag / push）
- 防止预发布版本误发布到 npm `latest`
- 支持灵活配置 npm [dist-tags](https://docs.npmjs.com/cli/dist-tag)
- 发布失败自动回滚到初始状态

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
