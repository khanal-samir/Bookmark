"use client";
import React, { useEffect } from "react";
import Bookmark from "@/components/bookmark/Bookmark";
import useBookmarkStore from "@/store/bookmarks";
const BookmarkPage = () => {
  const { fetchBookmarks, bookmarks } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [bookmarks.length]);
  console.log(bookmarks);

  if (!bookmarks.length)
    return (
      <div className="m-auto text-muted-foreground font-bold text-xl">
        No Bookmarks found!
      </div>
    );
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 my-6 mx-auto gap-4 ">
      {bookmarks.map((b) => (
        <Bookmark key={b._id} {...b} />
      ))}
    </div>
  );
};

export default BookmarkPage;
