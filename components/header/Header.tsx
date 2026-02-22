"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useFileManager } from "@/context/FileManagerContext";
import Navbar from "@/components/header/Navbar";
import Breadcrumb from "@/components/header/Breadcrumb";
import FilterBar from "@/components/header/FilterBar";

export default function Header() {
  const { toggleUi, uiVisible } = useFileManager();

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 px-4">
      <Navbar />

      {/* FilterBar & Breadcrumb — dengan animasi */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          uiVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <FilterBar />
        <Breadcrumb />
      </div>

      {/* Tombol toggle — hanya tampil di layar kecil */}
      <button
        onClick={toggleUi}
        aria-label={uiVisible ? "Sembunyikan toolbar" : "Tampilkan toolbar"}
        aria-expanded={uiVisible}
        className="md:hidden flex w-full items-center justify-center py-1.5
          text-slate-400 hover:text-slate-200 hover:bg-slate-800
          rounded-md transition-colors"
      >
        {uiVisible
          ? <ChevronUp size={18} />
          : <ChevronDown size={18} />
        }
      </button>
    </div>
  );
}
