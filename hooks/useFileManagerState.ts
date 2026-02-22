"use client";

import { useState, useCallback } from "react";
import type { FileItem } from "@/types/file";
import { ROOT } from "@/lib/config";

export function useFileManagerState() {
  // Fix utama: init path dengan ROOT bukan ""
  const [path, setPath] = useState(ROOT);
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

  // Fix: wrap semua setter & helper dengan useCallback
  // agar referensinya stabil dan tidak memicu re-render/loop di useEffect
  const stableSetPath = useCallback((p: string) => {
    // Jika path kosong (back dari root), kembalikan ke ROOT
    setPath(p || ROOT);
  }, []);

  const stableSetQuery = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const toggleSelect = useCallback((filePath: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(filePath)) next.delete(filePath);
      else next.add(filePath);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  return {
    path, setPath: stableSetPath,
    query, setQuery: stableSetQuery,
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