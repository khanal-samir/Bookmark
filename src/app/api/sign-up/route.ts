import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendEmail";
import { ApiResponse } from "@/lib/ApiResponse";

export const POST = async (request: Request): Promise<Response> => {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // if username exists
    const isExistingUsernameVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isExistingUsernameVerified) {
      return ApiResponse.badRequest("Username is already taken");
    }
    // if email is already exisiting
    const isExistingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isExistingUserByEmail) {
      if (isExistingUserByEmail.isVerified) {
        return ApiResponse.badRequest("User already exists with this email");
      } else {
        // not verified
        //update document
        const hashedPassword = await bcrypt.hash(password, 10);
        isExistingUserByEmail.password = hashedPassword;
        isExistingUserByEmail.verifyCode = verifyCode;
        isExistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await isExistingUserByEmail.save();
      }
    } else {
      //create
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(); // becomes object
      expiryDate.setHours(expiryDate.getHours() + 1);

      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        oAuthProvider: false,
      });
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    if (!emailResponse.success) {
      return ApiResponse.error(
        emailResponse.message || "Someting went wrong while sending email",
      );
    }
    return new ApiResponse(
      201,
      null,
      "User registered successfully. Please verify your account.",
    ).send();
  } catch (error) {
    console.log("Error registering User", error);
    return new ApiResponse(500, null, "Error registering user").send();
  }
};
