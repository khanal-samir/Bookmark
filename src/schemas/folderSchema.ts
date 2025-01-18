import { z } from "zod";
const titleValidation = z.string().max(20, "Word Limit is reached");
const descriptionValidation = z.string().max(256, "Word Limit is reached");
const isImportantValidation = z.boolean().default(false);
const folderIdValidaton = z.string();

export const addFolderSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  isImportant: isImportantValidation,
});

export const updateFolderSchema = z.object({
  folderId: folderIdValidaton,
  title: titleValidation.optional(),
  isImportant: isImportantValidation.optional(),
  description: descriptionValidation.optional(),
});
