"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    href: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gallery</SidebarGroupLabel>
      <SidebarMenu>
        {" "}
        {items.map((item, index) => (
          <Link href={item.href} key={index}>
            {" "}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                className={`${pathname === item.href ? "text-blue-500 hover:text-blue-700" : ""}`}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>{" "}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
