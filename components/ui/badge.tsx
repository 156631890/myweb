import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "danger" | "outline";
}

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  const variants = {
    default: "border border-border bg-card text-text-muted",
    primary: "border border-gold/30 bg-gold/10 text-gold",
    success: "border border-border bg-card text-text-muted",
    danger: "border border-border bg-card text-text-muted",
    outline: "border border-border bg-card text-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface PriceProps {
  price?: number;
  amount?: number;
  comparePrice?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Price({
  price,
  amount,
  comparePrice,
  className,
  size = "md",
}: PriceProps) {
  const actualPrice = amount ?? price ?? 0;

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-sans font-medium text-foreground", sizes[size])}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(actualPrice)}
      </span>
      {comparePrice && comparePrice > actualPrice && (
        <span
          className={cn("font-sans text-text-muted line-through", sizes[size])}
        >
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(comparePrice)}
        </span>
      )}
    </div>
  );
}
