import Image from "next/image";
import React from "react";
import Bookmark from "../../public/Bookmark.png";
const Footer = () => {
  return (
    <div className="flex justify-between px-10 items-center mt-10 py-6 border-t">
      <div className="flex items-center gap-2">
        <Image src={Bookmark} alt="png" className="w-10 h-10 inline" />
        <span>Bookmark</span>
      </div>
      {new Date().getFullYear()} © Samir Khanal
    </div>
  );
};

export default Footer;
