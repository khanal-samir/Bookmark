"use client";

import React from "react";
import { Button } from "../ui/button";
import addFiles from "../../../public/undraw_my-files_yynz.svg";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
const leftContentVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Hero = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around p-4 sm:p-6 overflow-x-hidden">
      <motion.div
        className="flex flex-col font-semibold gap-4 sm:gap-6 mb-6 sm:mb-0"
        initial="hidden"
        animate="visible"
        variants={leftContentVariants}
      >
        <motion.div
          className="flex flex-col gap-2 sm:gap-4 justify-center items-center"
          variants={leftContentVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-[64px] font-bold"
            variants={leftContentVariants}
          >
            The Bookmark
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl"
            variants={leftContentVariants}
          >
            Manage your bookmarks efficiently!
          </motion.p>
        </motion.div>

        <motion.div
          className="flex gap-4 justify-center items-center"
          variants={leftContentVariants}
        >
          {!session ? (
            <>
              <Link href="/sign-up">
                {" "}
                <Button className="bg-blue-500 hover:bg-blue-700 w-24 sm:w-32 h-10 sm:h-12 rounded-xl shadow-md">
                  <span className="font-bold">Signup</span>
                </Button>
              </Link>
              <Link href="/sign-in">
                {" "}
                <Button
                  variant="outline"
                  className="text-blue-500 border-blue-500 hover:bg-blue-300 w-24 sm:w-32 h-10 sm:h-12 rounded-xl shadow-md"
                >
                  <span className="font-bold">Login</span>
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              {" "}
              <Button
                variant="outline"
                className="text-blue-500 border-blue-500 hover:bg-blue-300 w-24 sm:w-32 h-10 sm:h-12 rounded-xl shadow-md"
              >
                Dashboard
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={imageVariants}>
        <Image
          src={addFiles}
          alt="svg"
          width={384}
          height={384}
          className="h-auto max-w-[384px]"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
