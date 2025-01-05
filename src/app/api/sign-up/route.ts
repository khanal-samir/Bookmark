import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendEmail";

export const POST = async (request: Request) => {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // if username exists
    const isExistingUsernameVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isExistingUsernameVerified) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }
    // if email is already exisiting
    const isExistingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isExistingUserByEmail) {
      if (isExistingUserByEmail.isVerified) {
        // if verifed
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
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
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 },
    );
  }
};
