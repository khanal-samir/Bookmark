import { z } from "zod";

export const bookmarkSchema = z.object({
  title: z.string().max(20, "Word Limit is reached").optional(),
  url: z.string().url("Must be a valid URL"),
  description: z.string().max(256, "Word Limit is reached").optional(),
  isImportant: z.boolean().default(false),
});
