"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  filename?: string;
};

export default function TextPreview({ src }: Props) {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadText() {
      try {
        const res = await fetch(src);

        if (!res.ok) {
          throw new Error("Gagal memuat file");
        }

        const text = await res.text();

        if (!cancelled) {
          setContent(text);
        }
      } catch {
        if (!cancelled) {
          setContent("Gagal memuat file.");
        }
      }
    }

    loadText();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <pre className="max-h-[70vh] overflow-auto p-4 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
      {content ?? "Memuat..."}
    </pre>
  );
}