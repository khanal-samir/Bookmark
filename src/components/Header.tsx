"use client";
import React, { useEffect } from "react";
import Bookmark from "../../public/Bookmark.png";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Toggle } from "./ui/toggle";
import { motion } from "framer-motion";
import { useTheme } from "@/store/theme";

const leftVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

const rightVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Header = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      // without persist it wont work on refreshing
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.div
      className="flex justify-between px-10 md:px-20  pb:2 md:pb-4 items-center font-bold overflow-x-hidden"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Link href="/">
        <motion.div
          className="flex justify-center items-center gap-2"
          variants={leftVariants}
        >
          <Image src={Bookmark} alt="logo" className="w-12 h-12" />
          <motion.p className="sm:text-xl" variants={leftVariants}>
            Bookmark
          </motion.p>
        </motion.div>
      </Link>

      <motion.div
        className="flex gap-4 items-center justify-center"
        variants={rightVariants}
      >
        <Toggle
          variant="outline"
          aria-label="Toggle Theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </Toggle>

        {session ? (
          <motion.div
            className="flex items-center gap-2 font-xl"
            variants={rightVariants}
          >
            <Link href="/dashboard">
              <motion.p variants={rightVariants}>Dashboard</motion.p>
            </Link>
            <LogOut onClick={() => signOut()} className="cursor-pointer" />
          </motion.div>
        ) : (
          <motion.div variants={rightVariants}>
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Header;
