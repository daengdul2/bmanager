"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  message: string;
}

export default function EmptyState({ icon: Icon, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
      <Icon className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}