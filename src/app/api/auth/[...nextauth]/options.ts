import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
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
            // Convert MongoDB document to a plain object and ensure _id is a string
            return {
              _id: user._id?.toString(),
              email: user.email,
              username: user.username,
              isVerified: user.isVerified,
            };
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

      if (account?.provider === "google" && profile?.email) {
        try {
          let existingUser = await UserModel.findOne({ email: profile.email });

          if (!existingUser) {
            existingUser = await UserModel.create({
              email: profile.email,
              username: profile.name ?? "",
              isVerified: true,
              oAuthProvider: true,
            });
          }

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
    async jwt({ token, user, account }) {
      if (user) {
        // For Google Sign In
        if (account?.provider === "google") {
          const dbUser = await UserModel.findOne({ email: user.email });
          if (dbUser) {
            token._id = dbUser._id?.toString();
            token.isVerified = dbUser.isVerified;
            token.username = dbUser.username;
          }
        } else {
          // For Credentials Sign In
          token._id = user._id;
          token.isVerified = user.isVerified;
          token.username = user.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
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
