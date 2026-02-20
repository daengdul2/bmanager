import { useEffect, useState } from "react";
import { joinPath } from "@/lib/path";
import { getPreviewType } from "@/lib/fileTypes";
import { useFileManager } from "@/context/FileManagerContext";

export function useFiles(path: string, refreshKey: number) {
  const { setFileList } = useFileManager();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFiles() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/files?path=${encodeURIComponent(path)}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();

        const normalized: FileItem[] = Array.isArray(data)
          ? data.map((f: any) => {
              const fullPath = joinPath(path, f.name);

              return {
                ...f,
                path: fullPath,
                previewType: f.previewType,
              };
            })
          : [];

        setFiles(normalized);

        setFileList(
          normalized
            .filter((f) => f.type === "file")
            .map((f) => ({
              name: f.name,
              path: f.path,
              previewType: f.previewType,
            }))
        );
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setFiles([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();

    return () => controller.abort();
  }, [path, setFileList, refreshKey]);

  return { files, loading };
}