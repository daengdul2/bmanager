"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFileManager } from "@/context/FileManagerContext";
import { useFileActionsContext } from "@/context/FileActionsContext";
import { useFiles } from "@/hooks/useFiles";
import { useFilteredFiles } from "@/hooks/useFilteredFiles";
import { useBackNavigation } from "@/hooks/useBackNavigation";

import FileListView from "@/components/file/FileListView";
import { ROOT } from "@/lib/config";

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

  const { files, loading, error } = useFiles(path, refreshKey);
  const searchParams = useSearchParams();
  const { handleItemClick } = useFileActionsContext();

  // Sync URL path → state
  useEffect(() => {
    const urlPath = searchParams.get("path") ?? "";
    const absolutePath = urlPath ? `${ROOT}/${urlPath}` : ROOT;
    setPath(absolutePath);
  }, [searchParams, setPath]);

  // Reset search saat pindah folder
  useEffect(() => {
    setQuery("");
  }, [path, setQuery]);

  // Back button handling
  useBackNavigation({ selectedFiles, clearSelection, path, setPath });

  const sortedFiles = useFilteredFiles(files, query, sortKey, sortOrder);

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
      sortedFiles={sortedFiles}
      totalCount={files.length}
      viewMode={viewMode}
      selectedFiles={selectedFiles}
      query={query}
      onItemClick={handleItemClick}
      onSelect={toggleSelect}
    />
  );
}
