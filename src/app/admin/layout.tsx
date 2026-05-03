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

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MainAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-[260px]">
        <MainAdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
