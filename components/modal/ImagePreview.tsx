"use client";

import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext";
import Button from "@/components/ui/Button";

type Props = {
  src: string;
  filename?: string;
};

export default function ImagePreview({ src, filename }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { uiVisible } = useFileManager();

  return (
    <div className="relative inset-0">
      <div
        className={
          isFullscreen
            ? "fixed inset-0 bg-black flex flex-col items-center justify-center"
            : "relative"
        }
      >
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

      {uiVisible && (
        <Button variant="ghost" size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(!isFullscreen);
          }}
          className="fixed bottom-4 right-4 z-50"
        >
          {isFullscreen ? <Minimize /> : <Maximize />}
        </Button>
      )}
    </div>
  );
}