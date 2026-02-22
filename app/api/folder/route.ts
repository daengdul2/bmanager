import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { currentPath, name: rawName } = await req.json();

    // Trim nama folder
    const name = typeof rawName === "string" ? rawName.trim() : "";

    if (!name || name.includes("/")) {
      return NextResponse.json(
        { error: "Invalid folder name" },
        { status: 400 }
      );
    }

    const fullPath = resolveSafePath(
      path.join(decodeURIComponent(currentPath ?? ""), name)
    );

    // Cek apakah folder sudah ada
    try {
      await fs.access(fullPath);
      return NextResponse.json(
        { error: "Folder dengan nama tersebut sudah ada" },
        { status: 409 }
      );
    } catch {
      // Belum ada, aman untuk dibuat
    }

    // Tambah recursive: true agar tidak error jika parent belum ada
    await fs.mkdir(fullPath, { recursive: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Create failed" },
      { status: err.message?.includes("Access denied") ? 403 : 500 }
    );
  }
}
