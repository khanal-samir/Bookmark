"use client";
import React, { useState } from "react";
import Bookmark from "@/components/bookmark/Bookmark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateBookmark from "@/components/bookmark/CreateBookmark";
import useBookmarkStore from "@/store/bookmarks";
import { Plus } from "lucide-react";

const BookmarkPage = () => {
  const { bookmarks } = useBookmarkStore();
  const [open, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 my-6 mx-auto gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Bookmark</CardTitle>
          <CardDescription>
            Click the icon below to add a new bookmark
          </CardDescription>
        </CardHeader>
        <CardContent
          className="flex justify-center items-center pb-6"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="p-4 rounded-full bg-slate-300 dark:bg-primary-foreground  cursor-pointer">
            <Plus className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      {bookmarks.map((b) => (
        <div key={b._id}>
          <Bookmark {...b} />
        </div>
      ))}

      <CreateBookmark isOpen={open} setIsOpen={setIsOpen} />
    </div>
  );
};

export default BookmarkPage;
