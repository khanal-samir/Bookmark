import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { IApiResponse } from "@/types/apiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string,
): Promise<IApiResponse> => {
  try {
    await resend.emails.send({
      from: "Bookmark <onboarding@resend.dev>",
      to: email,
      subject: "Bookmark | Email Verification",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};
