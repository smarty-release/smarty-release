import { z } from "zod";

/**
 * Hook：string | function | array
 */
const hookSchema = z.union([
  z.string(),
  z.function(),
  z.array(z.union([z.string(), z.function()])),
]);

const hooksSchema = z.record(hookSchema.optional());

const changelogOptionsSchema = z.object({
  args: z.union([z.string(), z.array(z.string())]).optional(),
  template: z.string().optional(),
  config: z.any().optional(),
});

const gitSchema = z.object({
  changelog: z
    .union([z.literal(false), changelogOptionsSchema.optional()])
    .optional(),

  requireBranch: z
    .union([
      z.string(),
      z.array(z.string()),
      z.instanceof(RegExp),
      z.literal(false),
    ])
    .optional(),

  commitMessage: z.string().optional(),
  tagName: z.string().optional(),
});

export const userConfigSchema = z.object({
  increments: z.array(z.enum(["patch", "minor", "major"])).optional(),

  tags: z.array(z.string()).optional(),

  git: gitSchema.optional(),

  hooks: hooksSchema.optional(),

  cwd: z.string().optional(),
});

/**
 * InlineConfig = UserConfig + CLI扩展
 */
export const inlineConfigSchema = userConfigSchema.extend({
  config: z.string().optional(),
  dryRun: z.boolean().optional(),
});
