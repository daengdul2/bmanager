"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

type ModalType = "preview" | "upload" | null;

interface ModalState {
  type: ModalType;
  props?: any;
}

interface ModalManagerContextType {
  modal: ModalState;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
  updateModal: (props: any) => void;
}

const ModalManagerContext = createContext<ModalManagerContextType | null>(null);

export function ModalManagerProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null });

  const openModal = useCallback((type: ModalType, props?: any) => {
    setModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, props: undefined }); // Membersihkan props saat tutup
  }, []);

  const updateModal = useCallback((props: any) => {
    setModal((prev) => ({
      ...prev,
      props: { ...prev.props, ...props }, // Merge props lama dengan yang baru
    }));
  }, []);

  // Membungkus value dalam useMemo agar object context tidak berubah-ubah
  const value = useMemo(
    () => ({ modal, openModal, closeModal, updateModal }),
    [modal, openModal, closeModal, updateModal]
  );

  return (
    <ModalManagerContext.Provider value={value}>
      {children}
    </ModalManagerContext.Provider>
  );
}

export function useModalManager() {
  const ctx = useContext(ModalManagerContext);
  if (!ctx) {
    throw new Error("useModalManager must be used inside ModalManagerProvider");
  }
  return ctx;
}
