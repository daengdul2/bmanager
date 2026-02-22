"use client";

import { useFileManager } from "@/context/FileManagerContext";
import { useModalManager } from "@/context/ModalManagerContext";
import { useFileActionsContext } from "@/context/FileActionsContext";
import { useUploadManager } from "@/hooks/useUploadManager";
import ToolBar from "@/components/footer/ToolBar";

export default function ToolBarContainer() {
  const {
    selectedFiles
  } = useFileManager();
  const { openModal } = useModalManager();
  const { uploading } = useUploadManager();
  const { handleCreateFolder, handleOpenUpload } = useFileActionsContext();
  const selectedCount = selectedFiles.size;

  return (
    <ToolBar
      onUploadClick={handleOpenUpload}
      onCreateFolder={handleCreateFolder}
      disabled={uploading}
      selectedCount={selectedCount}
    />
  );
}