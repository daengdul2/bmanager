"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFileActions } from "@/hooks/useFileActions";

type FileActionsContextType = ReturnType<typeof useFileActions>;

const FileActionsContext = createContext<FileActionsContextType | null>(null);

export function FileActionsProvider({ children }: { children: ReactNode }) {
  // Dipanggil hanya sekali di sini, semua container pakai instance yang sama
  const actions = useFileActions();

  return (
    <FileActionsContext.Provider value={actions}>
      {children}
    </FileActionsContext.Provider>
  );
}

export function useFileActionsContext() {
  const ctx = useContext(FileActionsContext);
  if (!ctx) throw new Error("useFileActionsContext must be inside FileActionsProvider");
  return ctx;
}