"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import RepoTextarea from "@/components/RepoTextarea";
import AnoAI from "@/components/AnoAIBackground";

import {
  getUserAllProjects,
  handleRepoSubmisson,
} from "@/actions/projectAction";

import {
  ArrowRight,
  ChevronRight,
  Clock,
  Code2,
  FolderGit2,
} from "lucide-react";

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentProjects, setRecentProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await getUserAllProjects();
        console.log(res);

        if (res?.success) {
          setRecentProjects(res.projects || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingProjects(false);
      }
    }

    loadProjects();
  }, []);

  const handleSend = async (message) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await handleRepoSubmisson(message);

      if (!result.success) {
        setErrorMessage(result.error);
      } else {
        router.push(`/dashboard/${result.projectId}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden  dark:bg-black">
      <AnoAI />

      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-6 pt-36 pb-24">
        {/* Badge */}

        <div className="group relative mb-10 flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all duration-500 hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
            }}
          />
          ✨
          <hr className="mx-2 h-4 w-px bg-border" />
          <AnimatedGradientText className="text-sm font-medium">
            AI Powered GitHub Documentation
          </AnimatedGradientText>
          <ChevronRight className="ml-1 h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Heading */}

        <h1 className="max-w-6xl text-center text-5xl font-extrabold tracking-tight text-foreground leading-[1.05] sm:text-6xl md:text-7xl">
          Generate Professional README Files
          <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent">
            From Any GitHub Repository
          </span>
        </h1>

        {/* Description */}

        <p className="mt-8 max-w-3xl text-center text-lg leading-8 text-muted-foreground ">
          Paste your GitHub repository URL and let AI inspect your codebase,
          understand your architecture, detect your tech stack and generate a
          beautiful production-ready README in seconds.
        </p>

        {/* Input */}

        <div className="mt-12 w-full max-w-4xl">
          <RepoTextarea
            placeholder="Paste your GitHub repository URL..."
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-3 text-sm text-destructive backdrop-blur-md">
            ⚠️ {errorMessage}
          </div>
        )}

        {isLoading && (
          <div className="mt-6 rounded-xl border border-blue-900/40 bg-blue-950/20 px-5 py-3 text-sm text-blue-400 animate-pulse">
            Analyzing repository architecture...
          </div>
        )}

        {/* Recent Projects */}

        <section className="mt-24 w-full max-w-6xl border-t border-neutral-800/60 pt-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 dark:text-neutral-400" />

              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                Your Recent Projects
              </h2>
            </div>

            {recentProjects.length > 0 && (
              <span className="font-mono text-xs text-muted-foreground">
                {recentProjects.length} Projects
              </span>
            )}
          </div>{" "}
          {fetchingProjects ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl border bg-card/80 border-border"
                />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 py-16 px-8 text-center backdrop-blur-md">
              <FolderGit2 className="mx-auto mb-4 h-8 w-8 text-neutral-500" />

              <h3 className="text-lg font-semibold text-foreground">
                No Projects Yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Generate your first README to see it appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/${project.id}`}
                  className="group rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:border-primary/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Code2 className="h-4 w-4 shrink-0 text-primary" />

                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {project.repoName || "Untitled Repository"}
                      </h3>
                    </div>

                    <ArrowRight className="h-4 w-4 text-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  <p className="mt-3 line-clamp-2 break-all font-mono text-xs text-muted-foreground">
                    {project.repoUrl}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4 text-xs text-muted-foreground">
                    <span>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Recent"}
                    </span>

                    <span className="font-medium text-orange-400">
                      Open Workspace →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
