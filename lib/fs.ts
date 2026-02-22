import fs from "fs/promises";
import path from "path";
import { getPreviewType } from "@/lib/fileTypes";
import { ROOT } from "@/lib/config";
export { ROOT };

export type FileEntry = {
  name: string;
  type: "file" | "folder";
  size?: number;
  mtime?: number;
  previewType?: "image" | "video" | "audio" | "text" | "binary";
};

export function resolveSafePath(subPath = ""): string {
  const target = path.resolve(ROOT, subPath);
  if (target !== ROOT && !target.startsWith(ROOT + "/")) {
    throw new Error("Invalid path: akses di luar direktori root tidak diizinkan");
  }
  return target;
}

export async function listFiles(dir = ""): Promise<FileEntry[]> {
  try {
    const target = resolveSafePath(decodeURIComponent(dir));
    const entries = await fs.readdir(target, { withFileTypes: true });

    const mapped: FileEntry[] = await Promise.all(
      entries.map(async (e) => {
        const fullPath = path.join(target, e.name);
        const stats = await fs.stat(fullPath);
        return {
          name: e.name,
          type: e.isDirectory() ? "folder" : "file",
          size: e.isDirectory() ? undefined : stats.size,
          mtime: stats.mtimeMs,
          previewType: e.isDirectory() ? undefined : getPreviewType(e.name),
        };
      })
    );

    mapped.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return mapped;
  } catch (err) {
    console.error("Error reading folder:", err);
    return [];
  }
}