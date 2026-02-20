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
    const { oldPath, newName } = await req.json();

    if (!newName || newName.includes("/")) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    const safeOld = resolveSafe(oldPath);

    const newPath = resolveSafe(
      path.join(path.dirname(safeOld), newName)
    );

    await fs.rename(safeOld, newPath);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Rename failed" },
      { status: 500 }
    );
  }
}