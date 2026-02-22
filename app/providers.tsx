"use client";

import { TaskManagerProvider } from "@/context/TaskManagerContext";
import { FileManagerProvider } from "@/context/FileManagerContext";
import { ModalManagerProvider } from "@/context/ModalManagerContext";
import { FileActionsProvider } from "@/context/FileActionsContext";
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TaskManagerProvider>
            <FileManagerProvider>
                <ModalManagerProvider>
                    <FileActionsProvider>
                        {children}
                    </FileActionsProvider>
                </ModalManagerProvider>
            </FileManagerProvider>
        </TaskManagerProvider>
    );
}
