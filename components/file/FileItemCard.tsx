"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/formatBytes";
import { shortenFileName } from "@/lib/fileName";
import { getFileInfo } from "@/lib/fileMeta";
import type { FileItem } from "@/types/file";

interface Props {
  file: FileItem;
  onClick: (file: FileItem) => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function FileItemCard({ file, onClick, onSelect, isSelected }: Props) {
  const { Icon, color } = getFileInfo(file.name, file.type);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") onClick(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(file)}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col items-center p-3 rounded-xl border transition cursor-pointer",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700"
      )}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="absolute top-1 left-1 p-1 z-10"
      >
        {isSelected ? (
          <CheckCircle2 className="w-5 h-5 text-blue-500 fill-white dark:fill-slate-900" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400" />
        )}
      </div>

      {/* Icon */}
      <Icon className={cn("w-12 h-12 p-3 rounded-xl mb-2 transition-transform group-hover:scale-110", color)} />

      {/* File Name */}
      <div className="text-xs text-center max-w-full text-slate-700 dark:text-slate-300" title={file.name}>
        {shortenFileName(file.name)}
      </div>

      {/* File Size */}
      <div className="text-[10px] text-slate-500 dark:text-slate-400">
        {file.size != null ? formatBytes(file.size) : "-"}
      </div>
    </div>
  );
}