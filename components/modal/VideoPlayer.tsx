"use client";

import { useRef, useEffect } from "react";

type Props = {
  src: string;
  filename?: string;
  isFullscreen?: boolean;
};

export default function VideoPlayer({ src, filename, isFullscreen }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Hindari reset posisi scroll / reload aneh saat parent re-render
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load(); // pastikan metadata dimuat ulang saat src berubah
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      draggable={false}
      preload="metadata"
      playsInline
      controlsList="nodownload"
      disablePictureInPicture
      aria-label={filename ?? "video"}
      className={
        isFullscreen
          ? "w-full h-full object-contain"
          : "max-h-[70vh] mx-auto rounded"
      }
      style={{
        backgroundColor: "black",
      }}
    />
  );
}