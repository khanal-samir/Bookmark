import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  oAuthProvider: boolean;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required() {
      return !this.oAuthProvider; // if there is oauth then becomes false else true
    },
  },
  verifyCode: {
    type: String,
    required() {
      return !this.oAuthProvider;
    },
  },
  verifyCodeExpiry: {
    type: Date,
    required() {
      return !this.oAuthProvider;
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  oAuthProvider: {
    type: Boolean,
    default: false,
  },
});
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", userSchema);
export default UserModel;
