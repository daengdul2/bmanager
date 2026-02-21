"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { FileItem } from "@/types/file";

export type ModalType = "preview" | "upload" | "confirm" | "rename" | "createFolder" | null;

export type ModalProps =
  | { type: "preview"; file: FileItem }
  | { type: "upload" }
  | { type: "confirm"; title: string; description: string; onConfirm: () => void }
  | { type: "rename"; oldPath: string; oldName: string; onRename: (newName: string) => void }
  | { type: "createFolder"; currentPath: string; onCreate: (name: string) => void }
  | null;

interface ModalState {
  type: ModalType;
  props?: ModalProps;
}

interface ModalManagerContextType {
  modal: ModalState;
  openModal: (type: "upload") => void;
  openPreview: (file: FileItem) => void;
  openConfirm: (title: string, description: string, onConfirm: () => void) => void;
  openRename: (oldPath: string, oldName: string, onRename: (newName: string) => void) => void;
  openCreateFolder: (currentPath: string, onCreate: (name: string) => void) => void;
  closeModal: () => void;
  updateModal: (props: Partial<ModalProps & { file: FileItem }>) => void;
}

const ModalManagerContext = createContext<ModalManagerContextType | null>(null);

export function ModalManagerProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null });

  const openModal = useCallback((type: "upload") => {
    setModal({ type, props: { type } });
  }, []);

  const openPreview = useCallback((file: FileItem) => {
    setModal({ type: "preview", props: { type: "preview", file } });
  }, []);

  const openConfirm = useCallback(
    (title: string, description: string, onConfirm: () => void) => {
      setModal({ type: "confirm", props: { type: "confirm", title, description, onConfirm } });
    }, []
  );

  const openRename = useCallback(
    (oldPath: string, oldName: string, onRename: (newName: string) => void) => {
      setModal({ type: "rename", props: { type: "rename", oldPath, oldName, onRename } });
    }, []
  );

  const openCreateFolder = useCallback(
    (currentPath: string, onCreate: (name: string) => void) => {
      setModal({ type: "createFolder", props: { type: "createFolder", currentPath, onCreate } });
    }, []
  );

  const closeModal = useCallback(() => {
    setModal({ type: null, props: undefined });
  }, []);

  const updateModal = useCallback(
    (newProps: Partial<ModalProps & { file: FileItem }>) => {
      setModal((prev) => ({
        ...prev,
        props: { ...(prev.props ?? {}), ...newProps } as ModalProps,
      }));
    }, []
  );

  const value = useMemo(
    () => ({ modal, openModal, openPreview, openConfirm, openRename, openCreateFolder, closeModal, updateModal }),
    [modal, openModal, openPreview, openConfirm, openRename, openCreateFolder, closeModal, updateModal]
  );

  return (
    <ModalManagerContext.Provider value={value}>
      {children}
    </ModalManagerContext.Provider>
  );
}

export function useModalManager() {
  const ctx = useContext(ModalManagerContext);
  if (!ctx) throw new Error("useModalManager must be inside ModalManagerProvider");
  return ctx;
}