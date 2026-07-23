"use client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
} from "lucide-react";
import { useState } from "react";
import FeedbackModal from "./FeedbackModel";

export function AppSidebar({ currentProject, projects, ...props }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const data = {
    navSecondary: [
      // {
      //   title: "Support",
      //   url: "#",
      //   icon: <LifeBuoyIcon />,
      // },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
        onClick: (e) => {
          e.preventDefault();
          setIsFeedbackOpen(true); // 👈 Open Modal on Click
        },
      },
    ],
  };
  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<a href="/" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">RepoScribe</span>
                  <span className="truncate text-xs">AI README Generator</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain currentProject={currentProject} />
          <NavProjects projects={projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
