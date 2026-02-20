"use client";

import { useMemo } from "react";
import { useFileManager } from "@/context/FileManagerContext";
import { isMediaType } from "@/lib/fileTypes";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function useFilePreview() {
  const {
    currentFile,
    setCurrentFile,
    fileList,
    uiVisible,
    toggleUi,
  } = useFileManager();

  useLockBodyScroll(!!currentFile);

  const previewType = currentFile?.previewType ?? "binary";
  const isMedia = isMediaType(previewType);

  const sameTypeFiles = useMemo(() => {
    if (!currentFile || !isMedia) return [];
    return fileList.filter(f => f.previewType === previewType);
  }, [currentFile, fileList, previewType, isMedia]);

  const index = currentFile
    ? sameTypeFiles.findIndex(f => f.path === currentFile.path)
    : -1;

  const prevFile =
    index > 0 ? sameTypeFiles[index - 1] : null;

  const nextFile =
    index !== -1 && index < sameTypeFiles.length - 1
      ? sameTypeFiles[index + 1]
      : null;

  const goPrev = () => {
    if (prevFile) setCurrentFile(prevFile);
  };

  const goNext = () => {
    if (nextFile) setCurrentFile(nextFile);
  };

  const downloadFile = () => {
    if (!currentFile) return;

    const url = `/api/preview?file=${encodeURIComponent(
      currentFile.path
    )}&download=1`;

    const a = document.createElement("a");
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return {
    currentFile,
    previewType,
    isMedia,
    uiVisible,
    toggleUi,
    prevFile,
    nextFile,
    goPrev,
    goNext,
    downloadFile,
  };
}