import { NextResponse } from "next/server";
import { listFiles } from "@/lib/fs";
import path from "path";

const ROOT = "/sdcard/Download";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dir = searchParams.get("path") ?? "";
    const decodedDir = decodeURIComponent(dir);

    // Validasi path agar tidak keluar dari ROOT
    const resolvedRoot = path.resolve(ROOT);
    const resolvedPath = path.resolve(path.join(ROOT, decodedDir));
    if (!resolvedPath.startsWith(resolvedRoot)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const files = await listFiles(decodedDir);
    return NextResponse.json(files);

  } catch (err) {
    console.error("Error reading folder:", err);
    return NextResponse.json(
      { error: "Cannot read folder" },
      { status: 500 }
    );
  }
}