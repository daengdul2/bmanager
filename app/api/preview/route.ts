import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { resolveSafePath } from "@/lib/fs";

export const runtime = "nodejs";

const MAX_TEXT_PREVIEW_BYTES = 10000;

/* ---------------- MIME MAPPING ---------------- */

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  const map: Record<string, string> = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",

    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",

    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",

    ".txt": "text/plain",
    ".json": "application/json",
    ".js": "text/javascript",
    ".ts": "text/typescript",
    ".html": "text/html",
    ".css": "text/css",
  };

  return map[ext] || "application/octet-stream";
}

/* ---------------- MAIN HANDLER ---------------- */

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");
  const download = req.nextUrl.searchParams.get("download");

  if (!file) {
    return new Response("File not specified", { status: 400 });
  }

  let safePath: string;
  try {
    // Ganti ROOT & resolveSafe lokal dengan resolveSafePath dari lib/fs
    safePath = resolveSafePath(decodeURIComponent(file));
  } catch {
    return new Response("Access denied", { status: 403 });
  }

  if (!fs.existsSync(safePath)) {
    return new Response("File not found", { status: 404 });
  }

  const stat = fs.statSync(safePath);
  if (!stat.isFile()) {
    return new Response("Not a file", { status: 400 });
  }

  const mimeType = getMimeType(safePath);
  const fileSize = stat.size;

  // Encode nama file agar aman untuk header (fix nama non-ASCII)
  const fileName = path.basename(safePath);
  const encodedFileName = encodeURIComponent(fileName);
  const contentDisposition = (disposition: "inline" | "attachment") =>
    disposition === "attachment"
      ? `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`
      : "inline";

  /* ================= TEXT PREVIEW ================= */

  if (mimeType.startsWith("text")) {
    const content = fs.readFileSync(safePath, "utf-8");
    const truncated = content.slice(0, MAX_TEXT_PREVIEW_BYTES);

    return new Response(truncated, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  /* ================= RANGE SUPPORT ================= */

  const range = req.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${fileSize}` },
      });
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(safePath, { start, end });

    return new Response(stream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": mimeType,
        "Content-Disposition": contentDisposition(download === "1" ? "attachment" : "inline"),
      },
    });
  }

  /* ================= FULL STREAM ================= */

  const stream = fs.createReadStream(safePath);

  return new Response(stream as any, {
    headers: {
      "Content-Length": fileSize.toString(),
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Content-Disposition": contentDisposition(download === "1" ? "attachment" : "inline"),
    },
  });
}
