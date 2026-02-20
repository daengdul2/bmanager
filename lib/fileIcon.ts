// lib/fileIcon.ts

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

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const VIDEO_EXT = new Set(["mp4", "mkv", "webm", "avi"]);
const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "flac"]);
const TEXT_EXT = new Set(["txt", "md", "json", "log"]);
const ARCHIVE_EXT = new Set(["zip", "rar", "7z", "tar"]);
const PDF_EXT = new Set(["pdf"]);
const DOC_EXT = new Set(["doc", "docx"]);
const EXCEL_EXT = new Set(["xls", "xlsx", "csv"]);

export function getFileIconKey(
  name: string,
  type: "file" | "folder"
): FileIconKey {
  if (type === "folder") return "folder";

  const base = name.split("/").pop()?.split("?")[0].split("#")[0].trim() ?? "";

  const rawExt = base.includes(".") ? base.split(".").pop() : undefined;
  const ext = rawExt?.toLowerCase();

  if (!ext) return "file";
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  if (AUDIO_EXT.has(ext)) return "audio";
  if (TEXT_EXT.has(ext)) return "text";
  if (ARCHIVE_EXT.has(ext)) return "archive";
  if (PDF_EXT.has(ext)) return "pdf";
  if (DOC_EXT.has(ext)) return "doc";
  if (EXCEL_EXT.has(ext)) return "excel";

  return "file";
}