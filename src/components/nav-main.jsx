"use client";

import { SidebarGroup } from "@/components/ui/sidebar";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "./ui/checkbox";
import { useContext } from "react";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import { Loader2, Sparkle } from "lucide-react";
import { Button } from "./ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { generateReadme, getLatestReadme } from "@/actions/readmeAction";
import { checkAndDeductCredit } from "@/actions/creditAction";
import { toast } from "sonner";

export function NavMain({ currentProject }) {
  const {
    activeSections,
    toggleSection,
    isLoading,
    setIsLoading,
    setMarkdown,
  } = useContext(WorkspaceContext);

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleGenerate = async () => {
    setIsLoading(true);
    setMarkdown("");
    try {
      const creditRes = await checkAndDeductCredit();

      if (!creditRes.allowed) {
        toast.error(creditRes.error, {
          action: {
            label: "Upgrade to Pro",
            onClick: () =>
              router.push(`/pricing?redirect=/dashboard/${params.projectId}`),
          },
        });
        setIsLoading(false);
        return;
      }

      setMarkdown("");
      const result = await generateReadme(params.projectId, activeSections);
      if (result.success) {
        const latestReadme = await getLatestReadme(params.projectId);
        if (latestReadme?.success) {
          setMarkdown(latestReadme?.data?.markdownContent);

          if (creditRes.creditsLeft !== 9999) {
            toast.success(
              `README Generated! ${creditRes.creditsLeft} free credits remaining.`,
            );
          } else {
            toast.success("README Generated successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Error on Generating Readme from UI:", error);
      toast.error("Failed to generate README. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarGroup>
      <Field>
        <FieldLabel
          htmlFor="input-demo-api-key"
          className="font-semibold text-xs text-foreground"
        >
          Repo Name-
        </FieldLabel>
        <h2 className="text-sm font-semibold p-2.5 border border-border rounded-lg bg-muted/60 text-foreground cursor-not-allowed mt-1 truncate">
          {currentProject?.repoName || "Select a project"}
        </h2>
      </Field>

      <FieldSet className="mt-5">
        <FieldLegend
          variant="label"
          className="font-semibold text-xs text-foreground"
        >
          Readme Sections-
        </FieldLegend>
        <FieldDescription className="text-[11px] text-muted-foreground mb-2">
          Choose the sections you want to include.
        </FieldDescription>

        <FieldGroup className="gap-2.5 max-h-[220px] bg-muted/40 dark:bg-zinc-900/80 border border-border rounded-xl p-3 overflow-y-auto custom-sidebar-scroll">
          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="project-overview-checkbox"
              name="project-overview-checkbox"
              checked={activeSections.projectOverview}
              onCheckedChange={() => toggleSection("projectOverview")}
            />
            <FieldLabel
              htmlFor="project-overview-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Project Overview
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="features-checkbox"
              name="features-checkbox"
              checked={activeSections.features}
              onCheckedChange={() => toggleSection("features")}
            />
            <FieldLabel
              htmlFor="features-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Features
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="installation-checkbox"
              name="installation-checkbox"
              checked={activeSections.installation}
              onCheckedChange={() => toggleSection("installation")}
            />
            <FieldLabel
              htmlFor="installation-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Installation
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="usage-checkbox"
              name="usage-checkbox"
              checked={activeSections.usage}
              onCheckedChange={() => toggleSection("usage")}
            />
            <FieldLabel
              htmlFor="usage-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Usage
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="tech-stack-checkbox"
              name="tech-stack-checkbox"
              checked={activeSections.techStack}
              onCheckedChange={() => toggleSection("techStack")}
            />
            <FieldLabel
              htmlFor="tech-stack-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Tech Stack
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="project-structure"
              name="project-structure"
              checked={activeSections.projectStructure}
              onCheckedChange={() => toggleSection("projectStructure")}
            />
            <FieldLabel
              htmlFor="project-structure"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Project Structure
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="api-reference-checkbox"
              name="api-reference-checkbox"
              checked={activeSections.apiReference}
              onCheckedChange={() => toggleSection("apiReference")}
            />
            <FieldLabel
              htmlFor="api-reference-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              API Reference
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="contributing-checkbox"
              name="contributing-checkbox"
              checked={activeSections.contributing}
              onCheckedChange={() => toggleSection("contributing")}
            />
            <FieldLabel
              htmlFor="contributing-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              Contributing
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="flex items-center gap-2">
            <Checkbox
              id="license-checkbox"
              name="license-checkbox"
              checked={activeSections.license}
              onCheckedChange={() => toggleSection("license")}
            />
            <FieldLabel
              htmlFor="license-checkbox"
              className="font-medium text-xs text-foreground cursor-pointer"
            >
              License
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-2 rounded-lg text-xs cursor-pointer shadow-md hover:opacity-90 transition-all"
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkle className="mr-1.5 h-3.5 w-3.5" />
        )}
        Generate README
      </Button>
    </SidebarGroup>
  );
}
