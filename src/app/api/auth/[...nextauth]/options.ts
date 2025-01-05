import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      //google
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // credentials
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        //signin controller
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      await dbConnect();

      if (account && account.provider === "google") {
        try {
          // Check if user exists in the database
          if (!profile) {
            throw new Error("Profile is undefined");
          }

          //find using email
          let existingUser = await UserModel.findOne({ email: profile.email });
          //if not user create

          if (!existingUser) {
            existingUser = await UserModel.create({
              email: profile.email,
              username: profile.name ? profile.name : "", // Generate a username
              isVerified: true, // Automatically verify Google users
              oAuthProvider: true,
            });
          }
          // Ensure the user is marked as verified
          existingUser.isVerified = true;
          await existingUser.save();
          return true;
        } catch (err) {
          console.error("Error in signIn callback:", err);
          return false;
        }
      }

      return true;
    },
    // jwt
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
