export const FILE_TYPES = {
  text: new Set([
    "txt", "md", "log", "json",
    "js", "ts", "jsx", "tsx",
    "css", "html"
  ]),
  image: new Set(["png", "jpg", "jpeg", "gif", "webp"]),
  video: new Set(["mp4", "webm"]),
  audio: new Set(["mp3", "wav"]),
} as const;

export type PreviewType = keyof typeof FILE_TYPES | "binary";

/* 🔹 Buat reverse map sekali saja */
const EXTENSION_MAP: Record<string, PreviewType> = (() => {
  const map: Record<string, PreviewType> = {};

  for (const [type, exts] of Object.entries(FILE_TYPES)) {
    for (const ext of exts) {
      map[ext] = type as PreviewType;
    }
  }

  return map;
})();

export function getPreviewType(filename?: string): PreviewType {
  if (!filename) return "binary";

  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return "binary";

  return EXTENSION_MAP[ext] ?? "binary";
}

export function isMediaType(type: PreviewType) {
  return type === "image" || type === "video" || type === "audio";
}