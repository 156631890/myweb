"use client";

import React from "react";

export interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selected: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorSelector({
  colors,
  selected,
  onChange,
  className = "",
}: ColorSelectorProps) {
  return (
    <div className={className}>
      <p className="text-xs tracking-wider uppercase text-gray-400 mb-3">
        Color
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onChange(color.name)}
            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
              selected === color.name
                ? "border-gold ring-2 ring-gold/20 scale-110"
                : "border-gray-600 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          >
            {selected === color.name && (
              <svg
                className="absolute inset-0 m-auto w-4 h-4 text-black pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-sm text-white mt-2">
          {colors.find((c) => c.name === selected)?.name}
        </p>
      )}
    </div>
  );
}
