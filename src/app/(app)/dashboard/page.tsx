"use client";
import Bookmark from "@/components/bookmark/Bookmark";
import Folder from "@/components/folder/Folder";
import { Button } from "@/components/ui/button";
import useBookmarkStore from "@/store/bookmarks";
import useFolderStore from "@/store/folder";
import Link from "next/link";

export default function DashboardPage() {
  const { bookmarks, loading } = useBookmarkStore();
  const { folders } = useFolderStore();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {loading ? (
        <>
          {" "}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl dark:bg-muted/50 bg-muted-foreground/50" />
            <div className="aspect-video rounded-xl dark:bg-muted/50 bg-muted-foreground/50" />
            <div className="aspect-video rounded-xl dark:bg-muted/50 bg-muted-foreground/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl dark:bg-muted/50 bg-muted-foreground/50 md:min-h-min" />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h1 className="text-muted-foreground font-bold">Bookmarks</h1>
              <Link href="/bookmarks">
                {" "}
                <Button variant="link">View all</Button>
              </Link>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {bookmarks.slice(0, 3).map((b) => (
                <Bookmark key={b._id} {...b} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h1 className="text-muted-foreground font-bold">Folders</h1>
              <Link href="/folders">
                {" "}
                <Button variant="link">View all</Button>
              </Link>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {folders.slice(0, 3).map((b) => (
                <Folder key={b._id} {...b} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
