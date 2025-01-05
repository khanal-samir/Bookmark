import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bookmark",
  description: "The only bookmark storage you need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${poppins.variable} font-poppins antialiased`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
