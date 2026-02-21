import {
  Folder,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import type { SVGProps, ComponentType } from "react";

/* =========================
   1. Types
========================= */

export type FileIconKey =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "archive"
  | "pdf"
  | "doc"
  | "excel"
  | "file";

type FileMeta = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
};

/* =========================
   2. Extension → Key Mapping
========================= */

const EXTENSION_MAP: Record<string, FileIconKey> = {
  // Images
  png: "image", jpg: "image", jpeg: "image",
  gif: "image", webp: "image", svg: "image",

  // Video
  mp4: "video", mkv: "video", webm: "video", avi: "video",

  // Audio
  mp3: "audio", wav: "audio", ogg: "audio", flac: "audio",

  // Documents
  pdf: "pdf",
  doc: "doc", docx: "doc",
  xls: "excel", xlsx: "excel", csv: "excel",

  // Text
  txt: "text", md: "text", json: "text", log: "text",

  // Archives
  zip: "archive", rar: "archive", "7z": "archive", tar: "archive",
};

/* =========================
   3. Key → Icon + Color Map
========================= */

const FILE_META: Record<FileIconKey, FileMeta> = {
  folder:  { Icon: Folder,          color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20" },
  image:   { Icon: ImageIcon,       color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20" },
  video:   { Icon: Video,           color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
  audio:   { Icon: Music,           color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
  pdf:     { Icon: FileType,        color: "text-red-600 bg-red-100 dark:bg-red-900/20" },
  text:    { Icon: FileText,        color: "text-sky-600 bg-sky-100 dark:bg-sky-900/20" },
  archive: { Icon: FileArchive,     color: "text-amber-700 bg-amber-100 dark:bg-amber-900/20" },
  doc:     { Icon: FileText,        color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20" },
  excel:   { Icon: FileSpreadsheet, color: "text-green-700 bg-green-100 dark:bg-green-900/20" },
  file:    { Icon: File,            color: "text-slate-500 bg-slate-100 dark:bg-slate-800/40" },
};

/* =========================
   4. Internal Helpers
========================= */

function getExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function resolveKey(name: string, type: "file" | "folder"): FileIconKey {
  if (type === "folder") return "folder";
  return EXTENSION_MAP[getExtension(name)] ?? "file";
}

/* =========================
   5. Public API
========================= */

export function getFileInfo(name: string, type: "file" | "folder") {
  const key = resolveKey(name, type);
  return { ...FILE_META[key], key };
}

export function getFileIconKey(name: string, type: "file" | "folder"): FileIconKey {
  return resolveKey(name, type);
}