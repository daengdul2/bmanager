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

export default function FileItemList({ file, onClick, onSelect, isSelected }: Props) {
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
        "flex items-center gap-3 px-3 py-2 my-1 rounded-lg border transition cursor-pointer",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      {/* Icon + Selection */}
      <div
        className="relative flex-shrink-0"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        <Icon className={cn("w-11 h-11 p-2.5 rounded-xl transition-transform active:scale-90", color)} />
        {isSelected && (
          <div className="absolute -top-1 -right-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div
          className={cn(
            "text-sm font-medium truncate",
            isSelected ? "text-blue-500" : "text-slate-700 dark:text-slate-200"
          )}
          title={file.name}
        >
          {shortenFileName(file.name, 40)}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {file.type === "file" ? (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tight">
              {file.name.split(".").pop()} •{" "}
              {file.size != null ? formatBytes(file.size) : "0 B"}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tight">
              Folder
            </span>
          )}
        </div>
      </div>
    </div>
  );
}