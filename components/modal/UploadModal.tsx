"use client";

import { useUploadManager } from "@/hooks/useUploadManager";
import { useModalManager } from "@/context/ModalManagerContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export default function UploadModal() {
  const { closeModal } = useModalManager();

  const {
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
  } = useUploadManager();

  useLockBodyScroll(true);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white w-[95%] max-w-md p-6 rounded-2xl shadow-2xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-sm font-semibold">Upload Files</h2>
          <button
            onClick={closeModal}
            className="text-xs text-gray-400"
          >
            Close
          </button>
        </div>

        <label className="block text-xs mb-3 cursor-pointer text-blue-400">
          + Tambah File
          <input
            type="file"
            multiple
            hidden
            onChange={(e) => {
              if (!e.target.files) return;
              addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
        </label>

        <div className="text-xs mb-2">
          {queue.length} file • {formatBytes(uploadedSize)} / {formatBytes(totalSize)}
        </div>

        <div className="w-full bg-gray-700 h-2 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        <div className="text-right text-xs mb-3">
          {totalProgress}%
        </div>

        <div className="space-y-1 max-h-40 overflow-auto text-xs mb-4">
          {queue.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="truncate w-2/3">
                {item.file.name}
              </span>
              <span>{item.progress}%</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs">
          {!uploading && (
            <button onClick={startUpload} className="text-green-400">
              Start
            </button>
          )}

          {uploading && (
            <button onClick={cancelUpload} className="text-red-400">
              Cancel
            </button>
          )}

          {!uploading && (
            <button onClick={clearQueue} className="text-gray-400">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}