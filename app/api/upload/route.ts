import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { resolveSafePath } from "@/lib/fs"; // ← ganti ROOT & resolveSafe lokal

export const runtime = "nodejs";

function sanitizeFileName(name: string): string {
  return path
    .basename(name)
    .replace(/[\/\\:*?"<>|]/g, "_")
    .trim();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const currentPath = (formData.get("path") as string) || "";

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = resolveSafePath(decodeURIComponent(currentPath));
    await fs.mkdir(uploadDir, { recursive: true });

    const results = [];
    const skipped = [];

    for (const file of files) {
      const safeName = sanitizeFileName(file.name);
      if (!safeName) {
        skipped.push({ name: file.name, reason: "Nama file tidak valid" });
        continue;
      }

      const filePath = path.join(uploadDir, safeName);

      try {
        await fs.access(filePath);
        skipped.push({ name: safeName, reason: "File sudah ada" });
        continue;
      } catch {
        // Aman untuk ditulis
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      results.push({ name: safeName, size: file.size });
    }

    return NextResponse.json({ success: true, uploaded: results, skipped });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Upload failed" },
      { status: err.message?.includes("Access denied") ? 403 : 500 }
    );
  }
}