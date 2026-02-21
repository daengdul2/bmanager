"use client";

import { Trash2, X } from "lucide-react";
import { useModalManager } from "@/context/ModalManagerContext";
import Button from "@/components/ui/Button";

export default function ConfirmModal() {
  const { modal, closeModal } = useModalManager();

  if (modal.type !== "confirm" || !modal.props) return null;
  if (modal.props.type !== "confirm") return null;

  const { title, description, onConfirm } = modal.props;

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div className=" w-full h-full z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute w-full h-full"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-900 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>

        {/* Content */}
        <h2 className="text-white font-semibold text-lg mb-2">{title}</h2>
        <p className="text-slate-400 text-sm whitespace-pre-line mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">

          <Button
            variant="danger"
            onClick={handleConfirm}
            className="flex-1"
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}