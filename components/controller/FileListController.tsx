"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFileManager } from "@/context/FileManagerContext";

import { useFiles } from "@/hooks/useFiles";
import { useFilteredFiles } from "@/hooks/useFilteredFiles";
import { useFileActions } from "@/hooks/useFileActions";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { useModalManager } from "@/context/ModalManagerContext";

import FileListView from "@/components/file/FileListView";

export default function FileListController() {
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

  const { files, loading } = useFiles(path, refreshKey);
  const searchParams = useSearchParams();

  const { handleItemClick, handleDelete, handleCreateFolder } =
    useFileActions();

  const { closeModal, activeModal } = useModalManager();

  useBackNavigation({
    selectedFiles,
    clearSelection,
    currentFile: null,
    setCurrentFile: () => {},
    path,
    setPath,
  });

  const sortedFiles = useFilteredFiles(
    files,
    query,
    sortKey,
    sortOrder
  );

  /* Sync URL path */
  useEffect(() => {
    const urlPath = searchParams.get("path") ?? "";
    setPath(urlPath);
  }, [searchParams, setPath]);

  /* Reset search when path changes */
  useEffect(() => {
    setQuery("");
  }, [path, setQuery]);

  return (
    <FileListView
      loading={loading}
      files={files}
      sortedFiles={sortedFiles}
      viewMode={viewMode}
      currentFile={null} // sekarang preview tidak di sini
      selectedFiles={selectedFiles}
      onItemClick={handleItemClick}
      onSelect={toggleSelect}
      onClosePreview={closeModal}
      selectedCount={selectedFiles.size}
      onClearSelection={clearSelection}
      onDelete={handleDelete}
      onCreateFolder={handleCreateFolder}
    />
  );
}