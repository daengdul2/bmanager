import { NextResponse } from "next/server";
import { listFiles, resolveSafePath } from "@/lib/fs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dir = searchParams.get("path") ?? "";
    const decodedDir = decodeURIComponent(dir);

    // Validasi path menggunakan resolveSafePath dari lib/fs
    // agar tidak duplikasi logika ROOT & path traversal protection
    resolveSafePath(decodedDir);

    const files = await listFiles(decodedDir);
    return NextResponse.json(files);

  } catch (err: any) {
    if (err.message?.includes("Access denied")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("Error reading folder:", err);
    return NextResponse.json(
      { error: "Cannot read folder" },
      { status: 500 }
    );
  }
}
