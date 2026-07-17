"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function handleRepoSubmisson(repoUrl) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized access! Please sign in first.",
    };
  }
  if (!repoUrl || !repoUrl.includes("github.com")) {
    return { success: false, error: "Please Enter a Valid Github Url" };
  }
  try {

    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects?.repoUrl, repoUrl));

    if (existingProject.length > 0) {
      return {
        success: true,
        message: "Project already exists!",
        projectId: existingProject[0].id,
      };
    }
    const repoName =
      repoUrl.replace(/\/$/, "").split("/").pop() || "Untitled-Repo";

    const [newProject] = await db
      .insert(projects)
      .values({
        userId,
        repoName,
        repoUrl,
      })
      .returning();

    return {
      success: true,
      message: "New project initialized!",
      projectId: newProject.id,
    };
  } catch (error) {
    console.error("Project action execution error:", error);
    return { success: false, error: "Internal core engine breakdown." };
  }
}
