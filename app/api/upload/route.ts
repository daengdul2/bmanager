import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

const ROOT = "/sdcard/Download"; // sesuaikan dengan root kamu

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("files") as File[];
    const currentPath = (formData.get("path") as string) || "";

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(ROOT, currentPath);

    await fs.mkdir(uploadDir, { recursive: true });

    const results = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filePath = path.join(uploadDir, file.name);

      await fs.writeFile(filePath, buffer);

      results.push({
        name: file.name,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      uploaded: results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}