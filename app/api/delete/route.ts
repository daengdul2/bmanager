import fs from "fs/promises";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs"; // ← import resolveSafePath, tidak perlu ROOT lagi

export const runtime = "nodejs";

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
        // Gunakan resolveSafePath dari lib/fs.ts — tidak perlu fungsi duplikat
        const absolutePath = resolveSafePath(decodeURIComponent(filePath));

        await fs.rm(absolutePath, { recursive: true, force: true });

        results.push({ file: filePath, success: true });
      } catch (err: any) {
        results.push({
          file: filePath,
          success: false,
          error: err.message ?? "Delete failed",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}