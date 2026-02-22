
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { oldPath, newName: rawName } = await req.json();

    if (!oldPath || typeof oldPath !== "string") {
      return NextResponse.json(
        { error: "oldPath is required" },
        { status: 400 }
      );
    }

    const newName = typeof rawName === "string" ? rawName.trim() : "";

    if (!newName || newName.includes("/")) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    const safeOld = resolveSafePath(oldPath);

    try {
      await fs.access(safeOld);
    } catch {
      return NextResponse.json(
        { error: "File atau folder tidak ditemukan" },
        { status: 404 }
      );
    }

    const newPath = resolveSafePath(path.join(path.dirname(safeOld), newName));

    try {
      await fs.access(newPath);
      return NextResponse.json(
        { error: "Nama sudah digunakan oleh file atau folder lain" },
        { status: 409 }
      );
    } catch {
      // Aman untuk rename
    }

    await fs.rename(safeOld, newPath);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Rename failed" },
      { status: err.message?.includes("Access denied") ? 403 : 500 }
    );
  }
}