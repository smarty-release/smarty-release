---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  image:
    src: /logo-large.svg
    alt: Smarty-Release
  name: Smarty-Release
  text: "用于 npm 包版本管理与发布的智能 CLI"
  tagline: "更好，更智能的 `npm publish`"
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: Github
      link: https://github.com/smarty-release/smarty-release

features:
  - title: 语义化版本
    details: 智能计算并推荐语义化版本
  - title: 变更日志
    details: 内部集成基于 Rust 的高性能 <b><a href="https://github.com/orhun/git-cliff" target="_blank">git-cliff</a></b>，用于生成变更日志
  - title: hooks
    details: 支持灵活的hooks
---
