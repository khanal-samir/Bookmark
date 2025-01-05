import mongoose, { Schema, Document } from "mongoose";
import { User } from "./user.model";
import { Bookmark } from "./bookmark.model";
export interface Folder extends Document {
  userId: User;
  title: string;
  description: string;
  bookmarks: Bookmark[];
  isImportant: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const folderSchema: Schema<Folder> = new Schema(
  {
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
    title: {
      required: [true, "Title is required"],
      type: String,
      index: true,
      unique: true,
      default: "No title",
    },
    description: {
      type: String,
      unique: true,
      default: "No Description",
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const FolderModel =
  (mongoose.models.Folder as mongoose.Model<Folder>) ||
  mongoose.model("Folder", folderSchema);
export default FolderModel;
