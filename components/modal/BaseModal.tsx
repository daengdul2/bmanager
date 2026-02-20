"use client";

import { ReactNode, useEffect } from "react";
import { useModalManager } from "@/context/ModalManagerContext";

interface Props {
  children: ReactNode;
}

export default function BaseModal({ children }: Props) {
  const { closeModal } = useModalManager();

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handler);
    return () =>
      window.removeEventListener("keydown", handler);
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={closeModal}
    >
      <div
        className="relative w-full h-full"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}