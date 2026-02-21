"use client";

import Navbar from "@/components/header/Navbar";
import Breadcrumb from "@/components/header/Breadcrumb";
import FilterBar from "@/components/header/FilterBar";
import FileListContainer from "./_containers/FileListContainer";
import ToolBarContainer from "./_containers/ToolBarContainer";

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 px-4">
        <Navbar />
        <FilterBar />
        <Breadcrumb />
      </header>

      <FileListContainer />
      <ToolBarContainer />
    </>
  );
}