# 后续CI/CD 集成

当你成功推送到远程仓库后,你需要下面的步骤

1. 创建github的[release](https://docs.github.com/zh/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
2. 推送到[npmjs](https://www.npmjs.com/)

由于在推送时您已经打了tag,那么您可以检测到tag推送后执行一个流水线帮助您自动进行以上操作。

## GitHub Actions

这里以GitHub Actions 工作流为例，在您的项目根目录下创建工作流文件（Workflow file）`.github/workflows/release.yml`(名称随意)

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

permissions:
  contents: write # 使能够发布GitHub版本
  id-token: write # OIDC 发布所必须的

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Set up pnpm
        uses: pnpm/action-setup@v5

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: "https://registry.npmjs.org"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Publish to npm
        run: pnpm publish --no-git-checks

      - name: Generate a latest changelog
        run: pnpm exec smarty-release changelog -vv -o --latest
        env:
          GITHUB_REPO: ${{ github.repository }}

      - name: Github Release
        uses: softprops/action-gh-release@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          body_path: CHANGELOG.md
          prerelease: ${{ contains(github.ref_name, '-') }}
```

然后当您使用`Smarty-Release`推送后该工作流会自动运行,完成后续的工作。

## 发布到npmjs

npmjs原本是可以申请永久有效的token的,但是在2025-12-09起npm官方开始发[博客](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)要删除所有的永久有效的token，并且已经无法再生成所有的永久有效的token，最长也只能生成90天的有效期。

npm官方建议取而代之的是使用[可信发布](https://docs.npmjs.com/trusted-publishers)。
可信发布功能允许您使用OpenID Connect (OIDC)身份验证直接从 CI/CD 工作流发布 npm 包，从而无需长期有效的 npm 令牌

### 可信发布快速指南

首先去[npmjs](https://www.npmjs.com/)登录后找到自己的包，点击`setting`按钮，然后配置仓库地址，以及流水线的名称，保存即可。

::: tip
更详细的图文步骤可以查看官方的文档[配置可信发布](https://docs.npmjs.com/trusted-publishers#configuring-trusted-publishing)。
:::

### 可能遇到的问题

您可以会遇到因为`package.json`文件中缺少`"repository.url"`配置项而导致`npm publish`命令报错：

```
Error verifying sigstore provenance bundle:
Failed to validate repository information:
package.json: "repository.url" is "",
expected to match "https://github.com/xxx/xxxx" from provenance
```

因为可信发布会检测您是否正确配置了仓库。所以您需要在您的`package.json`添加以下配置：

```json{5-8}
{
  "name": "you-awesome-project",
  "version": "1.8.1",
  //...
  "repository": { // [!code ++]
    "type": "git", // [!code ++]
    "url": "https://github.com/owner/repository.git" // [!code ++]
  } // [!code ++]
}
```

## 创建github的Release

观察`.github/workflows/release.yml`示例,我们知道我们是通过[softprops/action-gh-release](https://github.com/softprops/action-gh-release)来创建Github的Release的。

其中的`body_path`：字符串类型，用于指定一个文件路径，从该文件加载内容作为本次发布中“重要变更”的说明。

```yaml
body_path: CHANGELOG.md
```

这里指定的是`CHANGELOG.md`，那么它是从哪里来的呢？

```yaml{1-4}
- name: Generate a latest changelog
  run: pnpm exec smarty-release changelog -vv -o --latest
  env:
    GITHUB_REPO: ${{ github.repository }}

- name: Github Release
  uses: softprops/action-gh-release@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    body_path: CHANGELOG.md
    prerelease: ${{ contains(github.ref_name, '-') }}
```

它是`Smarty-Release`提供的一个子命令临时在当前仓库目录生成的,意思是只取最后一个最新版本的变更日志来作为Github Release的正文内容。

::: tip
关于子命令`changelog`的详细说明[参阅](/reference/cli#changelog-command)。
:::
