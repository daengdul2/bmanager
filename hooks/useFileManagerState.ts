"use client";

import { useState } from "react";
import type { FileItem } from "@/types/file";

export function useFileManagerState() {
  const [path, setPath] = useState("");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] =
    useState<"name" | "type" | "date" | "size">("name");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");

  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] =
    useState<FileItem | null>(null);

  const [selectedFiles, setSelectedFiles] =
    useState<Set<string>>(new Set());

  // ---- Selection helpers ----

  const toggleSelect = (filePath: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(filePath)) next.delete(filePath);
      else next.add(filePath);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  return {
    path, setPath,
    query, setQuery,
    sortKey, setSortKey,
    sortOrder, setSortOrder,
    viewMode, setViewMode,
    fileList, setFileList,
    currentFile, setCurrentFile,
    selectedFiles,
    toggleSelect,
    clearSelection,
  };
}