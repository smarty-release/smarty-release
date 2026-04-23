import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Smarty-Release",
  base: "/smarty-release/",
  description: "更智能的 `npm publish`",
  head: [
    ["link", { rel: "icon", href: "favicon.svg", type: "image/svg+xml" }],
    [
      "meta",
      {
        name: "google",
        content: `notranslate`,
      },
    ],
  ],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(tabsMarkdownPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "指南", link: "/guide/", activeMatch: "/guide/" },
      {
        text: "参考",
        link: "/reference/cli",
        activeMatch: "/reference/",
      },
    ],
    outline: {
      level: "deep",
    },
    logo: { src: "/logo-mini.svg", width: 24, height: 24 },
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          base: "/guide/",
          items: [
            { text: "简介", link: "/" },
            { text: "快速开始", link: "getting-started" },
            { text: "配置文件", link: "config-file" },
            { text: "变更日志", link: "changelog" },
            { text: "Hooks", link: "hooks" },
          ],
        },
      ],

      "/reference/": [
        {
          text: "参考",
          base: "/reference/",
          items: [{ text: "CLI", link: "cli" }],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/smarty-release/smarty-release",
      },
    ],
  },
});
