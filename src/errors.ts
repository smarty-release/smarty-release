export class CancelledError extends Error {
  code: string;
  isCancelled: boolean;

  constructor(message: string = "Release cancelled by user") {
    super(message);
    this.name = "CancelledError";
    this.code = "USER_CANCEL";
    this.isCancelled = true;

    // 修复 TS 的继承 Error 时原型链问题
    Object.setPrototypeOf(this, CancelledError.prototype);
  }
}

export class NotGitRepoError extends Error {
  code: string;

  constructor(
    message: string = "Current working directory is not a git repository.",
  ) {
    super(message);
    this.name = "NotGitRepoError";
    this.code = "NOT_GIT_REPO";

    Object.setPrototypeOf(this, NotGitRepoError.prototype);
  }
}

export class GitDirtyError extends Error {
  code: string;

  constructor(
    message: string = "Working directory is not clean. Please commit your changes.",
  ) {
    super(message);
    this.name = "GitDirtyError";
    this.code = "GIT_DIRTY";

    Object.setPrototypeOf(this, GitDirtyError.prototype);
  }
}
