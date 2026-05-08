"use client";

import { useEffect, useState } from "react";

export type AdminClientPermission = {
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

export type AdminClientSession = {
  email: string;
  role: "admin" | "tenant";
  permissions: AdminClientPermission[];
  redirectTo: string;
};

function getPermission(
  session: AdminClientSession,
  moduleName: string
): AdminClientPermission | null {
  return session.permissions.find((entry) => entry.module === moduleName) ?? null;
}

export function hasClientModulePermission(
  session: AdminClientSession | null,
  moduleName: string,
  action: "view" | "edit" | "manage" = "view"
) {
  if (!session) return false;
  if (session.role === "admin") return true;

  const permission = getPermission(session, moduleName);
  if (!permission) return false;

  if (action === "view") return Boolean(permission.can_view);
  if (action === "edit") return Boolean(permission.can_edit);
  return Boolean(permission.can_manage);
}

export function canAccessAdminRoute(session: AdminClientSession | null, href: string) {
  if (!session) return false;
  if (session.role === "admin") return true;

  if (href === "/admin" || href === "/admin/users") {
    return false;
  }

  if (
    href === "/admin/dogs" ||
    href === "/admin/adoption-requests" ||
    href === "/admin/dog-updates"
  ) {
    return hasClientModulePermission(session, "dog_adoption", "view");
  }

  if (href === "/admin/blood-requests") {
    return hasClientModulePermission(session, "blood_bank", "view");
  }

  if (href === "/admin/healthcare") {
    return hasClientModulePermission(session, "healthcare", "view");
  }

  return false;
}

export function useAdminClientSession() {
  const [session, setSession] = useState<AdminClientSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          if (active) setSession(null);
          return;
        }

        const payload = (await response.json()) as {
          data?: AdminClientSession;
        };

        if (active) {
          setSession(payload.data ?? null);
        }
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  return { session, loading };
}
