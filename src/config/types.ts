import type { RequiredDeep } from "type-fest";
import type { ReleaseType } from "semver";
type ChangelogOptions = {
  args?: string | string[];
  template?: unknown[];
};
export type Hook = string | Function | (string | Function)[] | undefined;

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
  tags?: string[];
  /** 控制变更日志是否生成 */
  changelog?: false | ChangelogOptions;
  /** 控制 Git 操作行为 */
  git?: {
    requireBranch?: boolean | string;
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
