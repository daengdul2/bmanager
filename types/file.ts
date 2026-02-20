export type FileItem = {
    name: string;
    type: "file" | "folder";
    mtime?: number;
    size?: number;
    previewType?: "image" | "video" | "audio" | "text" | "binary";
    path: string;
};