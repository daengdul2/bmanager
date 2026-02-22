"use client";

import { X, Trash2, Move, Edit, Download } from "lucide-react";

interface ActionBarProps {
  selectedCount: number;
  selectedFiles: Set<string>;
  onClear: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onRename?: (oldPath: string) => void;
  onDownload?: (files: string[]) => void;
}

export default function ActionBar({
  selectedCount,
  selectedFiles,
  onClear,
  onDelete,
  onMove,
  onRename,
  onDownload,
}: ActionBarProps) {
  const isVisible = selectedCount > 0;
  const selectedArray = Array.from(selectedFiles);
  const singlePath = selectedCount === 1 ? selectedArray[0] : null;

  return (
    // Selalu ada di DOM, tapi animasi masuk/keluar via translate & opacity
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-xl border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900 text-slate-400 dark:text-white px-6 py-4 rounded-lg flex justify-between
        items-center shadow-2xl z-50
        transition-all duration-300 ease-in-out
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="p-1.5 hover:bg-slate-800 rounded-full transition-colors"
          title="Batalkan seleksi"
        >
          <X className="w-5 h-5 text-slate-700 dark:text-white" />
        </button>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-slate-700 dark:text-white leading-none">{selectedCount}</span>
          <span className="text-[10px] text-slate-700 dark:text-slate-400">Terpilih</span>
        </div>
      </div>

      <div className="flex gap-5">
        {onMove && (
          <button onClick={onMove} className="flex flex-col items-center gap-1 group">
            <Move className="w-5 h-5 text-slate-700 dark:text-white group-active:scale-90 transition-transform" />
            <span className="text-[10px] text-slate-700 dark:text-slate-400">Pindah</span>
          </button>
        )}

        {singlePath && onRename && (
          <button
            onClick={() => onRename(singlePath)}
            className="flex flex-col items-center gap-1 group"
          >
            <Edit className="w-5 h-5 text-blue-400 group-active:scale-90 transition-transform" />
            <span className="text-[10px] text-slate-700 dark:text-slate-400">Rename</span>
          </button>
        )}

        {onDownload && (
          <button
            onClick={() => onDownload(selectedArray)}
            className="flex flex-col items-center gap-1 group"
          >
            <Download className="w-5 h-5 text-green-400 group-active:scale-90 transition-transform" />
            <span className="text-[10px] text-slate-700 dark:text-slate-400">Unduh</span>
          </button>
        )}

        <button
          onClick={onDelete}
          disabled={!onDelete}
          className="flex flex-col items-center gap-1 group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5 text-red-400 group-active:scale-90 transition-transform" />
          <span className="text-[10px] text-slate-700 dark:text-slate-400">Hapus</span>
        </button>
      </div>
    </div>
  );
}
