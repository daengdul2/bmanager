"use client";

import { ChevronRight, ArrowUp, Home } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext";

export default function Breadcrumb() {
  const { path, setPath, setQuery } = useFileManager();
  const parts = path ? path.split("/") : [];

  function goRoot() {
    setPath("");
    setQuery("");
  }

  function goUp() {
    if (!path) return;
    setPath(parts.slice(0, -1).join("/"));
  }

  function goTo(index: number) {
    setPath(parts.slice(0, index + 1).join("/"));
  }

  return (
    <div className="flex flex-col border-t-black">
      <hr className="border-t-1 border-slate-200 dark:border-slate-700" />

      <div className="flex items-center gap-2 overflow-hidden justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          <button
            onClick={goRoot}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md
              border border-slate-200 dark:border-slate-700
              hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          {parts.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => goTo(i)}
                className="text-sm truncate max-w-[140px] hover:underline"
                title={p}
              >
                {p}
              </button>
            </div>
          ))}
        </div>

        {/* Up */}
        {path && (
          <button
            onClick={goUp}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md
              border border-slate-200 dark:border-slate-700
              hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowUp className="w-4 h-4" />
            Up
          </button>
        )}
      </div>
    </div>
  );
}