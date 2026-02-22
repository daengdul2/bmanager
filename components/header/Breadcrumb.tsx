"use client";

import { ChevronRight, ArrowUp, Home } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext";
import { ROOT } from "@/lib/config";

// Nama folder root untuk ditampilkan (misal "Download" dari "/sdcard/Download")
const ROOT_LABEL = ROOT.split("/").filter(Boolean).pop() ?? "Home";

export default function Breadcrumb() {
  const { path, setPath, setQuery } = useFileManager();

  // Ambil hanya bagian path di luar ROOT
  // Contoh: "/sdcard/Download/Movies/Action" → ["Movies", "Action"]
  const relativePath =
    path === ROOT ? "" : path.startsWith(ROOT + "/") ? path.slice(ROOT.length + 1) : "";
  const parts = relativePath ? relativePath.split("/").filter(Boolean) : [];

  function goRoot() {
    setPath(ROOT);
    setQuery("");
  }

  function goUp() {
    if (path === ROOT) return;
    const parentParts = path.split("/");
    parentParts.pop();
    setPath(parentParts.join("/") || ROOT);
  }

  function goTo(index: number) {
    // Gabungkan ROOT + bagian relatif sampai index
    const target = [ROOT, ...parts.slice(0, index + 1)].join("/");
    setPath(target);
  }

  return (
    <div className="flex flex-col border-t-black">
      <hr className="border-t-1 border-slate-200 dark:border-slate-700" />

      <div className="flex items-center gap-2 overflow-hidden justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          {/* Root button — tampilkan nama folder root */}
          <button
            onClick={goRoot}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md
              border border-slate-200 dark:border-slate-700
              hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
          >
            <Home className="w-4 h-4" />
            {ROOT_LABEL}
          </button>

          {/* Bagian relatif dari ROOT */}
          {parts.map((part, i) => (
            <div key={`${part}-${i}`} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              <button
                onClick={() => goTo(i)}
                className={`text-sm truncate max-w-[140px] hover:underline ${
                  i === parts.length - 1 ? "font-medium text-white" : "text-slate-400"
                }`}
                title={part}
              >
                {part}
              </button>
            </div>
          ))}
        </div>

        {/* Up — sembunyikan jika sudah di root */}
        {path !== ROOT && (
          <button
            onClick={goUp}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md
              border border-slate-200 dark:border-slate-700
              hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
            Up
          </button>
        )}
      </div>
    </div>
  );
}
