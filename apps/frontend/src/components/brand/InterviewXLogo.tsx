"use client";

import React from "react";

interface InterviewXLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

/**
 * InterviewX Brand Logo Mark
 * Combines the dynamic intersecting "X" of InterviewX, the central DataHub neural node,
 * and the AI intelligence spark (✦).
 */
export function InterviewXLogo({
  className = "",
  size = "md",
  showText = false,
}: InterviewXLogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-12 h-12",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Glowing Brand Mark Badge */}
      <div
        className={`${sizeMap[size]} rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-200 shrink-0 ring-2 ring-white/80`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSizeMap[size]} text-white transition-transform group-hover:rotate-6 duration-200`}
          aria-hidden="true"
        >
          {/* Main Diagonal: Top-Left to Bottom-Right */}
          <path
            d="M5.5 5.5L18.5 18.5"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Crossing Diagonals with Center Depth */}
          <path
            d="M18.5 5.5L13.8 10.2"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M10.2 13.8L5.5 18.5"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Central Neural DataHub Node */}
          <circle cx="12" cy="12" r="1.8" fill="white" />
          {/* AI Intelligence Sparkle (✦) */}
          <path
            d="M19 2.5C19 3.88 20.12 5 21.5 5C20.12 5 19 6.12 19 7.5C19 6.12 17.88 5 16.5 5C17.88 5 19 3.88 19 2.5Z"
            fill="#93C5FD"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="hidden sm:block">
          <div className="flex items-center">
            <span className="font-extrabold text-xs text-slate-900 tracking-tight">
              InterviewX
            </span>
            <span className="font-bold text-xs text-blue-600 ml-1">
              DataHub
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
