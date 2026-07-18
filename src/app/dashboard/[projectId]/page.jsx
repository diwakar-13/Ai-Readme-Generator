import { fetchGithubRepoData, getProjectDetail } from "@/actions/projectAction";
import React from "react";

const page = async ({ params }) => {
  const { projectId } = await params;
  const result = await getProjectDetail(projectId);

  if (!result || !result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-red-400 font-medium">
        ⚠️ Error: {result?.error || "Project not found"}
      </div>
    );
  }
  const project = result.project;

  const githubResult = await fetchGithubRepoData(project?.repoUrl);

  console.log("GitHub Files Loaded:", githubResult);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bhai Dashboard Architecture Live!
      </h1>

      {/* Bas testing ke liye real data screen par print kar rhe hain */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg max-w-xl w-full text-left">
        <p className="text-sm text-zinc-500">Project ID: {project.id}</p>
        <p className="text-lg font-semibold mt-1">
          Repo Name: {project.repoName}
        </p>
        <p className="text-sm text-purple-400 mt-2 break-all">
          URL: {project.repoUrl}
        </p>
      </div>

      {/* 3. Screen par check karne ke liye ki status kya hai */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg max-w-xl w-full text-left">
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">
          GitHub Engine Status:
        </h3>
        {githubResult.success ? (
          <p className="text-emerald-400 text-sm">
            ✓ Success! Total {githubResult.files?.length} items found in root.
          </p>
        ) : (
          <p className="text-rose-400 text-sm">✗ Error: {githubResult.error}</p>
        )}
      </div>
    </div>
  );
};

export default page;
