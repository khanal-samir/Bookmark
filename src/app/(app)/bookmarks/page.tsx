"use client";
import React from "react";
import Bookmark from "@/components/bookmark/Bookmark";
import useBookmarkStore from "@/store/bookmarks";
const BookmarkPage = () => {
  const { bookmarks } = useBookmarkStore();

  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 my-6 mx-auto gap-4 ">
      {bookmarks.map((b) => (
        <div key={b._id}>
          <Bookmark {...b} />
        </div>
      ))}
      {}
    </div>
  );
};

export default BookmarkPage;
