"use client";

import { useTaskManager } from "@/context/TaskManagerContext";
import { useModalManager } from "@/context/ModalManagerContext";
import Button from "@/components/ui/Button";

interface NoPreviewModalProps {
    filePath: string;
}

export default function NoPreviewModal({ filePath }: NoPreviewModalProps) {
    const { addTask, updateTask, finishTask, failTask } = useTaskManager();
    const { closeModal } = useModalManager();

    const handleDownload = async () => {
        // Tambah task download
        const taskId = addTask({
            id: crypto.randomUUID(),
            type: "download",
            label: `Mengunduh "${filePath}"`
        });

        try {
            const res = await fetch("/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: [filePath] })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.error ?? "Download failed");
            }

            window.location.href = `/api/download?path=${encodeURIComponent(filePath)}`;
            updateTask(taskId, 100);
            finishTask(taskId);
            closeModal();
        } catch (error: any) {
            failTask(taskId);
            closeModal();
            alert(`Gagal mengunduh: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-sm text-black dark:text-slate-300">
                File tidak bisa di pratinjau
            </p>
            <Button
                variant="blue"
                onClick={e => {
                    e.stopPropagation();
                    handleDownload();
                }}
            >
                Download
            </Button>
        </div>
    );
}
