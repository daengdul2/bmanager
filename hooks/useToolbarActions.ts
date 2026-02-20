"use client";

import { useRef, useState } from "react";
import { useFileManager } from "@/context/FileManagerContext";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

export function useToolbarActions() {
  const { path, selectedFile, refreshFiles } = useFileManager();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [totalSize, setTotalSize] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ===============================
     CREATE FOLDER
  =============================== */
  const handleCreateFolder = async () => {
    const name = prompt("Nama folder baru?");
    if (!name) return;

    setLoading(true);

    await fetch("/api/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, name }),
    });

    setLoading(false);
    refreshFiles();
  };

  /* ===============================
     RENAME
  =============================== */
  const handleRename = async () => {
    if (!selectedFile) {
      alert("Pilih file dulu");
      return;
    }

    const newName = prompt("Nama baru?", selectedFile.filename);
    if (!newName) return;

    setLoading(true);

    await fetch("/api/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPath: selectedFile.path,
        newName,
      }),
    });

    setLoading(false);
    refreshFiles();
  };

  /* ===============================
     UPLOAD
  =============================== */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const total = files.reduce((acc, file) => acc + file.size, 0);

    setFileCount(files.length);
    setTotalSize(total);
    setUploadedSize(0);
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();

    files.forEach(file => {
      formData.append("files", file);
    });

    formData.append("path", path);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        setUploadedSize(event.loaded);
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setUploadProgress(0);
      refreshFiles();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadProgress(0);
      alert("Upload gagal");
    };

    xhr.send(formData);
  };

  return {
    fileInputRef,
    uploading,
    uploadProgress,
    totalSize,
    uploadedSize,
    fileCount,
    loading,
    handleCreateFolder,
    handleRename,
    handleUploadClick,
    handleUpload,
    formatBytes,
  };
}