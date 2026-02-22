"use client";

import { useCallback } from "react";
import { joinPath } from "@/lib/path";
import type { FileItem } from "@/types/file";
import { useTaskManager } from "@/context/TaskManagerContext";
import { useFileManager } from "@/context/FileManagerContext";
import { useModalManager } from "@/context/ModalManagerContext";

export function useFileActions() {
  const {
    path,
    setPath,
    selectedFiles,
    clearSelection,
    refreshFiles,
    toggleSelect,
  } = useFileManager();

  const { addTask, updateTask, finishTask, failTask, removeTask } = useTaskManager();
  const { openModal, openPreview, openConfirm, openRename, openCreateFolder } = useModalManager();



  /* =========================
     HANDLE ITEM CLICK
  ========================= */
  const handleItemClick = useCallback(
    (file: FileItem) => {
      const fullPath = file.path || joinPath(path, file.name);

      // Jika sedang dalam mode seleksi, toggle seleksi
      if (selectedFiles.size > 0) {
        toggleSelect(fullPath);
        return;
      }

      if (file.type === "folder") {
        setPath(fullPath);
      } else {
        // Kirim file sebagai { file: FileItem } ke modal preview
        openPreview(file);
      }
    },
    [path, selectedFiles, setPath, toggleSelect, openPreview]
  );

  /* =========================
     CREATE FOLDER
  ========================= */
  const handleCreateFolder = () => {
  openCreateFolder(path, async (name) => {
    const taskId = addTask({
      id: crypto.randomUUID(),
      type: "createFolder",
      label: `Membuat folder "${name}"`,
    });

    try {
      const res = await fetch("/api/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPath: path, name }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error ?? "Create folder failed");
      }

      updateTask(taskId, 100);
      finishTask(taskId);
      refreshFiles();
    } catch (error: any) {
      failTask(taskId);
      alert(`Gagal membuat folder: ${error.message}`);
    }
  });
};

  /* =========================
     DELETE
  ========================= */
const handleDelete = async () => {
  if (selectedFiles.size === 0) return;

  // Ambil info dulu
  let title = `Hapus ${selectedFiles.size} item?`;
  let description = "Tindakan ini tidak dapat dibatalkan.";

  try {
    const infoRes = await fetch("/api/delete-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: Array.from(selectedFiles) }),
    });

    if (infoRes.ok) {
      const info = await infoRes.json();
      const folderNote = info.folderCount > 0
        ? `${info.folderCount} folder dan ${info.totalFileCount} file`
        : `${info.totalFileCount} file`;
      description = `${folderNote} akan dihapus.\nTotal ukuran: ${info.totalSizeFormatted}\n\nTindakan ini tidak dapat dibatalkan.`;
    }
  } catch {
    // tetap lanjut dengan pesan default
  }

  openConfirm(title, description, async () => {
    const taskId = addTask({
      id: crypto.randomUUID(),
      type: "delete",
      label: `Menghapus ${selectedFiles.size} item`,
    });

    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: Array.from(selectedFiles) }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error ?? "Delete failed");
      }

      updateTask(taskId, 100);
      finishTask(taskId);
      clearSelection();
      refreshFiles();
    } catch (error: any) {
      failTask(taskId);
      alert(`Gagal menghapus: ${error.message}`);
    }
  });
};

  /* =========================
     RENAME
  ========================= */
const handleRename = async (oldPath: string) => {
  const oldName = oldPath.split("/").pop() ?? "";

  openRename(oldPath, oldName, async (newName) => {
    const taskId = addTask({
      id: crypto.randomUUID(),
      type: "rename",
      label: `Mengganti nama menjadi "${newName}"`,
    });

    try {
      const res = await fetch("/api/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath, newName }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error ?? "Rename failed");
      }

      updateTask(taskId, 100);
      finishTask(taskId);
      clearSelection();
      refreshFiles();
      
    } catch (error: any) {
      failTask(taskId);
      alert(`Gagal mengganti nama: ${error.message}`);
      
    }
  });
};

const handleDownload = async (files: string[]) => {
  if (files.length === 0) return;

  const taskId = addTask({
    id: crypto.randomUUID(),
    type: "download",
    label: files.length === 1
      ? `Mengunduh ${files[0]}`
      : `Mengunduh ${files.length} file`,
  });

  try {
    if (files.length === 1) {
      // === SINGLE FILE: GET ===
      const filePath = files[0];
      updateTask(taskId, 100);
      finishTask(taskId);

      window.location.href = `/api/download?path=${encodeURIComponent(filePath)}`;
    } else {
      // === MULTI FILE: POST ZIP ===
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error ?? "Download failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "download.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      updateTask(taskId, 100);
      finishTask(taskId);
      refreshFiles();
    }
  } catch (error: any) {
    failTask(taskId);
    alert(`Gagal mengunduh: ${error.message}`);
    refreshFiles();
  }
};





  /* =========================
     UPLOAD MODAL
  ========================= */
  const handleOpenUpload = () => openModal("upload");

  return {
    handleItemClick,
    handleDelete,
    handleCreateFolder,
    handleRename,
    handleOpenUpload,
    handleDownload,
  };
}
