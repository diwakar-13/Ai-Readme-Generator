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
import Image from "next/image";

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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/logo.png"
                    width={50}
                    height={50}
                    alt="logo"
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Repo<span className="text-orange-500">Scribe</span></span>
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
