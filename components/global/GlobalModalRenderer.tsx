"use client";

import { useModalManager } from "@/context/ModalManagerContext";
import BaseModal from "@/components/modal/BaseModal";
import FilePreview from "@/components/modal/FilePreview";
import UploadModal from "@/components/modal/UploadModal";
import ConfirmModal from "@/components/modal/ConfirmModal";
import RenameModal from "@/components/modal/RenameModal";
import CreateFolderModal from "@/components/modal/CreateFolderModal";


export default function GlobalModalRenderer() {
  const { modal } = useModalManager();

  if (!modal.type) return null;


  return (
    <BaseModal>
      {modal.type === "preview" &&
        modal.props &&
        "file" in modal.props &&
        modal.props.file && (
          <FilePreview file={modal.props.file} />
        )}

      {modal.type === "upload" && <UploadModal />}
      {modal.type === "confirm" && <ConfirmModal />}
      {modal.type === "rename" && <RenameModal />}
      {modal.type === "createFolder" && <CreateFolderModal />}
    </BaseModal>
  );
}