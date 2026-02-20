"use client";

import Navbar from "@/components/header/Navbar";
import Toolbar from "@/components/header/Toolbar";
import Breadcrumb from "@/components/header/Breadcrumb";
import FileList from "@/components/controller/FileListController";

export default function Page() {
    return (
        <>
            <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 px-4">
                <Navbar />
                <Toolbar />
                <Breadcrumb />
            </header>
            <FileList/>
        </>
    );
}
