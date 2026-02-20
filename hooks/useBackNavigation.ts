"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useModalManager } from "@/context/ModalManagerContext";

type Params = {
  selectedFiles: Set<string>;
  clearSelection: () => void;
  path: string;
  setPath: (path: string) => void;
};

export function useBackNavigation({
  selectedFiles,
  clearSelection,
  path,
  setPath,
}: Params) {
  const router = useRouter();
  // Ambil 'modal' dan 'closeModal' sesuai struktur Context yang kamu buat
  const { modal, closeModal } = useModalManager();

  // Refs untuk menghindari closure trap pada event listener
  const selectedRef = useRef(selectedFiles);
  const modalTypeRef = useRef(modal.type);
  const pathRef = useRef(path);

  useEffect(() => {
    selectedRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    modalTypeRef.current = modal.type;
  }, [modal.type]);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  /* =========================
     Helper: Build URL Query
  ========================== */
  const buildQuery = (params: {
    path: string;
    modalType: string | null;
    hasSelection: boolean;
  }) => {
    const q = new URLSearchParams();
    
    if (params.path) q.set("path", params.path);
    if (params.modalType) q.set("modal", params.modalType);
    if (params.hasSelection) q.set("select", "true");

    return `?${q.toString()}`;
  };

  /* =========================
     Sync URL & History Push
  ========================== */
  useEffect(() => {
    const query = buildQuery({
      path,
      modalType: modal.type,
      hasSelection: selectedFiles.size > 0,
    });

    // Gunakan push agar tombol 'Back' browser memiliki history untuk mundur
    // Jika hanya ingin sync tanpa nambah history, gunakan replace
    window.history.pushState(null, "", query);
  }, [path, modal.type, selectedFiles.size]);

  /* =========================
     Handle Back Button (PopState)
  ========================== */
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 1. Jika ada modal yang terbuka, tutup modal dulu
      if (modalTypeRef.current) {
        closeModal();
        return;
      }

      // 2. Jika ada file terpilih, batalkan pilihan
      if (selectedRef.current.size > 0) {
        clearSelection();
        return;
      }

      // 3. Jika di dalam subfolder, naik ke folder atas
      if (pathRef.current !== "") {
        const parts = pathRef.current.split("/").filter(Boolean);
        parts.pop();
        setPath(parts.join("/"));
        return;
      }
      
      // Jika semua kondisi di atas kosong, biarkan browser back ke halaman sebelumnya
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeModal, clearSelection, setPath]);
}
