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
    default: "bg-surface text-text-muted",
    primary: "bg-gold text-primary-foreground",
    success: "bg-surface text-text-muted",
    danger: "bg-surface text-text-muted",
    outline: "border border-gold/25 text-gold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase font-medium rounded-full",
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
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(p);
  };

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-serif text-foreground", sizes[size])}>
        {formatPrice(actualPrice)}
      </span>
      {comparePrice && comparePrice > actualPrice && (
        <span
          className={cn("font-serif text-text-muted line-through", sizes[size])}
        >
          {formatPrice(comparePrice)}
        </span>
      )}
    </div>
  );
}
