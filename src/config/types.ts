import type { ReleaseType } from "semver";
import type { OverrideProperties, RequiredDeep, MergeDeep } from "type-fest";
import type { ConsolaInstance } from "consola";
export type { ReleaseType } from "semver";

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

export type ChangelogOptions = {
  args?: string | string[];
  template?: ChangelogPreset;
  config?: ChangelogPresetOverride; // 对 template 的覆盖
};

type DistTag =
  | "latest"
  | "next"
  | "beta"
  | "alpha"
  | "canary"
  | "rc"
  | (string & {}); // 允许自定义

export type HookEvent =
  | "before:init"
  | "before:selectVersion"
  | "after:selectVersion"
  | "after:bump"
  | "after:release"
  | "before:selectTag"
  | "after:selectTag"
  | "before:changelog"
  | "after:changelog"
  | "before:bump"
  | "before:git"
  | "before:git.add"
  | "after:git.add"
  | "before:git.commit"
  | "after:git.commit"
  | "before:git.tag"
  | "after:git.tag"
  | "before:git.push"
  | "after:git.push"
  | "after:git";

export type HookContext = ReleaseContext & {
  logger: ConsolaInstance;
  cancel(message?: string): never;
};
type HookFn = (ctx: HookContext) => any | Promise<any>;

export type Hook = string | HookFn | (string | HookFn)[];
export type Hooks = Partial<Record<HookEvent, Hook>>;
export type HooksArray = Partial<Record<HookEvent, (string | HookFn)[]>>;

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

  cwd?: string;
}

export interface InlineConfig extends UserConfig {
  /**
   * Config file path
   */
  config?: string;

  dryRun?: boolean;
}

type RequiredInlineConfig = RequiredDeep<InlineConfig>;
export type ResolvedConfig = MergeDeep<
  RequiredInlineConfig,
  OverrideProperties<
    RequiredInlineConfig,
    {
      git: {
        changelog:
          | false
          | {
              args: string[];
              config?: ChangelogPresetOverride;
            };
      };
      hooks: HooksArray;
      config?: string;
    }
  >
>;

/**
 * CLI运行时产生的一些配置
 */
export interface ReleaseContext {
  name: string;
  tag: string;
  version: string;
  git: {
    branch: string;
  };
  repo: {
    owner: string;
    repository: string;
  };
}
