# 介绍

**Smarty-Release**是一个npm包发布时的辅助工具。提供了npm包发布时的必要的编排流程，它可以避免手动操作时容易出错的问题。

## 起源

**Smarty-Release**的最初模型实际上来自开源 vitepress 项目的 [scripts/release.js](https://github.com/vuejs/vitepress/blob/main/scripts/release.js) 脚本,最开始我也在我的很多npm包中使用了这个脚本来辅助发版,但是随着npm包越来越多这种方式就会暴露以下问题：

- 每次都要复制一遍脚本到新项目，繁琐😖！！。
- package.json中需要安装较多依赖项😅
- 假如优化了流程上的某个步骤,需要在所有项目中都去改一遍😭！！
- 变更日志生成功能不够强大和个性化

## 其它解决方案

是否在闭门造车？在做一个开源项目之前可以先问问AI是否有成熟的解决方案。给出的解决方案有：

- [np](https://github.com/sindresorhus/np)
- [release-it](https://www.npmjs.com/package/release-it)

看了一下它们的Star,好家伙,都还不低。上手尝试了一下总结了它们的问题：

- 不轻量,依赖太重(dependencies)
- 功能比较全面,配置项太多,实际上很多都用不上

## 整体设计

基于以上问题,于是**Smarty-Release**就这样诞生了,基本上只是对 [vitepress/scripts/release.js](https://github.com/vuejs/vitepress/blob/main/scripts/release.js)逻辑的提取,并做了以下改动：

- 把部分依赖项换成了更轻量且维护活跃的包
- 变更日志生成功能替换成了基于rust的git-cliff
- 借鉴release-it项目的钩子设计
- 借鉴了np项目的部分思想(比如：release失败恢复到原始状态)

因此**Smarty-Release**是一个非常简单且轻量的工具。

## 致谢 🙏

- [vitepress](https://github.com/vuejs/vitepress)
- [git-cliff](https://github.com/orhun/git-cliff)
- [release-it](https://github.com/release-it/release-it)
- [np](https://github.com/sindresorhus/np)
