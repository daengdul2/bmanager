"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext";
import { useModalManager } from "@/context/ModalManagerContext";
import { isMediaType } from "@/lib/fileTypes";
import type { FileItem } from "@/types/file";

import MusicPlayer from "./MusicPlayer";
import ImagePreview from "./ImagePreview";
import VideoPlayer from "./VideoPlayer";
import TextPreview from "./TextPreview";
import NoPreviewModal from "./NoPreviewModal";
import Button from "@/components/ui/Button";

interface Props {
    file: FileItem;
}

export default function FilePreview({ file }: Props) {
    const { fileList } = useFileManager();
    const { closeModal, updateModal } = useModalManager();
    const { toggleUi, uiVisible } = useFileManager();

    const previewType = file.previewType ?? "binary";
    const isMedia = isMediaType(previewType);

    const sameTypeFiles = isMedia
        ? fileList.filter(f => f.previewType === previewType)
        : [];

    const index = sameTypeFiles.findIndex(f => f.path === file.path);
    const prevFile = index > 0 ? sameTypeFiles[index - 1] : null;
    const nextFile =
        index !== -1 && index < sameTypeFiles.length - 1
            ? sameTypeFiles[index + 1]
            : null;

    const goPrev = () => {
        if (prevFile) updateModal({ file: prevFile });
    };

    const goNext = () => {
        if (nextFile) updateModal({ file: nextFile });
    };

    const src = `/api/preview?file=${encodeURIComponent(file.path)}`;

    function renderPreview() {
        if (previewType === "image")
            return <ImagePreview src={src} filename={file.name} />;

        if (previewType === "video")
            return <VideoPlayer src={src} filename={file.name} />;

        if (previewType === "audio")
            // MusicPlayer mengambil file dari ModalManagerContext langsung
            return <MusicPlayer autoPlay />;

        if (previewType === "text")
            return <TextPreview src={src} filename={file.name} />;

        return <NoPreviewModal filePath={file.path} />;
    }

    return (
        <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={toggleUi}
        >
            {renderPreview()}
            {uiVisible && (
                <div className="flex">
                    <span className="absolute top-5 left-5 text-sm py-2 truncate w-80">{file.name}</span>
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={e => {
                            e.stopPropagation();
                            closeModal();
                        }}
                        className="absolute top-5 right-5"
                    >
                        <X />
                    </Button>
                </div>
            )}

            {prevFile && uiVisible && (
                <Button
                    variant="ghost"
                    size="large"
                    onClick={e => {
                        e.stopPropagation();
                        goPrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                    <ChevronLeft />
                </Button>
            )}

            {nextFile && uiVisible && (
                <Button
                    variant="ghost"
                    size="large"
                    onClick={e => {
                        e.stopPropagation();
                        goNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                    <ChevronRight />
                </Button>
            )}
        </div>
    );
}
