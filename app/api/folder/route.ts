import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ROOT = "/sdcard/Download";

function resolveSafe(target: string) {
  const resolved = path.resolve(ROOT, target);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    throw new Error("Access denied");
  }
  return resolved;
}

export async function POST(req: Request) {
  try {
    const { currentPath, name } = await req.json();

    if (!name || name.includes("/")) {
      return NextResponse.json(
        { error: "Invalid folder name" },
        { status: 400 }
      );
    }

    const fullPath = resolveSafe(
      path.join(currentPath, name)
    );

    await fs.mkdir(fullPath);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Create failed" },
      { status: 500 }
    );
  }
}