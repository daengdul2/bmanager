import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ROOT = "/sdcard/Download";

function resolveSafe(target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    throw new Error("Access denied");
  }
  return resolved;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// Hitung rekursif jumlah file & total size dalam sebuah path
function calcStats(target: string): { fileCount: number; totalSize: number } {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return { fileCount: 1, totalSize: stat.size };
  }

  if (stat.isDirectory()) {
    let fileCount = 0;
    let totalSize = 0;
    const entries = fs.readdirSync(target);
    for (const entry of entries) {
      const child = path.join(target, entry);
      try {
        const childStats = calcStats(child);
        fileCount += childStats.fileCount;
        totalSize += childStats.totalSize;
      } catch {
        // skip file yang tidak bisa diakses
      }
    }
    return { fileCount, totalSize };
  }

  return { fileCount: 0, totalSize: 0 };
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await req.json();

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    let totalFileCount = 0;
    let totalSize = 0;
    let folderCount = 0;

    for (const file of files) {
      const safePath = resolveSafe(file);
      if (!fs.existsSync(safePath)) continue;

      const stat = fs.statSync(safePath);
      if (stat.isDirectory()) folderCount++;

      const stats = calcStats(safePath);
      totalFileCount += stats.fileCount;
      totalSize += stats.totalSize;
    }

    return NextResponse.json({
      totalFileCount,
      folderCount,
      totalSize,
      totalSizeFormatted: formatSize(totalSize),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to calculate" },
      { status: 500 }
    );
  }
}