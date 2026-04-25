import "virtual:group-icons.css";
import type { Theme } from "vitepress";
import { h, nextTick, watch } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { createMermaidRenderer } from "vitepress-mermaid-renderer";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { isDark, localeIndex } = useData();

    let mermaidRenderer: ReturnType<typeof createMermaidRenderer>;

    const applyToolbar = () => {
      mermaidRenderer.setToolbar({
        i18n: {
          localeIndex: localeIndex.value,
          tooltips: {
            copyCode: "复制成功",
          },
          locales: {
            root: {
              tooltips: {
                zoomIn: "放大",
                zoomOut: "缩小",
                resetView: "重置视图",
                copyCode: "复制代码",
                download: "下载图表",
                toggleFullscreen: "切换全屏",
              },
            },
          },
        },
      });
    };

    const initMermaid = () => {
      mermaidRenderer = createMermaidRenderer({
        theme: isDark.value ? "dark" : "forest",
      });

      applyToolbar();
    };

    // 初始渲染
    nextTick(() => initMermaid());

    // 主题切换
    watch(
      () => isDark.value,
      () => {
        initMermaid();
      },
    );

    // 语言切换（关键）
    watch(localeIndex, () => {
      applyToolbar();
    });

    return h(DefaultTheme.Layout);
  },

  enhanceApp({ app }) {
    enhanceAppWithTabs(app);
  },
} satisfies Theme;
