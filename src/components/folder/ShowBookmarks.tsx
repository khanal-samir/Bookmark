import React from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useFolderStore from "@/store/folder";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const bookmarkSelectionSchema = z.object({
  selectedBookmarks: z
    .array(z.string())
    .min(1, "Please select at least one bookmark"),
});

type Bookmark = {
  _id: string;
  title: string;
  url: string;
  description?: string;
};

type BookmarksProps = {
  bookmarks: Bookmark[];
  folderId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShowBookmarks = ({
  bookmarks,
  folderId,
  isOpen,
  setIsOpen,
}: BookmarksProps) => {
  const { addBookmarks, error } = useFolderStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bookmarkSelectionSchema>>({
    resolver: zodResolver(bookmarkSelectionSchema),
    defaultValues: {
      selectedBookmarks: [],
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof bookmarkSelectionSchema>,
  ) => {
    const response = await addBookmarks({
      bookmarkIds: data.selectedBookmarks,
      folderId: folderId,
    });

    if (response) {
      toast({
        title: "Success",
        description: "Bookmarks added successfully",
      });
      setIsOpen(false);
      form.reset();
    } else {
      toast({
        title: "Error",
        description: error || "Error adding bookmarks",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Bookmarks to Folder</DialogTitle>
          <DialogDescription>
            Select the bookmarks you want to add to your folder.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark._id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      {bookmark.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline break-all"
                      >
                        {bookmark.url}
                      </a>
                      {bookmark.description && (
                        <p className="text-sm text-gray-600">
                          {bookmark.description}
                        </p>
                      )}
                      <FormField
                        control={form.control}
                        name="selectedBookmarks"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(bookmark._id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValue,
                                      bookmark._id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== bookmark._id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <span className="text-sm font-medium">Select</span>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add to Folder</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShowBookmarks;
