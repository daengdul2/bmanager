"use client";

import { Folder, SearchX } from "lucide-react";

import FileItemCard from "./FileItemCard";
import FileItemList from "./FileItemList";
import EmptyState from "./EmptyState";
import ActionBar from "@/components/footer/ActionBar";

import type { FileItem } from "@/types/file";

interface Props {
  loading: boolean;
  totalCount: number;         // Fix #3: ganti files[] dengan totalCount untuk empty state check
  sortedFiles: FileItem[];
  viewMode: "grid" | "list";
  selectedFiles: Set<string>;
  // Fix #3: hapus selectedCount
  onItemClick: (file: FileItem) => void;
  onSelect: (filePath: string) => void;
  onClearSelection: () => void;
  onDelete: () => void;
  onRename: (oldPath: string) => void; // Fix #1: tambahkan parameter oldPath
}

export default function FileListView({
  loading,
  totalCount,               // Fix #3
  sortedFiles,
  viewMode,
  selectedFiles,
  onItemClick,
  onSelect,
  onClearSelection,
  onDelete,
  onRename,
}: Props) {
  // Fix #2: derive selectedPath dari selectedFiles saat hanya 1 file dipilih
  const selectedCount = selectedFiles.size;
  const selectedPath = selectedCount === 1 ? Array.from(selectedFiles)[0] : null;

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        <div className="animate-pulse">Memuat berkas...</div>
      </div>
    );
  }

  // 2. Empty State (tidak ada file sama sekali)
  if (totalCount === 0) {
    return <EmptyState icon={Folder} message="Folder ini kosong" />;
  }

  // 3. Search Not Found State
  if (sortedFiles.length === 0) {
    return <EmptyState icon={SearchX} message="Berkas tidak ditemukan" />;
  }

  return (
    <div className="relative min-h-screen pb-32">
      {/* GRID / LIST VIEW */}
      <main className="p-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {sortedFiles.map((file) => (
              <FileItemCard
                key={file.path}
                file={file}
                isSelected={selectedFiles.has(file.path)}
                onClick={onItemClick}
                onSelect={() => onSelect(file.path)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            {sortedFiles.map((file) => (
              <FileItemList
                key={file.path}
                file={file}
                isSelected={selectedFiles.has(file.path)}
                onClick={onItemClick}
                onSelect={() => onSelect(file.path)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ACTION BAR — muncul saat ada seleksi */}
      <ActionBar
        selectedCount={selectedCount}
        onClear={onClearSelection}
        onDelete={onDelete}
        // Fix #2: kirim selectedPath ke onRename, disable jika lebih dari 1 file dipilih
        onRename={selectedPath ? () => onRename(selectedPath) : undefined}
        onMove={() => {}} // TODO: Implement move
      />
    </div>
  );
}