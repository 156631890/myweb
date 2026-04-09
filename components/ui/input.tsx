import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 py-2.5 text-sm text-text placeholder:text-text-muted/55 transition-colors duration-200 focus:border-foreground focus:outline-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm text-text placeholder:text-text-muted/55 transition-colors duration-200 focus:border-foreground focus:outline-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "w-full cursor-pointer appearance-none rounded-full border border-border bg-card px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors duration-200 focus:border-foreground focus:outline-none",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="h-4 w-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
