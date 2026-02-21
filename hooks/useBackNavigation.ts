"use client";

import { useEffect, useRef } from "react";
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
  const { modal, closeModal } = useModalManager();

  const selectedRef = useRef(selectedFiles);
  const modalTypeRef = useRef(modal.type);
  const pathRef = useRef(path);
  const isPoppingRef = useRef(false);
  const prevSelectedCountRef = useRef(selectedFiles.size);
  const prevModalTypeRef = useRef(modal.type);

  useEffect(() => { selectedRef.current = selectedFiles; }, [selectedFiles]);
  useEffect(() => { modalTypeRef.current = modal.type; }, [modal.type]);
  useEffect(() => { pathRef.current = path; }, [path]);

  /* Sync URL & History */
  useEffect(() => {
    if (isPoppingRef.current) return;

    const q = new URLSearchParams();
    if (path) q.set("path", path);
    if (modal.type) q.set("modal", modal.type);
    if (selectedFiles.size > 0) q.set("select", "true");

    const queryString = q.toString();
    const newUrl = queryString ? `?${queryString}` : "/";

    const currentSearch = new URLSearchParams(window.location.search);
    const currentPath = currentSearch.get("path") ?? "";
    const currentModal = currentSearch.get("modal") ?? "";

    const shouldPush =
      // Folder berpindah
      path !== currentPath ||
      // Modal baru dibuka atau ditutup
      (!!modal.type && modal.type !== currentModal) ||
      (!modal.type && !!currentModal) ||
      // Seleksi baru muncul (dari 0 ke >0)
      (selectedFiles.size > 0 && prevSelectedCountRef.current === 0) ||
      // Seleksi dihapus (dari >0 ke 0)
      (selectedFiles.size === 0 && prevSelectedCountRef.current > 0);

    prevSelectedCountRef.current = selectedFiles.size;
    prevModalTypeRef.current = modal.type;

    if (shouldPush) {
      window.history.pushState(null, "", newUrl);
    } else {
      window.history.replaceState(null, "", newUrl);
    }
  }, [path, modal.type, selectedFiles.size]);

  /* Handle Back Button (PopState) */
  useEffect(() => {
    const handlePopState = () => {
      isPoppingRef.current = true;

      if (modalTypeRef.current) {
        closeModal();
      } else if (selectedRef.current.size > 0) {
        clearSelection();
      } else if (pathRef.current !== "") {
        const parts = pathRef.current.split("/");
        parts.pop();
        setPath(parts.join("/"));
      }

      setTimeout(() => {
        isPoppingRef.current = false;
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeModal, clearSelection, setPath]);
}