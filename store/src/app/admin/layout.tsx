"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#faf9f6]">
        {mounted && (
          <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <div className="min-w-0 transition-all duration-300 md:pl-[260px]">
          {mounted && (
            <AdminHeader
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              sidebarOpen={sidebarOpen}
            />
          )}
          <main className="p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
