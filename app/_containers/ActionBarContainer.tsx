"use client";

import { useFileManager } from "@/context/FileManagerContext";
import { useFileActionsContext } from "@/context/FileActionsContext";
import ActionBar from "@/components/footer/ActionBar";

export default function ActionBarContainer() {
  const { selectedFiles, clearSelection } = useFileManager();
  const { handleDelete, handleRename, handleDownload } = useFileActionsContext();

  return (
    <ActionBar
      selectedCount={selectedFiles.size}
      selectedFiles={selectedFiles}
      onClear={clearSelection}
      onDelete={handleDelete}
      onRename={handleRename}
      onDownload={handleDownload}
      onMove={() => {}} // TODO: implement move
    />
  );
}
