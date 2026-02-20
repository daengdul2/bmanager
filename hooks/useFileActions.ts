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
        toggleSelect
    } = useFileManager();

    const { addTask, updateTask, finishTask, failTask } = useTaskManager();
    
    // Gunakan openModal dari ModalManagerContext
    const { openModal } = useModalManager();

    /* =========================
       HANDLE CLICK
    ========================== */
    const handleItemClick = useCallback(
        (file: FileItem) => {
            const fullPath = file.path || joinPath(path, file.name);

            // Jika sedang dalam mode seleksi (ada file yang terpilih)
            if (selectedFiles.size > 0) {
                toggleSelect(fullPath);
                return;
            }

            if (file.type === "folder") {
                setPath(fullPath);
            } else {
                // Pastikan props yang dikirim sesuai dengan yang diharapkan FileListView
                // Kita mengirim 'file' sebagai props agar bisa diakses via modal.props
                openModal("preview", file);
            }
        },
        [path, selectedFiles, setPath, toggleSelect, openModal]
    );

    /* =========================
       CREATE FOLDER
    ========================== */
    const handleCreateFolder = async () => {
        // Tips: Ke depannya kamu bisa ganti prompt() dengan openModal("create-folder")
        const name = prompt("Nama folder baru:");
        if (!name) return;

        const taskId = addTask({
            type: "move", // atau buat tipe "create" jika ada
            label: `Membuat folder "${name}"`
        });

        try {
            const res = await fetch("/api/folder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPath: path,
                    name
                })
            });

            if (!res.ok) throw new Error();

            updateTask(taskId, 100);
            finishTask(taskId);
            refreshFiles();
        } catch (error) {
            failTask(taskId);
        }
    };

    /* =========================
       DELETE
    ========================== */
    const handleDelete = async () => {
        if (selectedFiles.size === 0) return;

        // Sama seperti create, ini bisa diganti dengan modal konfirmasi custom
        const confirmDelete = confirm(`Hapus ${selectedFiles.size} item yang dipilih?`);
        if (!confirmDelete) return;

        const taskId = addTask({
            type: "delete",
            label: `Menghapus ${selectedFiles.size} berkas`
        });

        try {
            const res = await fetch("/api/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    files: Array.from(selectedFiles)
                })
            });

            if (!res.ok) throw new Error("Delete failed");

            updateTask(taskId, 100);
            finishTask(taskId);

            clearSelection();
            refreshFiles();
        } catch (error) {
            failTask(taskId);
        }
    };

    // Fungsi rename dsb tetap sama...
    
    return {
        handleItemClick,
        handleDelete,
        handleCreateFolder,
        handleRename: async (oldPath: string, newName: string) => { /* logic */ }
    };
}
