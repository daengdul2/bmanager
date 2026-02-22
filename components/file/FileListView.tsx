"use client";

import { Folder, SearchX } from "lucide-react";

import FileItemCard from "./FileItemCard";
import FileItemList from "./FileItemList";
import EmptyState from "./EmptyState";

import type { FileItem } from "@/types/file";

interface Props {
  loading: boolean;
  totalCount: number;        // Fix #2: wajib, bukan optional
  sortedFiles: FileItem[];
  viewMode: "grid" | "list";
  selectedFiles: Set<string>;
  query: string;             // Fix #3: terima sebagai prop bukan dari context
  onItemClick: (file: FileItem) => void;
  onSelect: (filePath: string) => void;
}

export default function FileListView({
  loading,
  totalCount,
  sortedFiles,
  viewMode,
  selectedFiles,
  query,
  onItemClick,
  onSelect,
}: Props) {
  // 1. Loading State
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        <div className="animate-pulse">Memuat berkas...</div>
      </div>
    );
  }

  // 2. Empty State — folder benar-benar kosong
  // Fix #4: cek query === "" agar tidak tampil saat sedang search
  if (totalCount === 0 && !query) {
    return <EmptyState icon={Folder} message="Folder ini kosong" />;
  }

  // 3. Search Not Found State
  if (sortedFiles.length === 0) {
    return <EmptyState icon={SearchX} message="Berkas tidak ditemukan" />;
  }

  return (
    <div className="relative min-h-screen pb-32">
      <main className="p-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {sortedFiles.map(file => (
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
            {sortedFiles.map(file => (
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
    </div>
  );
}