"use client";

import { useModalManager } from "@/context/ModalManagerContext";
import BaseModal from "@/components/modal/BaseModal";
import FilePreview from "@/components/modal/FilePreview";
import UploadModal from "@/components/modal/UploadModal";


export default function GlobalModalRenderer() {
  const { modal } = useModalManager();

  if (!modal.type) return null;

  return (
    <BaseModal>
      {modal.type === "preview" && (
        <FilePreview file={modal.props?.file} />
      )}
      {modal.type === "upload" && (
  <UploadModal open {...modal.props} />
)}
    </BaseModal>
  );
}