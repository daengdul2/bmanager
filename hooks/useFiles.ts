"use client";

import { useEffect, useState } from "react";
import { joinPath } from "@/lib/path";
import { useFileManager } from "@/context/FileManagerContext";
import type { FileItem } from "@/types/file";

export function useFiles(path: string, refreshKey: number) {
  const { setFileList } = useFileManager();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // ← tambah ini

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFiles() {
      try {
        setLoading(true);
        setError(null); // ← reset error setiap fetch baru

        const res = await fetch(
          `/api/files?path=${encodeURIComponent(path)}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`Gagal memuat file (${res.status})`);

        const data: FileItem[] = await res.json();

        const normalized: FileItem[] = Array.isArray(data)
          ? data.map((f) => ({
              ...f,
              path: joinPath(path, f.name),
            }))
          : [];

        setFiles(normalized);
        setFileList(normalized.filter((f) => f.type === "file"));
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError(err); // ← simpan error
          setFiles([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();

    return () => controller.abort();
  }, [path, setFileList, refreshKey]);

  return { files, loading, error }; // ← tambah error
}