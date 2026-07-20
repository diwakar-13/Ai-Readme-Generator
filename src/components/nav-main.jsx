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
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useContext } from "react";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import { Sparkle } from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { generateReadme } from "@/actions/generateAction";

export function NavMain({ currentProject }) {
  const { activeSections, toggleSection } = useContext(WorkspaceContext);

  const params = useParams();

  const handleGenerate = async () => {
    await generateReadme(params.projectId, activeSections);
  };
  return (
    <SidebarGroup>
      <Field>
        <FieldLabel htmlFor="input-demo-api-key">Repo Name-</FieldLabel>
        <Input
          id="input-demo-api-key"
          type="text"
          placeholder="e.g. Awesome Project"
          defaultValue={currentProject?.repoName || ""}
        />
        <FieldDescription className="text-xs ">
          Edit the repository name if needed.
        </FieldDescription>
      </Field>

      <FieldSet className="mt-5">
        <FieldLegend variant="label">Readme Sections-</FieldLegend>
        <FieldDescription>
          Choose the sections you want to include.
        </FieldDescription>
        <FieldGroup className="gap-3 mt-0 max-h-[200px] bg-[#171717] rounded-xl p-2 overflow-y-auto  scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-sidebar-scroll">
          <Field orientation="horizontal">
            <Checkbox
              id="project-overview-checkbox"
              name="project-overview-checkbox"
              checked={activeSections.projectOverview}
              onCheckedChange={() => toggleSection("projectOverview")}
            />
            <FieldLabel
              htmlFor="project-overview-checkbox"
              className="font-normal"
            >
              Project Overview
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="features-checkbox"
              name="features-checkbox"
              checked={activeSections.features}
              onCheckedChange={() => toggleSection("features")}
            />
            <FieldLabel htmlFor="features-checkbox" className="font-normal">
              Features
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="installation-checkbox"
              name="installation-checkbox"
              checked={activeSections.installation}
              onCheckedChange={() => toggleSection("installation")}
            />
            <FieldLabel htmlFor="installation-checkbox" className="font-normal">
              Installation
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="usage-checkbox"
              name="usage-checkbox"
              checked={activeSections.usage}
              onCheckedChange={() => toggleSection("usage")}
            />
            <FieldLabel htmlFor="usage-checkbox" className="font-normal">
              Usage
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="tech-stack-checkbox"
              name="tech-stack-checkbox"
              checked={activeSections.techStack}
              onCheckedChange={() => toggleSection("techStack")}
            />
            <FieldLabel htmlFor="tech-stack-checkbox" className="font-normal">
              Tech Stack
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="project-structure"
              name="project-structure"
              checked={activeSections.projectStructure}
              onCheckedChange={() => toggleSection("projectStructure")}
            />
            <FieldLabel htmlFor="project-structure" className="font-normal">
              Project Structure
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="api-reference-checkbox"
              name="api-reference-checkbox"
              checked={activeSections.apiReference}
              onCheckedChange={() => toggleSection("apiReference")}
            />
            <FieldLabel
              htmlFor="api-reference-checkbox"
              className="font-normal"
            >
              API Reference
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="contributing-checkbox"
              name="contributing-checkbox"
              checked={activeSections.contributing}
              onCheckedChange={() => toggleSection("contributing")}
            />
            <FieldLabel htmlFor="contributing-checkbox" className="font-normal">
              Contributing
            </FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="license-checkbox"
              name="license-checkbox"
              checked={activeSections.license}
              onCheckedChange={() => toggleSection("license")}
            />
            <FieldLabel htmlFor="license-checkbox" className="font-normal">
              License
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button
        className="w-full mt-4 bg-primary font-medium py-2 rounded-lg text-xs"
        onClick={handleGenerate}
      >
        <Sparkle /> Generate README
      </Button>
    </SidebarGroup>
  );
}
