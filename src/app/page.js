"use client";
import BackgroundUi from "@/components/ethreal-shadow";
import Navbar from "./_components/Navbar";
import RepoTextarea from "@/components/RepoTextarea";
import { useState } from "react";
import { handleRepoSubmisson } from "@/actions/projectAction";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const handleSend = async (message) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await handleRepoSubmisson(message);

      if (!result.success) {
        setErrorMessage(result?.error);
      } else {
       router.push(`/dashboard/${result.projectId}`);
      }
    } catch (error) {
      console.error("UI Submission Pipeline Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <BackgroundUi
        color="rgba(139, 92, 246, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      />
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6">
        <h1 className="max-w-6xl text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Turn Raw Code Into Beautiful Documentation Instantly.
        </h1>

        <p className="mt-6 text-center text-lg font-semibold sm:text-xl md:text-2xl lg:text-3xl">
          Paste your GitHub repository link below and let AI compile...
        </p>

        {/* Prompt Box */}
        <div className="mt-10 w-full max-w-3xl">
          <RepoTextarea
            placeholder="Paste your GitHub repository URL..."
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>
        {/* Technical feedback error message block if validation fails */}
        {errorMessage && (
          <p className="mt-4 text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">
            ⚠️ {errorMessage}
          </p>
        )}

        {isLoading && (
          <p className="mt-4 text-sm font-medium text-blue-400 animate-pulse">
            Analyzing repository architecture... Please wait.
          </p>
        )}
      </div>
    </div>
  );
}
