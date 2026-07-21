"use server";
import { buildReadmePrompt, README_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import { fetchGithubRepoData, getProjectDetail } from "./projectAction";
import { openrouter } from "@/lib/openRouter";
import { db } from "@/db";
import { projects, readmeVersions } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Octokit } from "octokit";

export async function generateReadme(projectId, selectedSections) {
  try {
    const projectDetail = await getProjectDetail(projectId);
    const currentProject = projectDetail?.project;

    let fileTreePaths = "";
    if (currentProject?.repoUrl) {
      const repoData = await fetchGithubRepoData(currentProject.repoUrl);
      if (repoData.success && repoData.tree) {
        // Sirf file paths ki array banake clean string bana lo (Limit 150 items for token space)
        fileTreePaths = repoData.tree
          .map((item) => item.path)
          .slice(0, 150)
          .join("\n");
      }
    }
    const activeKeys = Object.keys(selectedSections || {}).filter(
      (key) => selectedSections[key] === true,
    );

    const userPrompt = buildReadmePrompt({
      repoName: currentProject?.repoName,
      techStack: currentProject?.techStack,
      activeSections: activeKeys,
      treeStructure: fileTreePaths,
    });

    const response = await openrouter.chat.send({
      chatRequest: {
        model: "openai/gpt-5-mini",
        messages: [
          {
            role: "system",
            content: README_SYSTEM_INSTRUCTION,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
    });

    const markdownContent = response.choices[0].message.content;

    const [insertRecord] = await db
      .insert(readmeVersions)
      .values({
        projectId: projectId,
        markdownContent: markdownContent,
      })
      .returning();
    console.log("=== SAVED TO DB SUCCESSFULLY ===", insertRecord.id);

    return {
      success: true,
      data: insertRecord,
    };
  } catch (error) {
    console.error("Error on generating Readme:", error);
    return { success: false, error: error.message };
  }
}

export async function getLatestReadme(projectId) {
  try {
    const { userId } = await auth();

    // 1. Unauthenticated User Check
    if (!userId) {
      return {
        success: false,
        isUnauthorized: true,
        error: "User not authenticated.",
      };
    }

    // 2. Ownership Verification (IDOR Fix Gate)
    const userProject = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    // 3. Access Denied (Agar URL kisi aur ka hai)
    if (!userProject || userProject.length === 0) {
      return {
        success: false,
        isUnauthorized: true,
        error: "Access Denied: You do not own this project.",
      };
    }

    // 4. Fetch Latest README
    const result = await db
      .select()
      .from(readmeVersions)
      .where(eq(readmeVersions.projectId, projectId))
      .orderBy(desc(readmeVersions.createdAt))
      .limit(1);

    // ✅ README Mila
    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error("Error fetching latest README from DB:", error);
    return { success: false, error: error.message };
  }
}

export async function savedEditReadmeContent(projectId, markdownContent) {
  try {
    const existing = await db
      .select()
      .from(readmeVersions)
      .where(eq(readmeVersions.projectId, projectId))
      .orderBy(desc(readmeVersions.createdAt))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(readmeVersions)
        .set({ markdownContent })
        .where(eq(readmeVersions.id, existing[0].id));
    } else {
      await db.insert(readmeVersions).values({
        projectId,
        markdownContent,
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Save Edited Readme Error On Server:", error);
    return { success: false, error: error.message };
  }
}

export async function commitReadmeToGithub(projectId, markdownContent) {
  try {
    // 1. Current Logged-In User Id
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized access" };
    }

    const client = await clerkClient();

    // 2. Clerk se poochho: "Kya is user ka GitHub OAuth token hai?"
    let userGithubToken = null;
    try {
      const oauthTokens = await client.users.getUserOauthAccessToken(
        userId,
        "oauth_github",
      );
      if (oauthTokens.data && oauthTokens.data.length > 0) {
        userGithubToken = oauthTokens.data[0].token;
      }
    } catch (err) {
      console.log("User ka GitHub account linked nahi hai.");
    }

    //  Check: Agar GitHub Account linked nahi hai (Google User Case)
    if (!userGithubToken) {
      return {
        success: false,
        needsGithubConnect: true,
        error: "Please link your GitHub account to enable auto-commit.",
      };
    }

    // 3. Logged-in user ke Token se dynamic Octokit instance banao
    const userOctokit = new Octokit({ auth: userGithubToken });

    // 4. Fetch project from DB to get repo name and URL
    const projectDetail = await getProjectDetail(projectId);
    if (!projectDetail?.success || !projectDetail?.project) {
      return { success: false, error: "Project Not Found" };
    }

    const repoUrl = projectDetail?.project?.repoUrl;
    const urlParts = repoUrl
      .replace("https://github.com/", "")
      .replace(/\/$/, "")
      .split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return { success: false, error: "Invalid repository URL." };
    }

    // 5. Check if README exists in repo via sha (User Octokit se)
    let currentSha = null;
    try {
      const existingFile = await userOctokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        { owner, repo, path: "README.md" },
      );
      console.log("====Sha=====", existingFile?.data?.sha);
      currentSha = existingFile.data.sha;
    } catch (error) {
      console.log("README.md does not exist yet. Creating a new one.");
    }

    // 6. Convert markdownContent into base64
    const contentBase64 = Buffer.from(markdownContent, "utf-8").toString(
      "base64",
    );

    // 7. GitHub me push via PUT method (User Octokit se)
    await userOctokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: "README.md",
      message: "docs: update README.md via RepoScribe",
      content: contentBase64,
      sha: currentSha || undefined,
    });

    return { success: true, message: "Successfully committed to GitHub!" };
  } catch (error) {
    console.error("🚨 GitHub Commit Error:", error.message);
    return {
      success: false,
      error: error.message || "Failed to commit README to GitHub.",
    };
  }
}
