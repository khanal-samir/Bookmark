import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/DbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
import { ApiResponse } from "@/lib/ApiResponse";
const getUser = async (): Promise<mongoose.Types.ObjectId | Response> => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !user) {
      return ApiResponse.unauthorized();
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    return userId;
  } catch (error) {
    console.error("Error while getting session", error);
    return ApiResponse.error("Something went wrong while getting session");
  }
};
export default getUser;
