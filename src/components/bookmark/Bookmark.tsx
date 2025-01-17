import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type { ISingleBookmark } from "@/store/bookmarks";
import useBookmarkStore from "@/store/bookmarks";
import { useForm } from "react-hook-form";
import { updateBookmarkSchema } from "@/schemas/bookmarkSchema";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";

export default function Bookmark(bookmark: ISingleBookmark) {
  const { updateBookmark, deleteBookmark, error } = useBookmarkStore();
  const [isUpdate, setIsUpdate] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateBookmarkSchema>>({
    resolver: zodResolver(updateBookmarkSchema),
    defaultValues: {
      bookmarkId: bookmark._id,
      description: bookmark.description,
      isImportant: bookmark.isImportant,
      title: bookmark.title,
      url: bookmark.url,
    },
  });

  const handleDeleteBookmark = async () => {
    const response = await deleteBookmark(bookmark._id);
    if (response) {
      toast({
        title: "Success",
        description: "Bookmark Deleted successfully",
      });
    } else {
      const errorMessage = error;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: z.infer<typeof updateBookmarkSchema>) => {
    const response = await updateBookmark(data);
    if (response) {
      toast({
        title: "Success",
        description: "Bookmark Updated successfully",
      });
    } else {
      const errorMessage = error;
      toast({
        title: "Error",
        description: errorMessage || "Error updating Bookmark",
        variant: "destructive",
      });
    }
    setIsUpdate(false);
    form.reset();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast({
      title: "URL Copied!",
      description: "URL has been copied to clipboard.",
    });
  };
  return (
    <Card className="w-[350px]">
      {isUpdate ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="p-6 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bookmark title"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bookmark description"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isImportant"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 text-sm font-semibold">
                      Mark as important
                    </FormLabel>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 text-sm"
                onClick={() => setIsUpdate(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {bookmark.title}{" "}
              <DropdownMenu>
                <DropdownMenuTrigger>...</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Edit</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsUpdate((prev) => !prev)}
                  >
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteBookmark}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>{bookmark.description}</CardDescription>
          </CardHeader>
          <CardContent
            className="text-blue-600 hover:underline cursor-pointer transition-transform hover:scale-90"
            onClick={copyToClipboard}
          >
            {bookmark.url}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-muted-foreground text-sm">
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </p>
            {bookmark.isImportant && <Star />}
          </CardFooter>
        </div>
      )}
    </Card>
  );
}
