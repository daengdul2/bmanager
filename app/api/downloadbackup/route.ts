// app/api/download/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get("path");

  if (!filePath) {
    return NextResponse.json(
      { error: "File path required" },
      { status: 400 }
    );
  }

  try {
    const fullPath = resolveSafePath(decodeURIComponent(filePath));

    // Fix #2: pastikan path adalah file, bukan folder
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return NextResponse.json(
        { error: "Path is not a file" },
        { status: 400 }
      );
    }

    const fileName = path.basename(fullPath);

    // Fix #1: encode nama file agar aman untuk header
    const encodedFileName = encodeURIComponent(fileName);

    const nodeStream = fs.createReadStream(fullPath);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      headers: {
        // Fix #1: gunakan RFC 5987 encoding untuk nama file non-ASCII
        "Content-Disposition": `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": "application/octet-stream",
        // Fix #3: tambahkan Content-Length untuk progress download
        "Content-Length": stat.size.toString(),
      },
    });

  } catch (err: any) {
    console.error(err);

    // Fix #4: bedakan Access denied vs error lain
    if (err.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    if (err.code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Cannot download file" },
      { status: 500 }
    );
  }
}