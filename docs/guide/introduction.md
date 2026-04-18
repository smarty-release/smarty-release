# 简介

`npm publish`命令智能且轻量的替代品。

## 背景

## 特性

- 交互式 UI
- 确保你是从发布分支进行发布（默认是关闭）
- 确保工作目录是干净的
- 每个步骤都有钩子
- package.json 和 package-lock.json(如果存在)文件版本提升
- 自动Git操作 add,commit, tag, push
- 防止将预发布版本意外发布到 npm 的 `latest` 标签下
- 可灵活的配置npm dist tag
- 如果发布失败，会将项目回滚到之前状态
- 自动生成变更日志(基于[git-cliff](https://github.com/orhun/git-cliff))

## 谁在用

- adminlts
