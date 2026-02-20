"use client";

import { Folder, SearchX } from "lucide-react";

import FileItemCard from "./FileItemCard";
import FileItemList from "./FileItemList";
import EmptyState from "./EmptyState";
import FilePreview from "@/components/modal/FilePreview";
import ActionBar from "../footer/ActionBar";
import ToolBar from "../controller/ToolBarController";

import type { FileItem } from "@/types/file";

interface Props {
  loading: boolean;
  files: FileItem[];
  sortedFiles: FileItem[];
  viewMode: "grid" | "list";
  currentFile: FileItem | null; // Data dari modal.props
  selectedFiles: Set<string>;
  selectedCount: number;

  onItemClick: (file: FileItem) => void;
  onSelect: (filePath: string) => void;
  onClosePreview: () => void;

  onClearSelection: () => void;
  onDelete: () => void;
  onCreateFolder: () => void;
}

export default function FileListView({
  loading,
  files,
  sortedFiles,
  viewMode,
  currentFile,
  selectedFiles,
  selectedCount,
  onItemClick,
  onSelect,
  onClosePreview,
  onClearSelection,
  onDelete,
  onCreateFolder,
}: Props) {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        <div className="animate-pulse">Memuat berkas...</div>
      </div>
    );
  }

  // 2. Empty State (No Files at all)
  if (files.length === 0) {
    return <EmptyState icon={Folder} message="Folder ini kosong" />;
  }

  // 3. Search Not Found State
  if (sortedFiles.length === 0) {
    return <EmptyState icon={SearchX} message="Berkas tidak ditemukan" />;
  }

  return (
    <div className="relative min-h-screen pb-32"> {/* Tambah padding bottom agar tidak tertutup ActionBar */}
      
      {/* GRID / LIST VIEW */}
      <main className="p-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {sortedFiles.map(file => (
              <FileItemCard
                key={file.path}
                file={file}
                isSelected={selectedFiles.has(file.path)}
                onClick={() => onItemClick(file)}
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
                onClick={() => onItemClick(file)}
                onSelect={() => onSelect(file.path)}
              />
            ))}
          </div>
        )}
      </main>

      {/* OVERLAY MODALS */}
      {/* Render preview jika currentFile (modal.props) tersedia */}
      {currentFile && (
        <FilePreview
          file={currentFile}
          onClose={onClosePreview}
        />
      )}

      {/* CONTROLS */}
      <ToolBar
        selectedCount={selectedCount}
        handleCreateFolder={onCreateFolder}
      />

      <ActionBar
        selectedCount={selectedCount}
        onClear={onClearSelection}
        handleDelete={onDelete}
        onMove={() => {}} // TODO: Implement move logic
      />
    </div>
  );
}
