import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ROOT = "/sdcard/Download";

function resolveSafe(target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    throw new Error("Access denied");
  }
  return resolved;
}

export async function POST(req: Request) {
  try {
    const { oldPath, newName: rawName } = await req.json();

    // Fix #1: validasi oldPath
    if (!oldPath || typeof oldPath !== "string") {
      return NextResponse.json(
        { error: "oldPath is required" },
        { status: 400 }
      );
    }

    // Fix #4: trim newName di sisi server
    const newName = typeof rawName === "string" ? rawName.trim() : "";

    if (!newName || newName.includes("/")) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    const safeOld = resolveSafe(oldPath);

    // Fix #2: pastikan file/folder sumber benar-benar ada
    try {
      await fs.access(safeOld);
    } catch {
      return NextResponse.json(
        { error: "File atau folder tidak ditemukan" },
        { status: 404 }
      );
    }

    const newPath = resolveSafe(
      path.join(path.dirname(safeOld), newName)
    );

    // Fix #3: cegah overwrite jika nama baru sudah dipakai
    try {
      await fs.access(newPath);
      // Jika tidak throw, berarti file sudah ada
      return NextResponse.json(
        { error: "Nama sudah digunakan oleh file atau folder lain" },
        { status: 409 }
      );
    } catch {
      // Tidak ada file dengan nama tersebut, aman untuk rename
    }

    await fs.rename(safeOld, newPath);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Rename failed" },
      { status: 500 }
    );
  }
}