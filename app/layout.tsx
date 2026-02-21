import { Suspense } from "react";
import "./globals.css";
import Providers from "./providers";
import GlobalTaskProgress from "@/components/global/GlobalTaskProgress";
import GlobalModalRenderer from "@/components/global/GlobalModalRenderer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen max-w-7xl mx-auto">
        <Providers>
          {/* Suspense wajib karena FileListContainer menggunakan useSearchParams */}
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <GlobalTaskProgress />
          <GlobalModalRenderer />
        </Providers>
      </body>
    </html>
  );
}