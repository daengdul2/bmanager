"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFileManager } from "@/context/FileManagerContext";
import { useFiles } from "@/hooks/useFiles";
import { useFilteredFiles } from "@/hooks/useFilteredFiles";
import { useFileActions } from "@/hooks/useFileActions";
import { useBackNavigation } from "@/hooks/useBackNavigation";

import FileListView from "@/components/file/FileListView";

export default function FileListContainer() {
  const {
    path,
    setPath,
    query,
    sortKey,
    sortOrder,
    viewMode,
    selectedFiles,
    toggleSelect,
    clearSelection,
    setQuery,
    refreshKey,
  } = useFileManager();

  // Fix #4: destructure error dari useFiles
  const { files, loading, error } = useFiles(path, refreshKey);
  const searchParams = useSearchParams();
  const { handleItemClick, handleDelete, handleRename } = useFileActions();

  // Sync URL path → state
  // Fix #3: setPath harus di-memoize dengan useCallback di FileManagerContext
  //         agar effect ini tidak re-run setiap render
  useEffect(() => {
    const urlPath = searchParams.get("path") ?? "";
    setPath(urlPath);
  }, [searchParams, setPath]);

  // Reset search saat pindah folder
  useEffect(() => {
    setQuery("");
  }, [path, setQuery]);

  // Back button handling
  useBackNavigation({ selectedFiles, clearSelection, path, setPath });

  // Fix #1: hanya kirim sortedFiles ke FileListView, bukan files mentah
  const sortedFiles = useFilteredFiles(files, query, sortKey, sortOrder);

  // Fix #4: tampilkan pesan error jika fetch gagal
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Gagal memuat file: {error.message ?? "Terjadi kesalahan."}</p>
      </div>
    );
  }

  return (
    <FileListView
      loading={loading}
      // Fix #1: hapus prop files, cukup kirim sortedFiles
      sortedFiles={sortedFiles}
      viewMode={viewMode}
      selectedFiles={selectedFiles}
      // Fix #2: hapus selectedCount, biarkan FileListView hitung sendiri via selectedFiles.size
      onItemClick={handleItemClick}
      onSelect={toggleSelect}
      onClearSelection={clearSelection}
      onDelete={handleDelete}
      onRename={handleRename}
    />
  );
}