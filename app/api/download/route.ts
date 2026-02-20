// app/api/download/route.ts
import fs from "fs";
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
    const fileName = fullPath.split("/").pop() ?? "file";

    const nodeStream = fs.createReadStream(fullPath);

    // ⬇️ konversi Node stream → Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", chunk => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", err => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Cannot download file" },
      { status: 500 }
    );
  }
}