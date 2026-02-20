"use client";

import { X, Trash2, Move, Share2, Download } from "lucide-react";

interface ActionBarProps {
  selectedCount: number;
  onClear: () => void;
  handleDelete?: () => void;
  onMove?: () => void;
}


export default function ActionBar({
  selectedCount,
  onClear,
  handleDelete,
  onMove,
}: ActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900 text-white px-6 py-4 rounded-2xl flex justify-between items-center shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="p-1.5 hover:bg-slate-800 rounded-full transition-colors"
          title="Batalkan seleksi"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-none">{selectedCount}</span>
          <span className="text-[10px] text-slate-400">Terpilih</span>
        </div>
      </div>

      <div className="flex gap-5">
        <button 
          onClick={onMove}
          className="flex flex-col items-center gap-1 group"
        >
          <Move className="w-5 h-5 text-blue-400 group-active:scale-90 transition-transform" />
          <span className="text-[10px] text-gray-400">Pindah</span>
        </button>
        
        <button 
          onClick={() => handleDelete?.()}
          className="flex flex-col items-center gap-1 group"
        >
          <Trash2 className="w-5 h-5 text-red-400 group-active:scale-90 transition-transform" />
          <span className="text-[10px] text-gray-400">Hapus</span>
        </button>
      </div>
    </div>
  );
}
