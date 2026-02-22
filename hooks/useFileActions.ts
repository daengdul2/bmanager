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

  // Fix #1: hapus removeTask karena tidak dipakai
  const { addTask, updateTask, finishTask, failTask } = useTaskManager();
  const { openModal, openPreview, openConfirm, openRename, openCreateFolder } = useModalManager();

  /* =========================
     HANDLE ITEM CLICK
  ========================= */
  const handleItemClick = useCallback(
    (file: FileItem) => {
      const fullPath = file.path || joinPath(path, file.name);

      if (selectedFiles.size > 0) {
        toggleSelect(fullPath);
        return;
      }

      if (file.type === "folder") {
        setPath(fullPath);
      } else {
        openPreview(file);
      }
    },
    [path, selectedFiles, setPath, toggleSelect, openPreview]
  );

  /* =========================
     CREATE FOLDER
  ========================= */
  const handleCreateFolder = useCallback(() => {
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
  }, [path, openCreateFolder, addTask, updateTask, finishTask, failTask, refreshFiles]);

  /* =========================
     DELETE
  ========================= */
  const handleDelete = useCallback(async () => {
    if (selectedFiles.size === 0) return;

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
  }, [selectedFiles, openConfirm, addTask, updateTask, finishTask, failTask, clearSelection, refreshFiles]);

  /* =========================
     RENAME
  ========================= */
  const handleRename = useCallback(async (oldPath: string) => {
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
  }, [openRename, addTask, updateTask, finishTask, failTask, clearSelection, refreshFiles]);

  /* =========================
     DOWNLOAD
  ========================= */
  const handleDownload = useCallback(async (files: string[]) => {
    if (files.length === 0) return;

    // Fix #2: label pakai nama file saja, bukan path penuh
    const label = files.length === 1
      ? `Mengunduh ${files[0].split("/").pop()}`
      : `Mengunduh ${files.length} file`;

    const taskId = addTask({
      id: crypto.randomUUID(),
      type: "download",
      label,
    });

    try {
      let downloadUrl: string;
      let downloadName: string;

      if (files.length === 1) {
        // Fix #5: single file juga pakai anchor agar konsisten dengan multi file
        downloadUrl = `/api/download?path=${encodeURIComponent(files[0])}`;
        downloadName = files[0].split("/").pop() ?? "file";
      } else {
        // Multi file → ZIP
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
        downloadUrl = URL.createObjectURL(blob);
        downloadName = "download.zip";
      }

      // Fix #4: trigger download via anchor — lebih konsisten dan terkontrol
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Revoke blob URL jika multi file
      if (files.length > 1) {
        URL.revokeObjectURL(downloadUrl);
      }

      updateTask(taskId, 100);
      finishTask(taskId);
      // Fix #3: hapus refreshFiles() — download tidak mengubah file
    } catch (error: any) {
      failTask(taskId);
      alert(`Gagal mengunduh: ${error.message}`);
    }
  }, [addTask, updateTask, finishTask, failTask]);

  /* =========================
     UPLOAD MODAL
  ========================= */
  const handleOpenUpload = useCallback(() => {
    openModal("upload");
  }, [openModal]);

  return {
    handleItemClick,
    handleDelete,
    handleCreateFolder,
    handleRename,
    handleOpenUpload,
    handleDownload,
  };
}
