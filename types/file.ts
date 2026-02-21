import type { PreviewType } from "@/lib/fileTypes";

export type FileItem = {
  name: string;
  type: "file" | "folder";
  mtime?: number;
  size?: number;
  previewType?: PreviewType;
  path: string;
};