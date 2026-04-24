# Command Line

```
npm install smarty-release -D
npx smarty-release --help

Usage:
  $ smarty-release [run]

Commands:
  [run]      Start release process
  changelog  Options to pass to git-cliff

For more info, run any command with the `--help` flag:
  $ smarty-release --help
  $ smarty-release changelog --help

Options:
  -d, --dry-run        Simulate release without applying changes.
  -c, --config <path>  Path to the config file
  -V, --verbose        Verbose output (user hooks output)
  -h, --help           Display this message
  -v, --version        Display version number
```

<a id="changelog-command"></a>

## changelog命令

您可以通过该命令把参数传递给git-cliff。可以查阅git-cliff的[命令行参数](https://git-cliff.org/docs/usage/args)相关文档。

::: warning
该命令也会尊重`Smarty-Release`配置文件
:::
