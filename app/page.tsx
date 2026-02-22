"use client";

import Header from "@/components/header/Header";
import FileListContainer from "@/app/_containers/FileListContainer";
import ActionBarContainer from "@/app/_containers/ActionBarContainer";
import ToolBarContainer from "@/app/_containers/ToolBarContainer";


export default function Page() {
  return (
    <>
      <Header />

      <ToolBarContainer />
      <FileListContainer />
      <ActionBarContainer />
    </>
  );
}