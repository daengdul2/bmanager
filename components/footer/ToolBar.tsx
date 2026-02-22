"use client";

import { Upload, FolderPlus } from "lucide-react";

interface ToolBarProps {
  selectedCount: number;
  onUploadClick: () => void;
  onCreateFolder?: () => void;
  disabled?: boolean;
}

export default function ToolBar({
  selectedCount,
  onUploadClick,
  onCreateFolder,
  disabled,
}: ToolBarProps) {
  // Toolbar sembunyikan diri saat ada seleksi — ActionBar yang tampil
  const isVisible = selectedCount === 0;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-40 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto
        bg-white dark:bg-slate-900 text-slate-400 dark:text-white
        px-6 py-4 rounded-lg shadow-2xl flex justify-around
        transition-all duration-300 ease-in-out 
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >

        <button
          onClick={onUploadClick}
          disabled={disabled}
          className="flex flex-col items-center text-[10px] text-slate-700 dark:text-slate-400 gap-1 disabled:opacity-50"
        >
          <Upload size={18} className="text-slate-700 dark:text-white" />
          Upload
        </button>

        <button
          onClick={onCreateFolder}
          disabled={disabled}
          className="flex flex-col items-center text-[10px] text-slate-700 dark:text-slate-400 gap-1 disabled:opacity-50"
        >
          <FolderPlus size={18} className="text-slate-700 dark:text-white" />
          Folder
        </button>

    </div>
  );
}
