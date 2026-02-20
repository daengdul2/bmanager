export function getFileColor(name: string, type: "file" | "folder" = "file"): string {
  if (type === "folder") {
    // Warna khusus untuk folder
    return "text-yellow-700 bg-yellow-100 dark:bg-yellow-200";
  }

  const ext = name.split(".").pop()?.toLowerCase();

  if (!ext) return "text-gray-700 bg-gray-200";

  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
    return "text-emerald-700 bg-emerald-200";
  }

  if (["mp4", "mkv", "webm", "avi"].includes(ext)) {
    return "text-purple-700 bg-purple-200";
  }

  if (["mp3", "wav", "ogg", "flac"].includes(ext)) {
    return "text-blue-700 bg-blue-200";
  }

  if (["pdf"].includes(ext)) {
    return "text-red-700 bg-red-200";
  }

  if (["txt", "md", "json", "log"].includes(ext)) {
    return "text-sky-700 bg-sky-200";
  }

  if (["zip", "rar", "7z", "tar"].includes(ext)) {
    return "text-amber-700 bg-amber-200";
  }

  return "text-gray-700 bg-gray-200";
}