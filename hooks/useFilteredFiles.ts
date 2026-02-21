"use client";

import { useMemo } from "react";
import { sortFiles, type SortKey, type SortOrder } from "@/lib/fileSort";
import type { FileItem } from "@/types/file";

export function useFilteredFiles(
  files: FileItem[],
  query: string,
  sortKey: SortKey,
  sortOrder: SortOrder
): FileItem[] {
  return useMemo(() => {
    const q = query.toLowerCase();
    const filtered = q
      ? files.filter((f) => f.name.toLowerCase().includes(q))
      : files;

    return sortFiles(filtered, sortKey, sortOrder);
  }, [files, query, sortKey, sortOrder]);
}