"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function RepoTextarea({
  placeholder = "https://github.com/username/repository",
  onSend,
  enableAnimations = true,
  className,
  disabled = false,

  mainGradient = {
    light: {
      topLeft: "#F5E9AD",
      topRight: "#F6B4AD",
      bottomRight: "#F5ABA0",
      bottomLeft: "#F5DCBA",
    },
    dark: {
      topLeft: "#B8905A",
      topRight: "#B86B42",
      bottomRight: "#A8502D",
      bottomLeft: "#B89E6E",
    },
  },

  outerGradient = {
    light: {
      topLeft: "#E5D99D",
      topRight: "#E6A49D",
      bottomRight: "#E59B90",
      bottomLeft: "#E5CCBA",
    },
    dark: {
      topLeft: "#996F40",
      topRight: "#99532D",
      bottomRight: "#8A3F22",
      bottomLeft: "#997D50",
    },
  },

  innerGradientOpacity = 0.1,

  enableShadows = true,

  shadowOpacity = 1,

  shadowColor = {
    light: "rgb(0, 0, 0)",
    dark: "rgb(184, 107, 66)",
  },
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const { theme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const currentMainGradient = isDark
    ? mainGradient.dark
    : mainGradient.light;

  const currentOuterGradient = isDark
    ? outerGradient.dark
    : outerGradient.light;

  const currentShadowColor = isDark
    ? shadowColor.dark
    : shadowColor.light;

  // Convert HEX / RGB color to RGBA
  const hexToRgba = (color, alpha) => {
    if (color.startsWith("rgb(")) {
      const rgbValues = color
        .slice(4, -1)
        .split(",")
        .map((value) => parseInt(value.trim()));

      return `rgba(
        ${rgbValues[0]},
        ${rgbValues[1]},
        ${rgbValues[2]},
        ${alpha}
      )`;
    }

    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return color;
  };

  // Submit Repository URL
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!repoUrl.trim() || disabled) {
      return;
    }

    if (onSend) {
      onSend(repoUrl.trim());
    }

    setRepoUrl("");
  };

  // Enter key submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className={cn("relative w-full", className)}
      initial={
        shouldAnimate
          ? {
              opacity: 0,
              y: 20,
            }
          : {}
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      <div className="relative">
        {/* ========================================= */}
        {/* Outer Gradient Border */}
        {/* ========================================= */}

        <div
          className="absolute inset-0 rounded-[20px] p-[0.5px]"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              ${currentOuterGradient.topLeft} 0deg,
              ${currentOuterGradient.topRight} 90deg,
              ${currentOuterGradient.bottomRight} 180deg,
              ${currentOuterGradient.bottomLeft} 270deg,
              ${currentOuterGradient.topLeft} 360deg
            )`,
          }}
        >
          {/* Main Gradient Border */}

          <div
            className="h-full w-full rounded-[19.5px] p-[2px]"
            style={{
              background: `conic-gradient(
                from 0deg at 50% 50%,
                ${currentMainGradient.topLeft} 0deg,
                ${currentMainGradient.topRight} 90deg,
                ${currentMainGradient.bottomRight} 180deg,
                ${currentMainGradient.bottomLeft} 270deg,
                ${currentMainGradient.topLeft} 360deg
              )`,
            }}
          >
            {/* Inner Background */}

            <div className="relative h-full w-full rounded-[17.5px] bg-background">
              {/* Inner Gradient */}

              <div
                className="absolute inset-0 rounded-[17.5px] p-[0.5px]"
                style={{
                  background: `conic-gradient(
                    from 0deg at 50% 50%,

                    ${hexToRgba(
                      currentOuterGradient.topLeft,
                      innerGradientOpacity
                    )} 0deg,

                    ${hexToRgba(
                      currentOuterGradient.topRight,
                      innerGradientOpacity
                    )} 90deg,

                    ${hexToRgba(
                      currentOuterGradient.bottomRight,
                      innerGradientOpacity
                    )} 180deg,

                    ${hexToRgba(
                      currentOuterGradient.bottomLeft,
                      innerGradientOpacity
                    )} 270deg,

                    ${hexToRgba(
                      currentOuterGradient.topLeft,
                      innerGradientOpacity
                    )} 360deg
                  )`,
                }}
              >
                <div className="h-full w-full rounded-[17px] bg-background" />
              </div>

              {/* Top Highlight */}

              <div
                className="absolute top-0 right-4 left-4 h-[0.5px]"
                style={{
                  background: `linear-gradient(
                    to right,
                    transparent,
                    ${hexToRgba(
                      currentMainGradient.topLeft,
                      0.3
                    )},
                    transparent
                  )`,
                }}
              />

              {/* Bottom Highlight */}

              <div
                className="absolute right-4 bottom-0 left-4 h-[0.5px]"
                style={{
                  background: `linear-gradient(
                    to right,
                    transparent,
                    ${hexToRgba(
                      currentMainGradient.bottomRight,
                      0.2
                    )},
                    transparent
                  )`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* Repository Input Content */}
        {/* ========================================= */}

        <form
          onSubmit={handleSubmit}
          className="relative p-3 sm:p-3"
        >
          <div className="flex items-center gap-2 sm:gap-2">
            {/* GitHub Icon */}

            <div className="flex  shrink-0 items-center justify-center  sm:h-11 sm:w-11">
              <FaGithub size={24} />
            </div>

            {/* Repository URL Input */}

            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "h-10 min-w-0 flex-1 bg-transparent",
                "text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "outline-none",
                "sm:h-11 sm:text-base",
                disabled &&
                  "cursor-not-allowed opacity-50"
              )}
            />

            {/* Generate Button */}

            <motion.button
              type="submit"
              disabled={disabled || !repoUrl.trim()}
              className={cn(
                "flex h-10 shrink-0 items-center justify-center gap-2",
                "rounded-xl bg-foreground px-3",
                "text-sm font-medium text-background",
                "sm:h-11 sm:px-5",
                "cursor-pointer",
                "transition-opacity",
                (disabled || !repoUrl.trim()) &&
                  "cursor-not-allowed opacity-50"
              )}
              whileHover={
                shouldAnimate && repoUrl.trim()
                  ? {
                      scale: 1.03,
                    }
                  : {}
              }
              whileTap={
                shouldAnimate && repoUrl.trim()
                  ? {
                      scale: 0.97,
                    }
                  : {}
              }
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              {/* Desktop / Tablet Text */}

              <span className="hidden  sm:inline">
                Generate 
              </span>

              {/* Arrow */}

              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </form>

        {/* ========================================= */}
        {/* Shadows */}
        {/* ========================================= */}

        {enableShadows && (
          <>
            {/* Bottom Shadow */}

            <div
              className="pointer-events-none absolute -bottom-3 right-3 left-3 h-6 rounded-full blur-md"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(
                  to bottom,
                  ${hexToRgba(
                    currentShadowColor,
                    0.1
                  )} 0%,
                  transparent 100%
                )`,
              }}
            />

            {/* Left Shadow */}

            <div
              className="pointer-events-none absolute top-3 bottom-3 -left-2 w-4 rounded-full blur-sm"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(
                  to right,
                  ${hexToRgba(
                    currentShadowColor,
                    0.06
                  )} 0%,
                  transparent 100%
                )`,
              }}
            />

            {/* Right Shadow */}

            <div
              className="pointer-events-none absolute top-3 -right-2 bottom-3 w-4 rounded-full blur-sm"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(
                  to left,
                  ${hexToRgba(
                    currentShadowColor,
                    0.06
                  )} 0%,
                  transparent 100%
                )`,
              }}
            />

            {/* Main Drop Shadow */}

            <div
              className="pointer-events-none absolute inset-0 rounded-[20px]"
              style={{
                opacity: shadowOpacity,
                boxShadow: `0 10px 25px ${hexToRgba(
                  currentShadowColor,
                  isDark ? 0.15 : 0.05
                )}`,
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}