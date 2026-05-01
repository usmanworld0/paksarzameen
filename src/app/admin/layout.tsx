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
    <div className={`min-h-screen overflow-x-hidden bg-[#ffffff] ${isLoginPage ? "" : "md:pl-[280px]"}`}>
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

        <main className={isLoginPage ? "p-0" : "min-h-screen"}>
          <div className={isLoginPage ? "" : "mx-auto max-w-none"}>{children}</div>
        </main>
      </div>
    </div>
  );
}
