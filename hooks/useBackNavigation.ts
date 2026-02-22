"use client";

import { useEffect, useRef } from "react";
import { useModalManager } from "@/context/ModalManagerContext";
import { ROOT } from "@/lib/config";

type Params = {
  selectedFiles: Set<string>;
  clearSelection: () => void;
  path: string;
  setPath: (path: string) => void;
};

// Helper: path absolut → relatif untuk URL
function toRelative(absolutePath: string): string {
  if (absolutePath === ROOT) return "";
  return absolutePath.startsWith(ROOT + "/")
    ? absolutePath.slice(ROOT.length + 1)
    : "";
}

// Helper: path relatif dari URL → path absolut untuk state
function toAbsolute(relativePath: string): string {
  return relativePath ? `${ROOT}/${relativePath}` : ROOT;
}

export function useBackNavigation({
  selectedFiles,
  clearSelection,
  path,
  setPath,
}: Params) {
  const { modal, closeModal } = useModalManager();

  // Refs untuk hindari closure trap di event listener
  const selectedRef = useRef(selectedFiles);
  const modalTypeRef = useRef(modal.type);
  const pathRef = useRef(path);
  const isPoppingRef = useRef(false);

  // Refs untuk deteksi perubahan di effect URL sync
  const prevSelectedCountRef = useRef(selectedFiles.size);
  const prevModalRef = useRef(modal.type);

  useEffect(() => { selectedRef.current = selectedFiles; }, [selectedFiles]);
  useEffect(() => { modalTypeRef.current = modal.type; }, [modal.type]);
  useEffect(() => { pathRef.current = path; }, [path]);

  /* ================================
     Sync State → URL & History
  ================================ */
  useEffect(() => {
    if (isPoppingRef.current) return;

    const q = new URLSearchParams();

    // Fix #1: simpan path relatif di URL, bukan absolut
    const relativePath = toRelative(path);
    if (relativePath) q.set("path", relativePath);
    if (modal.type) q.set("modal", modal.type);
    if (selectedFiles.size > 0) q.set("select", "true");

    const newUrl = q.toString() ? `?${q.toString()}` : "/";

    // Fix #2: bandingkan relatif vs relatif — bukan absolut vs relatif
    const currentSearch = new URLSearchParams(window.location.search);
    const currentRelative = currentSearch.get("path") ?? "";
    const currentModal = currentSearch.get("modal") ?? "";

    const shouldPush =
      // Folder berpindah
      relativePath !== currentRelative ||
      // Modal baru dibuka atau ditutup
      (!!modal.type && modal.type !== currentModal) ||
      (!modal.type && !!currentModal) ||
      // Seleksi muncul pertama kali
      (selectedFiles.size > 0 && prevSelectedCountRef.current === 0) ||
      // Seleksi dihapus
      (selectedFiles.size === 0 && prevSelectedCountRef.current > 0);

    // Update prev refs
    prevSelectedCountRef.current = selectedFiles.size;
    prevModalRef.current = modal.type;

    if (shouldPush) {
      window.history.pushState(null, "", newUrl);
    } else {
      window.history.replaceState(null, "", newUrl);
    }
  }, [path, modal.type, selectedFiles.size]);

  /* ================================
     Handle Back Button (PopState)
  ================================ */
  useEffect(() => {
    const handlePopState = () => {
      isPoppingRef.current = true;

      if (modalTypeRef.current) {
        closeModal();
      } else if (selectedRef.current.size > 0) {
        clearSelection();
      } else if (pathRef.current !== ROOT) {
        // Fix #3 & #4: naik satu level, tidak boleh melewati ROOT
        const parentParts = pathRef.current.split("/");
        parentParts.pop();
        const parent = parentParts.join("/");
        setPath(parent.startsWith(ROOT) ? parent : ROOT);
      }

      setTimeout(() => {
        isPoppingRef.current = false;
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeModal, clearSelection, setPath]);
}