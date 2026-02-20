import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // WAJIB agar bisa pakai fs

const ROOT = "/sdcard/Download"; // sesuaikan dengan root kamu

/**
 * Pastikan target benar-benar berada di dalam ROOT
 */
function isPathInsideRoot(targetPath: string) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedRoot = path.resolve(ROOT);

  return (
    resolvedTarget === resolvedRoot ||
    resolvedTarget.startsWith(resolvedRoot + path.sep)
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const files: string[] = body.files;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "Invalid file list" },
        { status: 400 }
      );
    }

    const results = [];

    for (const filePath of files) {
      try {
        // decode dari client
        const decodedPath = decodeURIComponent(filePath);

        // 🔥 SELALU resolve dari ROOT (jangan percaya client)
        const absolutePath = path.resolve(ROOT, decodedPath);

        console.log("DELETE:", absolutePath);

        if (!isPathInsideRoot(absolutePath)) {
          results.push({
            file: filePath,
            success: false,
            error: "Access denied",
          });
          continue;
        }

        // Hapus file / folder (recursive aman untuk folder)
        await fs.rm(absolutePath, {
          recursive: true,
          force: true,
        });

        results.push({
          file: filePath,
          success: true,
        });
      } catch (err) {
        console.error("Delete error:", err);

        results.push({
          file: filePath,
          success: false,
          error: "Delete failed",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}