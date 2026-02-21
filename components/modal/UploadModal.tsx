"use client";

import { X, CheckCircle2, XCircle, SkipForward, Loader2 } from "lucide-react";
import { useUploadManager } from "@/hooks/useUploadManager";
import { useModalManager } from "@/context/ModalManagerContext";
import Button from "@/components/ui/Button";
import type { QueueStatus } from "@/hooks/useUploadManager";

// Fix #3: status icon per file
function StatusIcon({ status }: { status: QueueStatus }) {
  if (status === "done") return <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />;
  if (status === "error") return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
  if (status === "skipped") return <SkipForward className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
  if (status === "uploading") return <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />;
  return <span className="w-3.5 h-3.5 shrink-0" />;
}

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

  const hasQueue = queue.length > 0;
  const isDone = hasQueue && queue.every(i => i.status === "done" || i.status === "skipped" || i.status === "error");

  return (
    <div className="w-full h-full z-50 flex items-end justify-center sm:items-center">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between mb-4">
          <h2 className="text-sm font-semibold">Upload Files</h2>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="block text-xs mb-3 cursor-pointer bg-slate-800 text-slate-300 text-center py-3 rounded-md hover:bg-slate-700 transition-colors">
          + Tambah File
          <input
            type="file"
            multiple
            hidden
            onChange={e => {
              if (!e.target.files) return;
              addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
        </label>

        {/* Fix #2: sembunyikan progress jika queue kosong */}
        {hasQueue && (
          <>
            <div className="text-xs mb-2 text-slate-400">
              {queue.length} file • {formatBytes(uploadedSize)} / {formatBytes(totalSize)}
            </div>

            <div className="w-full bg-gray-700 h-2 rounded overflow-hidden mb-1">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <div className="text-right text-xs mb-3 text-slate-400">{totalProgress}%</div>

            {/* Fix #1 & #3: key pakai nama file + status icon per item */}
            <div className="space-y-1.5 max-h-40 overflow-auto text-xs mb-4">
              {queue.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <StatusIcon status={item.status} />
                  <span className="truncate flex-1 text-slate-300">{item.file.name}</span>
                  {item.status === "skipped" && item.reason ? (
                    <span className="text-yellow-400 shrink-0">{item.reason}</span>
                  ) : (
                    <span className="text-slate-400 shrink-0">{item.progress}%</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between text-xs gap-3">
          {!uploading && (
            <Button variant="outline"
            onClick={isDone ? closeModal : clearQueue} className="flex-1">
              {isDone ? "Tutup" : "Bersihkan"}
            </Button>
          )}
          {uploading && (
            <Button variant="danger" onClick={cancelUpload} className="flex-1">
              Batalkan
            </Button>
          )}
          {/* Fix #4: disabled jika queue kosong atau sudah selesai */}
          {!uploading && !isDone && (
            <Button
              variant="confirm"
              onClick={startUpload}
              disabled={!hasQueue}
              className="flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mulai
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}