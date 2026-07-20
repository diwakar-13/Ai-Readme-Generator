"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import { Sparkles, FileText, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getLatestReadme } from "@/actions/generateAction";
import { Button } from "@/components/ui/button";

export default function ReadmeWorkspace() {
  const { isLoading, setIsLoading, markdown, setMarkdown } =
    useContext(WorkspaceContext);
  const params = useParams();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadFromDB = async () => {
      if (!params?.projectId) return;

      setIsLoading(true);
      try {
        const res = await getLatestReadme(params.projectId);
        if (res?.success && res?.data?.markdownContent) {
          setMarkdown(res.data.markdownContent);
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

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full animate-pulse space-y-6 rounded-xl border border-border bg-secondary dark:bg-secondary-foreground p-6 transition-colors">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-6 w-32 rounded bg-muted-foreground dark:bg-muted" />
          <div className="h-8 w-20 rounded dark:bg-muted bg-muted-foreground" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-5 w-40 rounded dark:bg-muted bg-muted-foreground" />
          <div className="h-4 w-full rounded dark:bg-muted bg-muted-foreground" />
          <div className="h-4 w-4/5 rounded dark:bg-muted bg-muted-foreground" />
        </div>

        <div className="h-28 w-full rounded-lg border border-border dark:bg-muted bg-muted-foreground" />
      </div>
    );
  }
  if (!markdown) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary dark:bg-secondary-foreground p-8 text-center transition-colors">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
          <Sparkles className="h-7 w-7 animate-pulse text-primary" />
        </div>

        <h3 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
          No README Generated Yet
        </h3>

        <p className="max-w-2x; text-base text-muted-foreground md:text-lg">
          Select sections from the left sidebar and click{" "}
          <span className="font-semibold text-primary">Generate README</span> to
          create a professional README for your project.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-secondary dark:bg-secondary-foreground p-6  transition-colors">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono text-card-foreground ">
            README.md
          </span>
        </div>

        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-card-foreground" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Markdown */}
      <div className="space-y-4 text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 1. Headings (Clean Spacing)
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-bold text-foreground border-b border-border pb-2 mt-6 mb-4 capitalize"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-semibold text-foreground border-b border-border pb-2 mt-6 mb-3 capitalize"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-medium text-foreground mt-4 mb-2 capitalize"
                {...props}
              />
            ),

            table: ({ node, ...props }) => (
              <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead
                className="bg-muted/80 border-b border-border text-xs uppercase font-semibold text-foreground"
                {...props}
              />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="divide-y divide-border bg-card" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-muted/40 transition-colors" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-4 py-3 font-medium text-foreground whitespace-nowrap"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-3 text-muted-foreground" {...props} />
            ),
            p: ({ node, children, ...props }) => {
              // Agar paragraph ke andar badge image hai, toh flex row banao
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
                  className="text-muted-foreground leading-relaxed mb-3"
                  {...props}
                >
                  {children}
                </p>
              );
            },

            // 3. Badges Image Styling
            img: ({ node, ...props }) => (
              <img
                className="h-6 rounded hover:opacity-90 transition-opacity inline-block m-0"
                {...props}
              />
            ),

            // 4. Unordered Lists & Bullet Fix
            ul: ({ node, children, ...props }) => {
              // Agar list items ke andar badges hain, toh bullets hata kar flex-row kar do
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
                  className="list-disc pl-5 space-y-1.5 text-muted-foreground my-2"
                  {...props}
                >
                  {children}
                </ul>
              );
            },

            li: ({ node, children, ...props }) => {
              // Badges ke aage se extra bullet dot hatana
              const hasImage = node?.children?.some(
                (child) =>
                  child.tagName === "img" ||
                  child?.children?.some((c) => c.tagName === "img"),
              );

              if (hasImage) {
                return <div className="inline-block m-0">{children}</div>;
              }

              return (
                <li className="pl-1" {...props}>
                  {children}
                </li>
              );
            },

            // 5. Terminal / Code Blocks
            code: ({ node, inline, children, ...props }) => {
              if (inline) {
                return (
                  <code
                    className="bg-muted border border-border text-foreground px-1.5 py-0.5 rounded text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <div className="relative my-4 rounded-lg border border-border bg-muted/80 p-4 overflow-x-auto">
                  <pre className="font-mono text-xs text-foreground leading-relaxed">
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
    </div>
  );
}
