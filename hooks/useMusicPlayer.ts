"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useFileManager } from "@/context/FileManagerContext";
import type { FileItem } from "@/types/file";

export function useMusicPlayer(autoPlay: boolean) {
  const { fileList, currentFile, setCurrentFile } = useFileManager();
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Playlist memoized
  const playlist = useMemo(() => {
    return (fileList ?? []).filter((f) => f.previewType === "audio");
  }, [fileList]);

  // 2. Derive index dari currentFile (Single Source of Truth)
  const currentIndex = useMemo(() => {
    if (!currentFile) return -1;
    return playlist.findIndex((f) => f.path === currentFile.path);
  }, [playlist, currentFile]);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const currentTrack = playlist[currentIndex] ?? null;

  // 3. Helper untuk mengganti lagu
  const changeTrack = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentFile(playlist[index]);
      setIsPlaying(true);
    }else{
      setIsPlaying(false);
    }
  }, [playlist, setCurrentFile]);

  // 4. Play/Pause Logic
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // 5. Effect untuk menghandle perubahan track secara otomatis
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Jika isPlaying true, pastikan audio jalan saat src berubah
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying]);

  const src = currentTrack
    ? `/api/preview?file=${encodeURIComponent(currentTrack.path)}`
    : null;

  return {
    audioRef,
    src,
    playlist,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    togglePlay,
    playNext: () => changeTrack(currentIndex + 1),
    playPrev: () => changeTrack(currentIndex - 1),
    playFromPlaylist: changeTrack,
  };
}
