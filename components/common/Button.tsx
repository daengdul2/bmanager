"use client";

import { cn } from "@/lib/utils"; // helper untuk merge className

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "rounded";
  size?: "small" | "medium" | "large";
};

export default function Button({
  variant = "primary",
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  const base = "font-medium transition";

  const sizes = {
    small: "px-1 py-1 text-xs",
    medium: "px-2 py-2 text-sm",
    large: "px-3 py-3 text-base",
  };

  const variants = {
    primary: "rounded-md bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700",
    danger: "rounded-md bg-red-600 text-white hover:bg-red-700",
    rounded:
      "rounded-full bg-black/60 text-white shadow hover:scale-105 transition",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}