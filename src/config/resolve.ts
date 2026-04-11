import { NAME } from "../constants/index.ts";
import { defu } from "../utils/index.ts";
import { loadConfig } from "./index.ts";
import type { InlineConfig, ResolvedConfig, UserConfig } from "./types.ts";
import defaultsConfig from "./defaults.ts";

export async function resolveConfig(
  inlineConfig: InlineConfig = {},
): Promise<ResolvedConfig> {
  // 加载配置
  const fileConfig = await loadConfig<UserConfig>(NAME, inlineConfig.config);

  const merged = defu(inlineConfig, fileConfig, defaultsConfig);

  // 2.验证参数合法性，比如用zod，valibot啥的

  // 3.参数归一化处理,比如 args还有hooks里面的都最终要转成数组

  // 4.验证仓库本地状态,比如当前仓库是否干净，是否是一个已经初始化的仓库，是否是一个已经提交到远程的库

  return merged;
}
