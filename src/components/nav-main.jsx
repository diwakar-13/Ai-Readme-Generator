"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export function NavMain() {
  return (
    <SidebarGroup>
      <Field>
        <FieldLabel htmlFor="input-demo-api-key">Repo Name-</FieldLabel>
        <Input
          id="input-demo-api-key"
          type="text"
          placeholder="e.g. Awesome Project"
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
        <FieldGroup className="gap-3 mt-0 max-h-[200px] bg-[#171717] rounded-xl p-2 overflow-y-auto overflow-y-auto">
          <Field orientation="horizontal">
            <Checkbox
              id="project-overview-checkbox"
              name="project-overview-checkbox"
              defaultChecked
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
              defaultChecked
            />
            <FieldLabel
              htmlFor="features-checkbox"
              className="font-normal"
            >
              Features
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="installation-checkbox"
              name="installation-checkbox"
            />
            <FieldLabel
              htmlFor="installation-checkbox"
              className="font-normal"
            >
              Installation
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="usage-checkbox"
              name="usage-checkbox"
            />
            <FieldLabel
              htmlFor="usage-checkbox"
              className="font-normal"
            >
              Usage
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="tech-stack-checkbox"
              name="tech-stack-checkbox"
            />
            <FieldLabel
              htmlFor="tech-stack-checkbox"
              className="font-normal"
            >
              Tech Stack
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="project-structure"
              name="project-structure"
            />
            <FieldLabel
              htmlFor="project-structure"
              className="font-normal"
            >
              Project Structure
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="api-reference-checkbox"
              name="api-reference-checkbox"
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
            />
            <FieldLabel
              htmlFor="contributing-checkbox"
              className="font-normal"
            >
              Contributing
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="license-checkbox"
              name="license-checkbox"
            />
            <FieldLabel
              htmlFor="license-checkbox"
              className="font-normal"
            >
              License
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </SidebarGroup>
  );
}
