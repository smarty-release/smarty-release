import type { ReleaseType } from "semver";
import type { OverrideProperties, RequiredDeep } from "type-fest";
import type { ConsolaInstance } from "consola";

export type ChangelogPreset =
  | "azure-devops-keepachangelog"
  | "cocogitto"
  | "detailed"
  | "github-keepachangelog"
  | "github"
  | "keepachangelog"
  | "minimal"
  | "scoped"
  | "scopesorted"
  | "statistics"
  | "unconventional"
  | (string & {}); // 任意字符串，兼容远程链接

// commit parser 类型
export interface CommitParser {
  message: string; // 正则或匹配字符串
  group: string; // commit 分类
}

// git 配置
export interface ChangelogGitConfig {
  conventional_commits?: boolean;
  filter_unconventional?: boolean;
  commit_parsers?: CommitParser[];
  filter_commits?: boolean;
  topo_order?: boolean;
  sort_commits?: "oldest" | "newest";
}

// changelog 内容配置
export interface ChangelogContentConfig {
  header?: string;
  body?: string;
  footer?: string;
  trim?: boolean;
}

// remote 配置
export interface ChangelogRemoteConfig {
  github?: {
    owner?: string;
    repo?: string;
    token?: string;
  };
  azure_devops?: {
    owner?: string;
    repo?: string;
    token?: string;
  };
  [key: string]: any;
}

// presetOverride 配置
export interface ChangelogPresetOverride {
  remote?: ChangelogRemoteConfig;
  changelog?: ChangelogContentConfig;
  git?: ChangelogGitConfig;
}

type ChangelogOptions = {
  args?: string | string[];
  preset?: ChangelogPreset;
  presetOverride?: ChangelogPresetOverride; // 对 preset 的覆盖
};

type DistTag =
  | "latest"
  | "next"
  | "beta"
  | "alpha"
  | "canary"
  | "rc"
  | (string & {}); // 允许自定义

export type HookContextMap = {
  "before:init": { logger: ConsolaInstance };
  "before:selectVersion": { logger: ConsolaInstance };
  "after:selectVersion": { version: string; logger: ConsolaInstance };
  "after:bump": { version: string };
  "after:release": { version: string };
  "before:selectTag": { version: string };
  "after:selectTag": { version: string };
  "before:changelog": { version: string };
  "after:changelog": { version: string };
  "before:bump": { version: string };
  "before:git": { version: string };
  "before:git.add": { version: string };
  "after:git.add": { version: string };
  "before:git.commit": { version: string };
  "after:git.commit": { version: string };
  "before:git.tag": { version: string };
  "after:git.tag": { version: string };
  "before:git.push": { version: string };
  "after:git.push": { version: string };
  "after:git": { version: string };
};

type HookFn<K extends keyof HookContextMap> = (
  ctx: HookContextMap[K],
) => any | Promise<any>;

export type Hook<K extends keyof HookContextMap> =
  | string
  | HookFn<K>
  | (string | HookFn<K>)[];

type Hooks = {
  [K in keyof HookContextMap]?: Hook<K>;
};

export type AnyHook = Hook<keyof HookContextMap>;

/**
 * Options for release-pls.
 */
export interface UserConfig {
  /**
   * 控制版本号递增类型（符合语义化版本 SemVer）
   *
   * @example
   *  patch → 修复 bug（1.0.0 → 1.0.1）
   *  minor → 新功能（1.0.0 → 1.1.0）
   *  major → 破坏性更新（1.0.0 → 2.0.0）
   */
  increments?: ReleaseType[];

  /**
   * 发布时使用的 npm dist-tag
   */
  tags?: DistTag[];

  /** 控制 Git 操作行为 */
  git?: {
    /** 变更日志是否生成 */
    changelog?: false | ChangelogOptions;
    requireBranch?: string | string[] | RegExp | false;
    commitMessage?: string;
    tagName?: string;
  };

  /** 生命周期钩子 */
  hooks?: Hooks;
}

export type ResolvedConfig = OverrideProperties<
  RequiredDeep<UserConfig>,
  {
    hooks: Hooks; // 👈 覆盖回“key 可选”
    git: OverrideProperties<
      RequiredDeep<UserConfig>["git"],
      {
        changelog:
          | false
          | OverrideProperties<
              RequiredDeep<ChangelogOptions>,
              { presetOverride?: ChangelogPresetOverride }
            >;
      }
    >;
  }
>;

/**
 * CLI运行时产生的一些配置
 */
export interface ReleaseContext {
  cwd: string;
  env: NodeJS.ProcessEnv;
  name?: string;
  tag?: string;
  version?: string;

  git?: {
    branch?: string;
  };

  repo?: {
    owner?: string;
    repository?: string;
  };
}

export type { ReleaseType } from "semver";
