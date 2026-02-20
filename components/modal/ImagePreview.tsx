"use client";

import { useState } from "react";
import { Maximize, Minimize } from "lucide-react"; // ikon toggle fullscreen
import { useFileManager } from "@/context/FileManagerContext";
type Props = {
  src: string;
  filename?: string;
};

export default function ImagePreview({ src, filename }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { uiVisible } =
    useFileManager();

  return (
    <div className="inset-0">
    <div
      className={
        isFullscreen
          ? "fixed inset-0 bg-black flex flex-col items-center justify-center"
          : "relative"
      }
    >

      {/* Gambar */}
      <img
        src={src}
        draggable={false}
        alt={filename ?? "image"}
        className={
          isFullscreen
            ? "w-full h-full object-contain select-none"
            : "max-h-[70vh] mx-auto rounded"
        }
      />
    </div>
          {/* Tombol toggle fullscreen */}
          {uiVisible && (
      <button
        onClick={(e) => {setIsFullscreen(!isFullscreen);
          e.stopPropagation();
        }}
        className="absolute bottom-4 right-4 bg-black/60 text-white rounded-full p-2 z-50"
      >
        {isFullscreen ? <Minimize /> : <Maximize />}
      </button>
      )}
    </div>
  );
}