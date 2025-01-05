import NextAuth from "next-auth/next";
import { authOptions } from "../[...nextauth]/options";

const handler = NextAuth(authOptions);

//http method
export { handler as GET, handler as POST };
