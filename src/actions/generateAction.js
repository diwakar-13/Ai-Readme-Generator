"use server";
import { buildReadmePrompt, README_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import { getProjectDetail } from "./projectAction";
import { openrouter } from "@/lib/openRouter";
import { db } from "@/db";
import { readmeVersions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function generateReadme(projectId, selectedSections) {
  try {
    const projectDetail = await getProjectDetail(projectId);
    const currentProject = projectDetail?.project;

    const activeKeys = Object.keys(selectedSections || {}).filter(
      (key) => selectedSections[key] === true,
    );

    const userPrompt = buildReadmePrompt({
      repoName: currentProject?.repoName,
      techStack: currentProject?.techStack,
      activeSections: activeKeys,
    });

    const response = await openrouter.chat.send({
      chatRequest: {
        model: "openai/gpt-5-nano",
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
    const result = await db
      .select()
      .from(readmeVersions)
      .where(eq(readmeVersions.projectId, projectId))
      .orderBy(desc(readmeVersions.createdAt))
      .limit(1);
    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    }
    return { success: false, data: null };
  } catch (error) {
    console.error("Error fetching latest README from DB:", error);
    return { success: false, error: error.message };
  }
}
