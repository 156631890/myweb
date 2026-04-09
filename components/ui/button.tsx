import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full border font-medium uppercase transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
      primary: "border-primary bg-primary text-primary-foreground hover:border-black hover:bg-black",
      secondary: "border-border bg-card text-foreground hover:border-foreground/30 hover:bg-surface",
      outline: "border-gold/35 bg-card text-gold hover:bg-gold/10",
      ghost: "border-transparent bg-transparent text-text-muted hover:border-border hover:bg-card hover:text-foreground",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] tracking-[0.18em]",
      md: "px-5 py-2.5 text-[10px] tracking-[0.2em]",
      lg: "px-6 py-3 text-[10px] tracking-[0.22em]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
