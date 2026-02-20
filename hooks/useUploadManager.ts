"use client";

import { useState, useRef } from "react";
import { useFileManager } from "@/context/FileManagerContext";
import { useTaskManager } from "@/context/TaskManagerContext";

interface QueueItem {
  file: File;
  progress: number;
  uploaded: number;
}

export function useUploadManager() {
  const { path, refreshFiles } = useFileManager();
  const { addTask, updateTask, finishTask, failTask } = useTaskManager();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const cancelRef = useRef(false);
  const taskIdRef = useRef<string | null>(null);

  /* ==============================
     Add Files
  ============================== */
  const addFiles = (files: File[]) => {
    const newItems = files.map(file => ({
      file,
      progress: 0,
      uploaded: 0,
    }));

    const newTotal =
      totalSize + files.reduce((sum, f) => sum + f.size, 0);

    setQueue(prev => [...prev, ...newItems]);
    setTotalSize(newTotal);
  };

  /* ==============================
     Start Upload (Sequential Stable)
  ============================== */
  const startUpload = async () => {
    if (queue.length === 0) return;

    cancelRef.current = false;
    setUploading(true);

    // 🔹 Create global task
    const id = addTask({
      type: "upload",
      label: `Uploading ${queue.length} file`,
    });

    taskIdRef.current = id;

    let globalUploaded = 0;

    try {
      for (let i = 0; i < queue.length; i++) {
        if (cancelRef.current) break;

        await uploadSingle(i, globalUploaded);
        globalUploaded += queue[i].file.size;
      }

      if (!cancelRef.current) {
        finishTask(id);
      } else {
        failTask(id);
      }

    } catch (err) {
      failTask(id);
    }

    setUploading(false);
    refreshFiles();
  };

  /* ==============================
     Upload Single File
  ============================== */
  const uploadSingle = (index: number, baseUploaded: number) => {
    return new Promise<void>((resolve, reject) => {
      const item = queue[index];

      const formData = new FormData();
      formData.append("files", item.file);
      formData.append("path", path);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;

        const percent = Math.round((e.loaded / e.total) * 100);

        const globalLoaded = baseUploaded + e.loaded;
        const globalPercent = Math.round(
          (globalLoaded / totalSize) * 100
        );

        setUploadedSize(globalLoaded);
        setTotalProgress(globalPercent);

        // update per-file
        setQueue(prev => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            progress: percent,
            uploaded: e.loaded,
          };
          return copy;
        });

        // 🔹 update global task progress
        if (taskIdRef.current) {
          updateTask(taskIdRef.current, globalPercent);
        }
      };

      xhr.onload = () => resolve();
      xhr.onerror = () => reject();

      xhr.send(formData);
    });
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

  /* ==============================
     Format Bytes
  ============================== */
  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      (bytes / Math.pow(k, i)).toFixed(2) +
      " " +
      sizes[i]
    );
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