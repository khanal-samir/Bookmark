"use client";

import * as React from "react";
import { File, Bookmark, Folder, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { AddBookmark } from "@/components/sidebar/AddBookmark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Bookmarks",
      href: "/bookmarks",
      icon: File,
    },
    {
      title: "Folders",
      href: "/folders",
      icon: Folder,
    },
    {
      title: "Important",
      href: "/important",
      icon: Bookmark,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AddBookmark />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            username: session?.user.username || session?.user.name || "",
            email: session?.user.email || "",
            avatar: `https://avatar.iran.liara.run/username?username=${session?.user.username || session?.user.name || ""}`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
