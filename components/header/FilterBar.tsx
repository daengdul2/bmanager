"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, List, Search, X } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext"; // ambil context

export default function FilterBar() {
  const { sortKey, setSortKey, sortOrder, setSortOrder, viewMode, setViewMode, query, setQuery } = useFileManager();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
const handleClear = () => {
  setQuery("");
  inputRef.current?.focus(); // Balikkan kursor ke input
};
  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function closeOnScroll() {
      setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", close);
      window.addEventListener("scroll", closeOnScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [open]);

  return (
    <div className="py-2">
      <div className="flex items-center gap-3 py-2">
        {/* SORT */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-sm"
          >
            Sort {open ? "▲" : "▼"}
          </button>

          {open && (
            <div
              className="absolute top-full left-0 mt-2 z-50 w-36
                rounded-md border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900 shadow-lg p-1"
            >
              {(["name", "type", "date", "size"] as const).map(key => (
                <button
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-sm
                    ${sortKey === key
                      ? "bg-slate-300 dark:bg-slate-800"
                      : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ORDER */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-900 text-sm"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>

        {/* VIEW MODE */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${
              viewMode === "grid"
                ? "bg-slate-300 dark:bg-slate-800"
                : "bg-slate-200 dark:bg-slate-800/30"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${
              viewMode === "list"
                ? "bg-slate-300 dark:bg-slate-800"
                : "bg-slate-200 dark:bg-slate-800/30"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
{/* Search Container */}
<div className="relative group">
  <Search className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
  
  <input
    value={query}
    onChange={e => setQuery(e.target.value)}
    placeholder="Search file..."
    className="w-full pl-8 pr-9 py-1 text-sm rounded-md
      border border-slate-200 dark:border-slate-800
      bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />

  {/* Tombol X (Clear) */}
  {query && (
    <button
      onClick={handleClear}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
        hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full 
        transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      title="Clear search"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  )}
</div>

    </div>
  );
}