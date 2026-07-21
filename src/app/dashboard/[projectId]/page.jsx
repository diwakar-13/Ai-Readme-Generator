import { getProjectDetail, getUserAllProjects } from "@/actions/projectAction";
import { AppSidebar } from "@/components/app-sidebar";
import ReadmeWorkspace from "@/components/ReadmeWorkspace";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { projectId } = await params;

  const currentProject = await getProjectDetail(projectId);
  const currentProjectDetail = currentProject?.project;
  const result = await getUserAllProjects();
  const projects = result?.projects;
 

  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <AppSidebar projects={projects} currentProject={currentProjectDetail} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb className="flex justify-between lg:mr-7 mr-2 items-center w-full">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Build Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
                <AnimatedThemeToggler />
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <ReadmeWorkspace />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
