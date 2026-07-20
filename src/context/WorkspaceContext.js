"use client";

import React, { createContext, useState, useEffect } from "react";

export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [activeSections, setActiveSections] = useState({
    projectOverview: true,
    features: true,
    installation: false,
    usage: false,
    techStack: false,
    projectStructure: false,
    apiReference: false,
    contributing: false,
    license: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const savedSections = localStorage.getItem("reposcribe_sections");
    if (savedSections) {
      try {
        setActiveSections(JSON.parse(savedSections));
      } catch (error) {
        console.error("Failed to parse saved sections:", error);
      }
    }
  }, []);

  const toggleSection = (sectionKey) => {
    setActiveSections((prev) => {
      const updated = {
        ...prev,
        [sectionKey]: !prev[sectionKey],
      };
      localStorage.setItem("reposcribe_sections", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeSections,
        toggleSection,
        isLoading,
        setIsLoading,
        markdown,
        setMarkdown,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
