import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllStoreRegions } from "@/lib/store-regions";
import { RegionSettingsPanel } from "@/components/admin/RegionSettingsPanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [session, regions] = await Promise.all([
    getServerSession(authOptions),
    getAllStoreRegions(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="admin-page-subtitle">Configuration</p>
        <h1 className="admin-page-title mt-1">Settings</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Manage the markets your store sells into and the regional product pricing your catalog must maintain.
        </p>
      </div>

      <RegionSettingsPanel
        initialRegions={regions}
        adminName={session?.user?.name || "Admin"}
        adminEmail={session?.user?.email || "abdullahtanseer@gmail.com"}
      />
    </div>
  );
}
