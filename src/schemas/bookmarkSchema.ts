import { z } from "zod";

export const BookmarkIdValidation = z.string();
const titleValidation = z.string().max(20, "Word Limit is reached");
const urlValidation = z.string().url("Must be a valid URL");
const descriptionValidation = z.string().max(256, "Word Limit is reached");
const isImportantValidation = z.boolean().default(false);
export const addBookmarkSchema = z.object({
  title: titleValidation,
  url: urlValidation,
  description: descriptionValidation,
  isImportant: isImportantValidation,
});

export const updateBookmarkSchema = z.object({
  bookmarkId: BookmarkIdValidation,
  title: titleValidation.optional(),
  url: urlValidation.optional(),
  isImportant: isImportantValidation.optional(),
  description: descriptionValidation.optional(),
});
