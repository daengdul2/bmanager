// app/api/download/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs";
import archiver from "archiver";

// === GET: download satu file ===
export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "File path required" }, { status: 400 });
  }

  try {
    const fullPath = resolveSafePath(decodeURIComponent(filePath));
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Path is not a file" }, { status: 400 });
    }

    const fileName = path.basename(fullPath);
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
        "Content-Disposition": `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (err: any) {
    console.error(err);
    if (err.code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Cannot download file" }, { status: 500 });
  }
}

// === POST: download banyak file (ZIP) ===
export async function POST(request: Request) {
  const body = await request.json();
  const files: string[] = body.files;

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  try {
    const safePaths = files.map((f) => resolveSafePath(decodeURIComponent(f)));

    if (safePaths.length === 1) {
      // Jika hanya 1 file, sama seperti GET
      const fullPath = safePaths[0];
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) {
        return NextResponse.json({ error: "Path is not a file" }, { status: 400 });
      }

      const fileName = path.basename(fullPath);
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
          "Content-Disposition": `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
          "Content-Type": "application/octet-stream",
          "Content-Length": stat.size.toString(),
        },
      });
    } else {
      // Jika banyak file → buat ZIP
      const archive = archiver("zip", { zlib: { level: 9 } });

      const webStream = new ReadableStream({
        start(controller) {
          archive.on("data", (chunk) => controller.enqueue(chunk));
          archive.on("end", () => controller.close());
          archive.on("error", (err) => controller.error(err));

          safePaths.forEach((fullPath) => {
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) {
              archive.file(fullPath, { name: path.basename(fullPath) });
            }
          });

          archive.finalize();
        },
        cancel() {
          archive.destroy();
        },
      });

      return new NextResponse(webStream, {
        headers: {
          "Content-Disposition": `attachment; filename="download.zip"`,
          "Content-Type": "application/zip",
        },
      });
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Cannot download files" }, { status: 500 });
  }
}