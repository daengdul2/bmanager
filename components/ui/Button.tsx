"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "rounded" | "ghost" | "danger" | "confirm" | "icon" | "outline" | "blue" | "link";
  size?: "xs" | "small" | "medium" | "normal" | "large";
  loading?: boolean;
  icon?: ReactNode; // icon di sebelah kiri teks
  children?: ReactNode;
}

export default function Button({
  variant = "default",
  size = "normal",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        "disabled:opacity-50 disabled:pointer-events-none",
        "active:scale-95",

        // Variant
        variant === "default"  && "rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700",
        variant === "rounded"  && "bg-black/40 hover:bg-black/60 text-white rounded-full",
        variant === "ghost"    && "bg-transparent hover:bg-slate-800 text-slate-300 rounded-lg",
        variant === "danger"   && "rounded-lg bg-red-500 text-white text-sm hover:bg-red-600",
        variant === "confirm"  && "rounded-lg bg-green-500 text-white text-sm hover:bg-green-600",
        // Tombol outline — border tanpa background
        variant === "outline"  && "rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800",
        variant === "blue"  && "rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600",
        // Tombol teks saja tanpa background
        variant === "link"     && "text-blue-400 hover:text-blue-300 hover:underline underline-offset-4 text-sm",
        // Tombol icon-only — ukuran mengikuti size, tanpa padding teks
        variant === "icon"     && "rounded-full bg-transparent hover:bg-slate-800 text-slate-400",

        // Size — Fix #1: semua pakai padding, tidak ada fixed width
        size === "xs"     && (variant === "icon" ? "p-1"   : "px-2.5 py-1 text-xs"),
        size === "small"  && (variant === "icon" ? "p-1.5" : "px-3 py-1.5 text-xs"),
        size === "normal" && (variant === "icon" ? "p-2"   : "px-4 py-2 text-sm"),
        size === "medium" && (variant === "icon" ? "p-2.5" : "px-5 py-2.5 text-sm"),
        size === "large"  && (variant === "icon" ? "p-3"   : "px-6 py-3 text-base"),

        className
      )}
    >
      {/* Fix #4: loading spinner menggantikan icon */}
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}