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

    try {
      const urlParts = repoUrl.replace("https://github.com/", "").split("/");
      const owner = urlParts[0];
      const repo = urlParts[1];

      if (owner && repo) {
        const repoInfo = await octokit.request("GET /repos/{owner}/{repo}", {
          owner,
          repo,
        });

        const defaultBranch = repoInfo.data.default_branch || "main";

        const treeResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
          {
            owner,
            repo,
            tree_sha: defaultBranch,
            recursive: "true",
          },
        );

        if (treeResponse.data && treeResponse.data.tree) {
          const targetFiles = [
            "package.json",
            "requirements.txt",
            "Cargo.toml",
            "go.mod",
          ];

          const detectedConfigs = treeResponse.data.tree.filter((item) =>
            targetFiles.includes(item.path),
          );

          const tempBadges = new Set();

          for (const file of detectedConfigs) {
            const contentRes = await getFileContent(owner, repo, file.path);

            if (contentRes.success) {
              const contentStr = contentRes.content.toLowerCase();
              // js / ts ecosystem
              if (file.path === "package.json") {
                if (contentStr.includes('"next"')) tempBadges.add("Next.js");
                if (contentStr.includes('"react"')) tempBadges.add("React");
                if (contentStr.includes('"tailwindcss"'))
                  tempBadges.add("Tailwind CSS");
                if (contentStr.includes('"prisma"')) tempBadges.add("Prisma");
                if (contentStr.includes('"drizzle-orm"'))
                  tempBadges.add("Drizzle ORM");
                if (contentStr.includes('"typescript"'))
                  tempBadges.add("TypeScript");
                if (contentStr.includes('"express"')) tempBadges.add("Express");
                if (contentStr.includes('"socket.io"'))
                  tempBadges.add("Socket.io");
              }
              if (file.path === "requirements.txt") {
                if (contentStr.includes("django")) tempBadges.add("Django");
                if (contentStr.includes("flask")) tempBadges.add("Flask");
                if (contentStr.includes("fastapi")) tempBadges.add("FastAPI");
              }

              // Rust Ecosystem
              if (file.path === "Cargo.toml") {
                tempBadges.add("Rust");
              }
            }
          }

          const finalBadges = Array.from(tempBadges);

          if (finalBadges.length > 0) {
            await db
              .update(projects)
              .set({ techStack: finalBadges })
              .where(eq(projects.id, newProject.id));
          }
        } else {
          console.warn("⚠️ GitHub returned data but no tree array was found.");
        }
      }
    } catch (error) {
      console.error("🚨 Background Tech Scan Error:", error.message);
    }

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

// get all projects of a user
export async function getUserAllProjects() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized access! Please sign in first.",
      };
    }

    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));

    return { success: true, projects: result };
  } catch (error) {}
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

    const targetFiles = [
      "package.json",
      "requirements.txt",
      "Cargo.toml",
      "go.mod",
    ];
    const detectedConfigs = response.data.tree.filter((item) =>
      targetFiles.includes(item.path),
    );

    console.log(
      "Detected files and paths:",
      detectedConfigs.map((f) => ({ path: f.path, type: f.type })),
    );
    return {
      success: true,
      tree: response.data.tree,
      configFiles: detectedConfigs,
    };
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

export async function getFileContent(owner, repo, path) {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
      },
    );

    // GitHub hamesha data base64 encrypted bhejta hai, humne use normal text (string) banaya
    const rawContent = Buffer.from(response.data.content, "base64").toString(
      "utf-8",
    );

    return {
      success: true,
      content: rawContent,
    };
  } catch (error) {
    console.error(`🚨 Error reading file ${path}:`, error.message);
    return { success: false, error: `Failed to read ${path}` };
  }
}

// FIXME: CHUTKI ME TESTING KARNE KE LIYE TEMPORARY FUNCTION (Isse tum kisi bhi puraane id par scan dubara run kar sakte ho)
export async function forceRunScan(projectId) {
  try {
    // 1. Database se wahi purana project uthao jiska id tumhare paas hai
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!result || result.length === 0)
      return { success: false, error: "Project nahi mila bhai!" };

    const project = result[0];
    const repoUrl = project.repoUrl;

    const urlParts = repoUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) return { success: false, error: "URL sahi nahi hai." };

    console.log(`🧪 Testing scan for: ${owner}/${repo}`);

    // 2. Default branch nikalna
    const repoInfo = await octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo,
    });

    console.log(repoInfo?.data?.default_branch);

    const defaultBranch = repoInfo.data.default_branch || "main";

    // 3. Tree fetch karna
    const treeResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: "true",
      },
    );

    if (treeResponse.data && treeResponse.data.tree) {
      const targetFiles = [
        "package.json",
        "requirements.txt",
        "Cargo.toml",
        "go.mod",
      ];
      const detectedConfigs = treeResponse.data.tree.filter((item) =>
        targetFiles.includes(item.path),
      );
      const tempBadges = new Set();

      for (const file of detectedConfigs) {
        const contentRes = await getFileContent(owner, repo, file.path);
        console.log(contentRes?.content);

        if (contentRes.success) {
          const contentStr = contentRes.content.toLowerCase();
          if (file.path === "package.json") {
            if (contentStr.includes('"next"')) tempBadges.add("Next.js");
            if (contentStr.includes('"react"')) tempBadges.add("React");
            if (contentStr.includes('"tailwindcss"'))
              tempBadges.add("Tailwind CSS");
            if (contentStr.includes('"prisma"')) tempBadges.add("Prisma");
            if (contentStr.includes('"drizzle-orm"'))
              tempBadges.add("Drizzle ORM");
            if (contentStr.includes('"typescript"'))
              tempBadges.add("TypeScript");
          }
        }
      }

      const finalBadges = Array.from(tempBadges);
      console.log("🧪 Scan complete! Detected Badges:", finalBadges);

      // 4. Update Database
      await db
        .update(projects)
        .set({ techStack: finalBadges })
        .where(eq(projects.id, projectId));

      return {
        success: true,
        message: "Scan forced successfully!",
        badges: finalBadges,
      };
    }

    return { success: false, error: "No tree found" };
  } catch (error) {
    console.error("🚨 Test Scan Failure:", error.message);
    return { success: false, error: error.message };
  }
}
