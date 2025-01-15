import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import type { ISingleBookmark } from "@/store/bookmarks";

export default function Bookmark(bookmark: ISingleBookmark) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {bookmark.title} <p className="cursor-pointer">...</p>
        </CardTitle>
        <CardDescription>{bookmark.description}</CardDescription>
      </CardHeader>
      <CardContent>{bookmark.url}</CardContent>
      <CardFooter className="flex justify-between">
        {new Date(bookmark.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
