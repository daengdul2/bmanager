// app/api/download/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { resolveSafePath } from "@/lib/fs";
import archiver from "archiver";

/* ================================
   Helper: stream satu file
================================ */
function streamFile(fullPath: string): NextResponse {
    const stat = fs.statSync(fullPath);
    const fileName = path.basename(fullPath);
    const encodedFileName = encodeURIComponent(fileName);
    const nodeStream = fs.createReadStream(fullPath);

    const webStream = new ReadableStream({
        start(controller) {
            nodeStream.on("data", (chunk: string | Buffer) => {
                const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
                controller.enqueue(buf);
            });
            nodeStream.on("end", () => controller.close());
            nodeStream.on("error", err => controller.error(err));
        },
        cancel() {
            nodeStream.destroy();
        }
    });

    return new NextResponse(webStream, {
        headers: {
            "Content-Disposition": `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
            "Content-Type": "application/octet-stream",
            "Content-Length": stat.size.toString()
        }
    });
}

/* ================================
   GET: download satu file
================================ */
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
        const stat = fs.statSync(fullPath);

        if (!stat.isFile()) {
            return NextResponse.json(
                { error: "Path is not a file" },
                { status: 400 }
            );
        }

        return streamFile(fullPath);
    } catch (err: any) {
        if (err.message?.includes("Access denied")) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }
        if (err.code === "ENOENT") {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Cannot download file" },
            { status: 500 }
        );
    }
}

/* ================================
   POST: download banyak file (ZIP)
================================ */
export async function POST(request: Request) {
    let body: any;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const files: string[] = body.files;

    if (!files || files.length === 0) {
        return NextResponse.json(
            { error: "No files provided" },
            { status: 400 }
        );
    }

    try {
        // Resolve & validasi semua path sekaligus
        const safePaths = files.map(f =>
            resolveSafePath(decodeURIComponent(f))
        );

        // Fix #1: gunakan helper streamFile agar tidak duplikat kode GET
        if (safePaths.length === 1) {
            const fullPath = safePaths[0];
            const stat = fs.statSync(fullPath);
            if (!stat.isFile()) {
                return NextResponse.json(
                    { error: "Path is not a file" },
                    { status: 400 }
                );
            }
            return streamFile(fullPath);
        }

        // Banyak file → ZIP
        const archive = archiver("zip", { zlib: { level: 9 } });

        const webStream = new ReadableStream({
            start(controller) {
                archive.on("data", (chunk: string | Buffer) => {
                    const buf = Buffer.isBuffer(chunk)
                        ? chunk
                        : Buffer.from(chunk);
                    controller.enqueue(buf);
                });
                archive.on("end", () => controller.close());
                archive.on("error", err => controller.error(err));

                for (const fullPath of safePaths) {
                    try {
                        const stat = fs.statSync(fullPath);

                        if (stat.isFile()) {
                            // File biasa
                            archive.file(fullPath, {
                                name: path.basename(fullPath)
                            });
                        } else if (stat.isDirectory()) {
                            // Fix #2: folder di-zip rekursif
                            archive.directory(
                                fullPath,
                                path.basename(fullPath)
                            );
                        }
                        // Fix #3: file tidak ditemukan di-skip, tidak gagalkan seluruh ZIP
                    } catch {
                        // skip file yang tidak bisa diakses
                    }
                }

                archive.finalize();
            },
            cancel() {
                archive.destroy();
            }
        });

        return new NextResponse(webStream, {
            headers: {
                "Content-Disposition": `attachment; filename="download.zip"`,
                "Content-Type": "application/zip"
            }
        });
    } catch (err: any) {
        // Fix #4: bedakan Access denied dari error lain
        if (err.message?.includes("Access denied")) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }
        if (err.code === "ENOENT") {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Cannot download files" },
            { status: 500 }
        );
    }
}
