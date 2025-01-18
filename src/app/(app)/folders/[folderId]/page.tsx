"use client";

import Bookmark from "@/components/bookmark/Bookmark";
import ShowBookmarks from "@/components/folder/ShowBookmarks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useBookmarkStore, { ISingleBookmark } from "@/store/bookmarks";
import useFolderStore from "@/store/folder";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Folderid = () => {
  const params = useParams<{ folderId: string }>();
  const { folders } = useFolderStore();
  const { bookmarks } = useBookmarkStore();
  const [remaingBookmarks, setRemainingBookmarks] = useState<
    Array<ISingleBookmark>
  >([]);
  const [open, setIsOpen] = useState(false);
  const folder = folders.find((f) => f._id === params.folderId);
  const handleClick = () => {
    if (!folder) return;

    const newB = bookmarks.filter(
      (b) =>
        !folder.bookmarks.some(
          (folderBookmark) => folderBookmark._id === b._id,
        ),
    );

    setRemainingBookmarks(newB);

    setIsOpen((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 my-6 mx-auto gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Folder</CardTitle>
          <CardDescription>
            Click the icon below to add a new Folder
          </CardDescription>
        </CardHeader>
        <CardContent
          className="flex justify-center items-center pb-6"
          onClick={handleClick}
        >
          <div className="p-4 rounded-full bg-slate-300 dark:bg-primary-foreground  cursor-pointer">
            <Plus className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
      {folder && (
        <>
          <ShowBookmarks
            bookmarks={remaingBookmarks}
            isOpen={open}
            setIsOpen={setIsOpen}
            folderId={folder._id}
          />
          {folder.bookmarks.map((b) => (
            <Bookmark key={b._id} {...b} />
          ))}
        </>
      )}
    </div>
  );
};

export default Folderid;
