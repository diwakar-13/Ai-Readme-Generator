"use client";

import React, { createContext, useState, useEffect } from "react";

export const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  // 1. Initial State ko simple rakha taaki pehle page bina crash hue render ho
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

  // 2. Component mount hote hi localStorage se saved state uthao
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

  // 3. Jab bhi activeSections badle, use localStorage mein dump kar do
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
    <WorkspaceContext.Provider value={{ activeSections, toggleSection }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
