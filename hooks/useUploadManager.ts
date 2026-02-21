"use client";

import { useState, useRef } from "react";
import { useFileManager } from "@/context/FileManagerContext";
import { useTaskManager } from "@/context/TaskManagerContext";
import { formatBytes } from "@/lib/formatBytes";
import { useModalManager } from "@/context/ModalManagerContext";

export type QueueStatus = "idle" | "uploading" | "done" | "error" | "skipped" | "cancelled";

export interface QueueItem {
  id: string; // ← tambah ini
  file: File;
  progress: number;
  uploaded: number;
  status: QueueStatus;
  reason?: string; // untuk skipped: alasan kenapa dilewati
}

export function useUploadManager() {
  const { path, refreshFiles } = useFileManager();
  const { addTask, updateTask, finishTask, failTask } = useTaskManager();
  const { closeModal } = useModalManager();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const cancelRef = useRef(false);
  const taskIdRef = useRef<string | null>(null);

  const totalSizeRef = useRef(0);
  const [totalSize, _setTotalSize] = useState(0);
  const setTotalSize = (val: number) => {
    totalSizeRef.current = val;
    _setTotalSize(val);
  };

  /* ==============================
     Add Files
  ============================== */
  const addFiles = (files: File[]) => {
    const added = files.reduce((sum, f) => sum + f.size, 0);
    setQueue(prev => [
      ...prev,
      ...files.map(file => ({
        id: crypto.randomUUID(),
        file, 
        progress: 0,
        uploaded: 0,
        status: "idle" as QueueStatus }))
    ]);
    setTotalSize(totalSizeRef.current + added);
  };

  /* ==============================
     Upload Single File
  ============================== */
  const uploadSingle = (item: QueueItem, index: number, baseUploaded: number) => {
    return new Promise<{ skipped?: { name: string; reason: string }[] }>((resolve, reject) => {
      const formData = new FormData();
      formData.append("files", item.file);
      formData.append("path", path);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open("POST", "/api/upload");

      // Update status jadi uploading
      setQueue(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], status: "uploading" };
        return copy;
      });

      xhr.upload.onprogress = e => {
        if (!e.lengthComputable) return;
        const percent = Math.round((e.loaded / e.total) * 100);
        const globalLoaded = baseUploaded + e.loaded;
        const globalPercent = Math.round((globalLoaded / totalSizeRef.current) * 100);

        setUploadedSize(globalLoaded);
        setTotalProgress(globalPercent);

        setQueue(prev => {
          const copy = [...prev];
          copy[index] = { ...copy[index], progress: percent, uploaded: e.loaded };
          return copy;
        });

        if (taskIdRef.current) updateTask(taskIdRef.current, globalPercent);
      };

      xhr.onload = () => {
        // Fix #1: cek HTTP status, bukan hanya onload
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setQueue(prev => {
              const copy = [...prev];
              copy[index] = { ...copy[index], progress: 100, status: "done" };
              return copy;
            });
            resolve({ skipped: data.skipped });
          } catch {
            resolve({});
          }
        } else {
          setQueue(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], status: "error" };
            return copy;
          });
          reject(new Error(`Upload gagal: server return ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setQueue(prev => {
          const copy = [...prev];
          copy[index] = { ...copy[index], status: "error" };
          return copy;
        });
        reject(new Error("Upload gagal: network error"));
      };

      xhr.onabort = () => {
        setQueue(prev => {
          const copy = [...prev];
          copy[index] = { ...copy[index], status: "cancelled" };
          return copy;
        });
        reject(new Error("cancelled"));
      };

      xhr.send(formData);
    });
  };

  /* ==============================
     Start Upload (Sequential)
  ============================== */
  const startUpload = async () => {
    if (queue.length === 0) return;

    cancelRef.current = false;
    setUploading(true);

    const id = addTask({
      id: crypto.randomUUID(),
      type: "upload",
      label: `Mengupload ${queue.length} file`,
    });
    taskIdRef.current = id;

    let globalUploaded = 0;
    let hasError = false;
    const allSkipped: { name: string; reason: string }[] = [];

    try {
      for (let i = 0; i < queue.length; i++) {
        if (cancelRef.current) break;
        try {
          const result = await uploadSingle(queue[i], i, globalUploaded);
          // Fix #4: kumpulkan file yang di-skip
          if (result.skipped?.length) {
            allSkipped.push(...result.skipped);
            // Tandai file skipped di queue
            setQueue(prev => {
              const copy = [...prev];
              const skippedNames = result.skipped!.map(s => s.name);
              if (skippedNames.includes(copy[i].file.name)) {
                copy[i] = {
                  ...copy[i],
                  status: "skipped",
                  reason: result.skipped!.find(s => s.name === copy[i].file.name)?.reason,
                };
              }
              return copy;
            });
          }
          globalUploaded += queue[i].file.size;
        } catch (err: any) {
          if (err.message === "cancelled") break;
          hasError = true;
          // Lanjut ke file berikutnya meski ada error
        }
      }

      if (!cancelRef.current) {
        if (hasError) {
          failTask(id);
          // Fix #2: jangan closeModal saat error, biarkan user lihat status
        } else {
          finishTask(id);
          // Fix #2: hanya closeModal jika semua sukses dan tidak ada yang skip
          if (allSkipped.length === 0) closeModal();
        }
        // Fix #3: refreshFiles hanya jika tidak di-cancel
        refreshFiles();
      } else {
        failTask(id);
      }
    } catch {
      failTask(id);
    }

    setUploading(false);
    // Fix #5: reset taskIdRef
    taskIdRef.current = null;
  };

  /* ==============================
     Cancel
  ============================== */
  const cancelUpload = () => {
    cancelRef.current = true;
    xhrRef.current?.abort();
    setUploading(false);
    if (taskIdRef.current) {
      failTask(taskIdRef.current);
      taskIdRef.current = null;
    }
  };

  /* ==============================
     Clear Queue
  ============================== */
  const clearQueue = () => {
    if (uploading) return;
    setQueue([]);
    setTotalSize(0);
    setUploadedSize(0);
    setTotalProgress(0);
  };

  return {
    queue,
    uploading,
    totalSize,
    uploadedSize,
    totalProgress,
    addFiles,
    startUpload,
    cancelUpload,
    clearQueue,
    formatBytes,
  };
}