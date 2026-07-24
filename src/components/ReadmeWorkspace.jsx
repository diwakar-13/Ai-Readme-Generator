"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Save,
  GitCommit,
  Lock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  commitReadmeToGithub,
  getLatestReadme,
  savedEditReadmeContent,
} from "@/actions/readmeAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser, useClerk } from "@clerk/nextjs";
import { getUserSubscription } from "@/actions/userAction";
import UpgradeModal from "./UpgradeModel";

export default function ReadmeWorkspace() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { isLoading, setIsLoading, markdown, setMarkdown } =
    useContext(WorkspaceContext);
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);
  const [userPlan, setUserPlan] = useState("FREE");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const res = await getUserSubscription();

      if (res?.success && res?.plan) {
        setUserPlan(res?.plan.toUpperCase());
      }
    };
    fetchUserPlan();
  }, []);

  useEffect(() => {
    const loadFromDB = async () => {
      if (!params?.projectId) return;

      setIsLoading(true);
      try {
        const res = await getLatestReadme(params.projectId);
        if (res?.success && res?.data?.markdownContent) {
          setMarkdown(res.data.markdownContent);
        } else if (res?.isUnauthorized) {
          toast.error("Unauthorized! You do not own this project.");
          setMarkdown("");
          router.push("/");
        } else {
          setMarkdown("");
        }
      } catch (err) {
        console.error("Error loading README:", err);
        setMarkdown("");
      } finally {
        setIsLoading(false);
      }
    };

    loadFromDB();
  }, [params?.projectId]);

  const handleTabSwitch = (targertTab) => {
    if (targertTab === "edit" && userPlan === "FREE") {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(targertTab);
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdown) return;

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "README.md");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = async () => {
    if (!params?.projectId || !markdown) return;
    setIsSaving(true);
    try {
      await savedEditReadmeContent(params?.projectId, markdown);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommit = async () => {
    if (userPlan === "FREE") {
      setShowUpgradeModal(true);
      return;
    }
    if (!params?.projectId || !markdown) {
      toast.error("Please write or generate a README first.");
      return;
    }

    setIsCommitting(true);
    const toastId = toast.loading("Committing README to GitHub...");

    try {
      const res = await commitReadmeToGithub(params.projectId, markdown);

      if (res.needsGithubConnect) {
        toast.dismiss(toastId);

        toast.info(
          "GitHub connection required to enable direct repository commits.",
          {
            action: {
              label: "Connect GitHub",
              onClick: () => {
                if (!isLoaded || !user) {
                  toast.error("User session is loading, please wait.");
                  return;
                }
                openUserProfile();
              },
            },
            duration: 8000,
          },
        );
        return;
      }

      if (res.success) {
        toast.success("README successfully committed to GitHub!", {
          id: toastId,
        });
        setCommitSuccess(true);
        setTimeout(() => setCommitSuccess(false), 3000);
      } else {
        toast.error(res.error || "Failed to commit to repository.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Commit Error:", error);
      toast.error("An error occurred while committing to GitHub.", {
        id: toastId,
      });
    } finally {
      setIsCommitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full animate-pulse space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-8 w-full sm:w-48 rounded bg-muted" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-4/5 rounded bg-muted" />
        </div>

        <div className="h-28 w-full rounded-lg border border-border bg-muted" />
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-6 sm:p-8 text-center transition-colors">
        <div className="mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-border bg-muted">
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse text-primary" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          No README Generated Yet
        </h3>

        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
          Select sections from the left sidebar and click{" "}
          <span className="font-semibold text-orange-500">Generate README</span> to
          create a professional README for your project.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card text-card-foreground p-4 sm:p-6 transition-colors shadow-sm">
      {/* HEADER SECTION - Responsive Container */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        {/* Title / File Indicator */}
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-mono font-bold text-orange-500">
            README.md
          </span>
        </div>

        {/* BUTTONS WRAPPER - Mobile me Wrap hoga, Desktop me Inline rahega */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs flex-1 sm:flex-none justify-center"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="inline">Copy</span>
              </>
            )}
          </Button>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-8 cursor-pointer active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="inline">Download</span>
          </Button>

          {/* Commit Button */}
          <Button
            onClick={handleCommit}
            disabled={isCommitting}
            variant="default"
            size="sm"
            className={`h-8 gap-1.5 text-xs  cursor-pointer active:scale-95 w-full sm:w-auto justify-center ${
              commitSuccess ? "bg-emerald-600" : ""
            }`}
          >
            {commitSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Committed!
              </>
            ) : (
              <>
                <GitCommit className="h-3.5 w-3.5" />
                {isCommitting ? "Committing..." : "Commit to GitHub"}
                {userPlan === "FREE" && (
                  <Lock className="h-3 w-3 ml-0.5 opacity-80" />
                )}
              </>
            )}
          </Button>

          {/* Preview / Edit Toggle Tabs */}
          <div className="flex items-center bg-muted border border-border rounded-lg p-1 w-full sm:w-auto justify-center mt-1 sm:mt-0">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1 text-xs rounded-md transition-all ${
                activeTab === "preview"
                  ? "bg-background text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
            <button
              onClick={() => handleTabSwitch("edit")}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1 text-xs rounded-md transition-all ${
                activeTab === "edit"
                  ? "bg-background text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
              {userPlan === "FREE" && (
                <Lock className="h-3 w-3 text-primary ml-0.5" />
              )}
            </button>
          </div>

          {/* Save Changes Button */}
          {activeTab === "edit" && (
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs w-full sm:w-auto justify-center"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />{" "}
                  {isSaving ? "Saving..." : "Save"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Markdown Preview/Editor - Explicit Foreground Text Colors */}
      {activeTab === "preview" ? (
        <div className="space-y-4 text-sm leading-relaxed overflow-x-auto text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-xl sm:text-2xl font-bold text-foreground border-b border-border pb-2 mt-6 mb-4 capitalize"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-lg sm:text-xl font-bold text-foreground border-b border-border pb-2 mt-6 mb-3 capitalize"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-base sm:text-lg font-semibold text-foreground mt-4 mb-2 capitalize"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
                  <table
                    className="w-full text-left text-xs sm:text-sm"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead
                  className="bg-muted border-b border-border text-xs uppercase font-semibold text-foreground"
                  {...props}
                />
              ),
              tbody: ({ node, ...props }) => (
                <tbody className="divide-y divide-border bg-card" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr
                  className="hover:bg-muted/40 transition-colors"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-foreground whitespace-nowrap"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="px-3 sm:px-4 py-2 sm:py-3 text-foreground/80"
                  {...props}
                />
              ),
              p: ({ node, children, ...props }) => {
                const hasImage = node?.children?.some(
                  (child) => child.tagName === "img",
                );

                if (hasImage) {
                  return (
                    <div className="flex flex-wrap items-center gap-2 my-3">
                      {children}
                    </div>
                  );
                }

                return (
                  <p
                    className="text-foreground/90 font-normal leading-relaxed mb-3 text-xs sm:text-sm"
                    {...props}
                  >
                    {children}
                  </p>
                );
              },
              img: ({ node, ...props }) => (
                <img
                  className="h-5 sm:h-6 rounded hover:opacity-90 transition-opacity inline-block m-0"
                  {...props}
                />
              ),
              ul: ({ node, children, ...props }) => {
                const isBadgeList = node?.children?.some((child) =>
                  child?.children?.some(
                    (c) =>
                      c.tagName === "img" ||
                      c?.children?.some((gc) => gc.tagName === "img"),
                  ),
                );

                if (isBadgeList) {
                  return (
                    <div className="flex flex-wrap items-center gap-2 my-3">
                      {children}
                    </div>
                  );
                }

                return (
                  <ul
                    className="list-disc pl-5 space-y-1.5 text-foreground/90 my-2 text-xs sm:text-sm"
                    {...props}
                  >
                    {children}
                  </ul>
                );
              },
              li: ({ node, children, ...props }) => {
                const hasImage = node?.children?.some(
                  (child) =>
                    child.tagName === "img" ||
                    child?.children?.some((c) => c.tagName === "img"),
                );

                if (hasImage) {
                  return <div className="inline-block m-0">{children}</div>;
                }

                return (
                  <li className="pl-1 text-foreground/90" {...props}>
                    {children}
                  </li>
                );
              },
              code: ({ node, inline, children, ...props }) => {
                if (inline) {
                  return (
                    <code
                      className="bg-muted border border-border text-foreground px-1.5 py-0.5 rounded text-xs font-mono font-medium break-all"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="relative my-4 rounded-lg border border-border bg-muted/80 p-3 sm:p-4 overflow-x-auto">
                    <pre className="font-mono text-xs text-foreground leading-relaxed font-normal">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="w-full">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Edit your markdown here..."
            className="min-h-[400px] sm:min-h-[500px] w-full rounded-lg border border-border bg-background p-3 sm:p-4 font-mono text-xs text-foreground leading-relaxed focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {/* UPGRADE TO PRO DIALOG component */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </div>
  );
}