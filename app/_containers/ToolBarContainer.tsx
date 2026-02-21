"use client";

import { useModalManager } from "@/context/ModalManagerContext";
import { useUploadManager } from "@/hooks/useUploadManager";
import { useFileActions } from "@/hooks/useFileActions";
import ToolBar from "@/components/footer/ToolBar";

export default function ToolBarContainer() {
  const { openModal } = useModalManager();
  const { uploading } = useUploadManager();
  const { handleCreateFolder } = useFileActions();

  const handleUploadClick = () => openModal("upload");

  return (
    <ToolBar
      onUploadClick={handleUploadClick}
      onCreateFolder={handleCreateFolder}
      disabled={uploading}
    />
  );
}