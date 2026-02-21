"use client";

import { useState, useEffect, useRef } from "react";
import { X, Pencil } from "lucide-react";
import { useModalManager } from "@/context/ModalManagerContext";
import Button from "@/components/ui/Button";

const INVALID_CHARS = /[\/\\:*?"<>|]/;

export default function RenameModal() {
  const { modal, closeModal } = useModalManager();

  if (modal.type !== "rename" || !modal.props) return null;
  if (modal.props.type !== "rename") return null;

  const { oldName, onRename } = modal.props;

  // Pisahkan nama dan ekstensi agar ekstensi tidak ikut terseleksi
  const dotIndex = oldName.lastIndexOf(".");
  const hasExt = dotIndex > 0;
  const namePart = hasExt ? oldName.slice(0, dotIndex) : oldName;
  const extPart = hasExt ? oldName.slice(dotIndex) : "";

  const [value, setValue] = useState(namePart);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus dan seleksi hanya bagian nama saat modal buka
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, namePart.length);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const validate = (val: string): string => {
    if (!val.trim()) return "Nama tidak boleh kosong.";
    if (INVALID_CHARS.test(val)) return 'Tidak boleh mengandung: \\ / : * ? " < > |';
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setError(validate(val));
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    const err = validate(trimmed);
    if (err) { setError(err); return; }

    // Gabungkan kembali nama + ekstensi
    const newName = trimmed + extPart;

    // Jika nama tidak berubah, tutup saja
    if (newName === oldName) { closeModal(); return; }

    onRename(newName);
    closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") closeModal();
  };

  return (
    <div className="w-full h-full z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute  w-full h-full"
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

        {/* Icon + Title */}
        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mb-4">
          <Pencil className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-1">Ganti Nama</h2>
        <p className="text-slate-500 text-xs mb-4 truncate">{oldName}</p>

        {/* Input */}
        <div className="mb-1">
          <div className={`flex items-center bg-slate-800 rounded-xl px-3 py-2.5 gap-2 border transition-colors ${
            error ? "border-red-500" : "border-transparent focus-within:border-blue-500"
          }`}>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Nama baru..."
              spellCheck={false}
            />
            {/* Tampilkan ekstensi sebagai suffix tidak bisa diedit */}
            {extPart && (
              <span className="text-slate-500 text-sm shrink-0">{extPart}</span>
            )}
          </div>
          {/* Error message */}
          <p className={`text-xs mt-1.5 ml-1 transition-opacity ${error ? "text-red-400 opacity-100" : "opacity-0"}`}>
            {error || "placeholder"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={closeModal} className="flex-1">
            Batal
          </Button>
          <Button
            variant="confirm"
            onClick={handleSubmit}
            disabled={!!error || !value.trim()}
            className="flex-1"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}