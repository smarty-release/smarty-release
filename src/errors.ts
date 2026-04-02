// 基础错误类
export class BaseError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name; // 自动使用类名作为 name

    // 修复 TS 的 Error 继承问题
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 用户取消错误
export class CancelledError extends BaseError {
  isCancelled: boolean;

  constructor(message: string = "Release cancelled by user") {
    super("USER_CANCEL", message);
    this.isCancelled = true;
  }
}

// 当前目录非 Git 仓库错误
export class NotGitRepoError extends BaseError {
  constructor(
    message: string = "Current working directory is not a git repository.",
  ) {
    super("NOT_GIT_REPO", message);
  }
}

// Git 工作目录不干净错误
export class GitDirtyError extends BaseError {
  constructor(
    message: string = "Working directory is not clean. Please commit your changes.",
  ) {
    super("GIT_DIRTY", message);
  }
}
