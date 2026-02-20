import {useMemo} from "react"
import { sortFiles } from "@/lib/fileSort";

export function useFilteredFiles(
  files: FileItem[],
  query: string,
  sortKey: string,
  sortOrder: string
) {
  return useMemo(() => {
    const q = query.toLowerCase();
    const filtered = q
      ? files.filter((f) => f.name.toLowerCase().includes(q))
      : files;

    return sortFiles(filtered, sortKey, sortOrder);
  }, [files, query, sortKey, sortOrder]);
}