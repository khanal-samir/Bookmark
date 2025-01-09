import { ApiResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";
import { emailValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const emailQuerySchema = z.object({
  email: emailValidation,
});

export const GET = async (req: Request) => {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url); // queries
    const queryParam = {
      email: searchParams.get("email"), // take only email
    };
    //validate with zod
    const result = emailQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().email?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }
    const { email } = result.data;
    const existingUser = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUser) {
      return ApiResponse.error("Email already exists");
    }
    return ApiResponse.success(null, "Email is unique");
  } catch (error: any) {
    console.error(
      "Something went wrong while checking unique username",
      error.message,
    );
    ApiResponse.error("Something went wrong while checking unique username");
  }
};
