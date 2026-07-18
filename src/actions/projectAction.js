"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { octokit } from "@/lib/octokit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

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

// get project detail
export async function getProjectDetail(projectId) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized access! Please sign in first.",
    };
  }
  try {
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

    if (!result || result.length === 0) {
      return { success: false, error: "Project not found" };
    }

    return { success: true, project: result[0] };
  } catch (error) {
    console.error("Fetch detailed architecture error:", error);
    return {
      success: false,
      error: "Internal core database on fetching projects.",
    };
  }
}

export async function fetchGithubRepoData(repoUrl) {
  try {
    const urlParts = repoUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return { success: false, error: "Invalid GitHub URL structure." };
    }

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: owner,
        repo: repo,
        tree_sha: "main",
        recursive: "true",
      },
    );

    return { success: true, files: response.data.tree };
  } catch (error) {
    console.error("🚨 GitHub Axios Error:", error.message);
    return {
      success: false,
      error:
        error.response?.status === 404
          ? "Repository not found or private."
          : "Failed to connect with GitHub.",
    };
  }
}
