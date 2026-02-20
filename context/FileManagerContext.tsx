"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import { useFileManagerState } from "@/hooks/useFileManagerState";

type FileManagerContextType =
  ReturnType<typeof useFileManagerState> & {
    uiVisible: boolean;
    toggleUi: () => void;
    setUiVisible: (v: boolean) => void;
  };

const FileManagerContext =
  createContext<FileManagerContextType | null>(null);

export function FileManagerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const state = useFileManagerState();
  const [uiVisible, setUiVisible] = useState(true);

  const toggleUi = () => setUiVisible(prev => !prev);
const [refreshKey, setRefreshKey] = useState(0);

const refreshFiles = () => {
  setRefreshKey(prev => prev + 1);
};
  return (
    <FileManagerContext.Provider
      value={{
        ...state,
        uiVisible,
        toggleUi,
        setUiVisible,
        refreshKey,
refreshFiles,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManager() {
  const ctx = useContext(FileManagerContext);
  if (!ctx)
    throw new Error(
      "useFileManager must be used within FileManagerProvider"
    );
  return ctx;
}