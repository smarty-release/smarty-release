import type { RequiredDeep } from "type-fest";
import type { ReleaseType } from "semver";

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
  preset?: ChangelogPreset;
  args?: string | string[];
  presetOverride?: ChangelogPresetOverride; // 对 preset 的覆盖
};
export type Hook = string | Function | (string | Function)[] | undefined;

type DistTag =
  | "latest"
  | "next"
  | "beta"
  | "alpha"
  | "canary"
  | "rc"
  | (string & {}); // 允许自定义

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
  hooks?: Record<string, Hook>;
}
export type FullUserConfig = RequiredDeep<UserConfig>;
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
