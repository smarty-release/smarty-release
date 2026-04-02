import type { LogType } from "consola";
// 基础错误类
export class BaseError extends Error {
  level: LogType;

  constructor(message: string, level: LogType = "error") {
    super(message);
    this.name = this.constructor.name; // 自动使用类名作为 name
    this.level = level;
    // 修复 TS 的 Error 继承问题
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 用户取消错误
export class CancelledError extends BaseError {
  constructor(message: string = "Release cancelled by user") {
    super(message, "warn");
  }
}

// 当前目录非 Git 仓库错误
export class NotGitRepoError extends BaseError {
  constructor(
    message: string = "Current working directory is not a git repository.",
  ) {
    super(message);
  }
}

// Git 工作目录不干净错误
export class GitDirtyError extends BaseError {
  constructor(
    message: string = "Working directory is not clean. Please commit your changes.",
  ) {
    super(message);
  }
}

export class NotAllowedBranchError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
