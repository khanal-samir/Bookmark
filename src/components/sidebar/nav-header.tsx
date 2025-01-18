"use client";

import * as React from "react";
import { GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import CreateBookmark from "../bookmark/CreateBookmark";
import CreateFolder from "../folder/CreateFolder";

export function NavHeader() {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFolderOpen, setIsFolderOpen] = React.useState(false);

  return (
    <div>
      <CreateBookmark isOpen={isOpen} setIsOpen={setIsOpen} />
      <CreateFolder isOpen={isFolderOpen} setIsOpen={setIsFolderOpen} />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-blue-500 hover:bg-blue-700"
              >
                <GalleryVerticalEnd className="m-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Bookmarks
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem className=" flex flex-col gap-2 ">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus
                    className="size-4 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add Bookmark
                </div>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus
                    className="size-4 cursor-pointer"
                    onClick={() => setIsFolderOpen(true)}
                  />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add Folder
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
