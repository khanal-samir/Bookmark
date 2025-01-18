"use client";
import Folder from "@/components/folder/Folder";
import useFolderStore from "@/store/folder";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import CreateFolder from "@/components/folder/CreateFolder";

const Folders = () => {
  const { folders } = useFolderStore();
  const [open, setIsOpen] = React.useState(false);

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
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="p-4 rounded-full bg-slate-300 dark:bg-primary-foreground  cursor-pointer">
            <Plus className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
      {folders.map((f) => (
        <div key={f._id}>
          <Folder {...f} />
        </div>
      ))}
      <CreateFolder isOpen={open} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Folders;
