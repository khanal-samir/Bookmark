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

import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";
import useFolderStore, { ISingleFolder } from "@/store/folder";
import { updateFolderSchema } from "@/schemas/folderSchema";
import Link from "next/link";

export default function Folder(folder: ISingleFolder) {
  const { updateFolder, deleteFolder, error } = useFolderStore();
  const [isUpdate, setIsUpdate] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateFolderSchema>>({
    resolver: zodResolver(updateFolderSchema),
    defaultValues: {
      folderId: folder._id,
      description: folder.description,
      isImportant: folder.isImportant,
      title: folder.title,
    },
  });

  const handleDeleteBookmark = async () => {
    const response = await deleteFolder(folder._id);
    if (response) {
      toast({
        title: "Success",
        description: "Folder Deleted successfully",
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

  const handleUpdate = async (data: z.infer<typeof updateFolderSchema>) => {
    const response = await updateFolder(data);
    if (response) {
      toast({
        title: "Success",
        description: "Folder Updated successfully",
      });
    } else {
      const errorMessage = error;
      toast({
        title: "Error",
        description: errorMessage || "Error updating Folder",
        variant: "destructive",
      });
    }
    setIsUpdate(false);
    form.reset();
  };

  return (
    <Card className="w-[350px] transition-transform hover:scale-105 cursor-pointer">
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
              {folder.title}{" "}
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
            <CardDescription>{folder.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-blue-600 w-full hover:underline cursor-pointer">
            <Link href={`/folders/${folder._id}`}>
              {" "}
              {folder.bookmarks.length} bookmarks{" "}
            </Link>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-muted-foreground text-sm">
              {new Date(folder.createdAt).toLocaleDateString()}
            </p>
            {folder.isImportant && <Star />}
          </CardFooter>
        </div>
      )}
    </Card>
  );
}
