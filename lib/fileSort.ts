// lib/fileSort.ts

export type SortKey = "name" | "type" | "date" | "size";
export type SortOrder = "asc" | "desc";

interface SortableFile {
  name: string;
  type: "file" | "folder";
  mtime?: number;
  size?: number;
}

export function sortFiles<T extends SortableFile>(
  files: T[],
  key: SortKey,
  order: SortOrder
): T[] {
  return [...files].sort((a, b) => {
    // Folder selalu di atas
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;

    let comparison = 0;

    switch (key) {
      case "name":
        comparison = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
        break;

      case "date":
        comparison = (a.mtime ?? 0) - (b.mtime ?? 0);
        break;

      case "size":
        comparison = (a.size ?? 0) - (b.size ?? 0);
        break;

      case "type": {
        const getExt = (name: string) =>
          name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";

        comparison = getExt(a.name).localeCompare(getExt(b.name));
        break;
      }

      default:
        comparison = 0;
    }

    return order === "asc" ? comparison : -comparison;
  });
}