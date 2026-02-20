"use client";

import { Upload, FolderPlus } from "lucide-react";

interface ToolbarProps {
  onUploadClick: () => void;
  onCreateFolder?: () => void;
  disabled?: boolean;
}

export default function Toolbar({
  onUploadClick,
  onCreateFolder,
  disabled,
}: ToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-40">
      <div className="border border-slate-800 max-w-md mx-auto bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex justify-around">

        <button
          onClick={onUploadClick}
          disabled={disabled}
          className="flex flex-col items-center text-[10px] text-slate-400 gap-1 disabled:opacity-50"
        >
          <Upload size={18} className="text-white" />
          Upload
        </button>

        <button
          onClick={onCreateFolder}
          disabled={disabled}
          className="flex flex-col items-center text-[10px] text-slate-400 gap-1 disabled:opacity-50"
        >
          <FolderPlus size={18} className="text-white" />
          Folder
        </button>

      </div>
    </div>
  );
}