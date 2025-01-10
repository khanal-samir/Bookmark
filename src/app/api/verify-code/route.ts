import { ApiResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";

export const POST = async (request: Request): Promise<Response> => {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username); // decodes endoded value
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return ApiResponse.notFound("User not found");
    }
    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return ApiResponse.success(
        null,
        "Account verified successfully. Please Sign-in to proceed.",
      );
    } else if (!isCodeNotExpired) {
      // Code has expired

      return ApiResponse.badRequest(
        "Verification code has expired. Please sign up again to get a new code",
      );
    } else {
      // Code is incorrect

      return ApiResponse.badRequest("Incorrect verification code");
    }
  } catch (error) {
    console.error("Error Verifying user", error);
    return ApiResponse.error("Error verifying username", 500);
  }
};
