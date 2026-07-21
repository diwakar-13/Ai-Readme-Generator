"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavProjects({ projects }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  // Handle Delete Click Function
  const handleDelete = (e, projectId, repoName) => {
    e.stopPropagation(); // Yeh zaroori hai taaki delete dabane par route change na ho jaye
    const confirmDelete = window.confirm(
      `Bhai, kya sach me "${repoName}" ko delete karna hai?`,
    );
    if (confirmDelete) {
      console.log("Deleting project with ID:", projectId);
      alert("Delete logic yahan trigger hoga backend ka!");
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>


      <SidebarMenu className="bg-accent rounded-xl p-2 max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-sidebar-scroll">
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              onClick={() => router.push(`/dashboard/${item.id}`)}
              className="cursor-pointer hover:bg-zinc-800 hover:text-accent hover:dark:text-accent-foreground transition-colors"
            >
              <span>{item.repoName}</span>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expand:bg-black"
                  />
                }
              >
                <MoreHorizontalIcon className="text-white hover:text-black dark:hover:text-white" />
                <span className="sr-only">Options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-40 bg-secondary border-zinc-800 text-zinc-200"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
             
                <DropdownMenuItem
                  onClick={(e) => handleDelete(e, item.id, item.repoName)}
                  className="text-red-400 focus:text-red-400 focus:bg-red-950/30 cursor-pointer"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
