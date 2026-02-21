"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useFileManager } from "@/context/FileManagerContext";
import { useModalManager } from "@/context/ModalManagerContext";
import type { FileItem } from "@/types/file";

export function useMusicPlayer(autoPlay: boolean) {
  const { fileList } = useFileManager();
  const { modal, openPreview } = useModalManager();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Playlist: hanya file audio dari fileList
  const playlist = useMemo(
    () => fileList.filter((f) => f.previewType === "audio"),
    [fileList]
  );

  // Ambil currentFile hanya jika modal sedang preview file audio
  const currentFile: FileItem | null =
    modal.type === "preview" &&
    modal.props &&
    "file" in modal.props &&
    modal.props.file.previewType === "audio"
      ? modal.props.file
      : null;

  const currentIndex = useMemo(
    () =>
      currentFile
        ? playlist.findIndex((f) => f.path === currentFile.path)
        : -1,
    [playlist, currentFile]
  );

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const currentTrack = playlist[currentIndex] ?? null;

  // Ganti track via openPreview
  const changeTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.length) {
        openPreview(playlist[index]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    },
    [playlist, openPreview]
  );

  // Play/Pause
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

  // Auto play saat track berubah
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying]);

  // Reset posisi saat track berubah
  useEffect(() => {
    if (!audioRef.current) return;
    setCurrentTime(0);
    setDuration(0);
    audioRef.current.currentTime = 0;
  }, [currentTrack?.path]);

  // Sync volume ke elemen audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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