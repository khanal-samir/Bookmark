"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import files from "../../../public/undraw_save-to-bookmarks_9o51 (1).svg";
import folders from "../../../public/undraw_folder-files_5www (1).svg";
import search from "../../../public/undraw_file-searching_2ne8.svg";
import important from "../../../public/undraw_bookmarks_5wrq.svg";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-4 md:gap-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="grid grid-cols-6 md:grid-cols-12 items-center justify-center gap-4 font-thin"
        variants={containerVariants}
      >
        <motion.div className="col-span-3 px-6" variants={itemVariants}>
          <Image
            src={files}
            alt="svg"
            className="h-auto w-auto md:h-64 md:w-64"
          />
          <p className="text-muted-foreground text-xs md:text-base">
            Create bookmarks with title and description.
          </p>
        </motion.div>

        <motion.div className="col-span-3 px-6" variants={itemVariants}>
          <Image
            src={folders}
            alt="svg"
            className="h-auto w-auto md:h-64 md:w-64"
          />
          <p className="text-muted-foreground text-xs md:text-base">
            Manage your bookmarks in folders separately.
          </p>
        </motion.div>

        <motion.div className="col-span-3 px-6" variants={itemVariants}>
          <Image
            src={search}
            alt="svg"
            className="h-auto w-auto md:h-64 md:w-64"
          />
          <p className="text-muted-foreground text-xs md:text-base">
            Search your bookmarks and folders with a single click.
          </p>
        </motion.div>

        <motion.div className="col-span-3 px-6" variants={itemVariants}>
          <Image
            src={important}
            alt="svg"
            className="h-auto w-auto md:h-64 md:w-64"
          />
          <p className="text-muted-foreground text-xs md:text-base">
            Mark your bookmarks and folder important.
          </p>
        </motion.div>
      </motion.div>
      <motion.div variants={containerVariants} className="flex flex-col gap-2">
        <motion.h1
          className="text-md sm:text-xl font-bold text-center"
          variants={itemVariants}
        >
          Your Bookmarks, Your Way.
        </motion.h1>
        <motion.p
          className=" text-xs text-muted-foreground md:text-base px-20 text-center font-bold"
          variants={itemVariants}
        >
          Effortlessly organize and manage your bookmarks with a system tailored
          to the way you think. Save links with titles and descriptions, mark
          the most important ones, and neatly arrange them into folders or
          collections. Simple, intuitive, and powerful—our bookmarking tool is
          designed to help you stay organized and focused, no matter how you
          work.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default About;
