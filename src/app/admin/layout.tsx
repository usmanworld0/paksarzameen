"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MainAdminSidebar } from "@/components/admin/MainAdminSidebar";
import { MainAdminHeader } from "@/components/admin/MainAdminHeader";

export default function MainAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-[#faf9f6] ${isLoginPage ? "" : "md:pl-[260px]"}`}>
      <div className={isLoginPage ? "hidden" : undefined} aria-hidden={isLoginPage}>
        <MainAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="min-w-0">
        <div className={isLoginPage ? "hidden" : undefined} aria-hidden={isLoginPage}>
          <MainAdminHeader
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
          />
        </div>

        <main className={isLoginPage ? "p-0" : "p-4 sm:p-6 lg:p-8 xl:p-10"}>
          <div className={isLoginPage ? "" : "mx-auto max-w-7xl"}>{children}</div>
        </main>
      </div>
    </div>
  );
}
