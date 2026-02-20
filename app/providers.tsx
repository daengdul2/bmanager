import { TaskManagerProvider } from "@/context/TaskManagerContext";
import { FileManagerProvider } from "@/context/FileManagerContext";
import { ModalManagerProvider } from "@/context/ModalManagerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TaskManagerProvider>
      <FileManagerProvider>
        <ModalManagerProvider>
        {children}
        </ModalManagerProvider>
      </FileManagerProvider>
    </TaskManagerProvider>
  );
}