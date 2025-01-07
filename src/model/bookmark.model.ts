import mongoose, { Schema, Document } from "mongoose";
import { User } from "./user.model";
import { Folder } from "./folder.model";
export interface Bookmark extends Document {
  userId: User;
  title: string;
  url: string;
  description: string;
  isImportant: boolean;
  folderID: Folder;
  updatedAt: Date;
  createdAt: Date;
}

const bookmarkSchema: Schema<Bookmark> = new Schema(
  {
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      index: true,
      default: "No title",
    },
    url: {
      required: [true, "URL is required"],
      type: String,
      match: [
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
        "Please use a valid URL",
      ],
    },
    description: {
      type: String,
      default: "No Description",
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    folderID: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  },
  { timestamps: true },
);

const BookmarkModel =
  (mongoose.models.Bookmark as mongoose.Model<Bookmark>) ||
  mongoose.model("Bookmark", bookmarkSchema);
export default BookmarkModel;
