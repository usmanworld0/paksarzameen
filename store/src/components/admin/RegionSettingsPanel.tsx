"use client";

import { useMemo, useState } from "react";
import type { StoreRegionRecord } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Globe2, CheckCircle2, Shield, User } from "lucide-react";

interface RegionSettingsPanelProps {
  initialRegions: StoreRegionRecord[];
  adminName: string;
  adminEmail: string;
}

export function RegionSettingsPanel({
  initialRegions,
  adminName,
  adminEmail,
}: RegionSettingsPanelProps) {
  const [regions, setRegions] = useState(initialRegions);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const activeCount = useMemo(
    () => regions.filter((region) => region.active).length,
    [regions]
  );

  function toggleRegion(code: StoreRegionRecord["code"], active: boolean) {
    setRegions((current) => {
      const next = current.map((region) =>
        region.code === code ? { ...region, active } : region
      );

      const nextActive = next.filter((region) => region.active);
      if (!nextActive.some((region) => region.isDefault)) {
        const fallbackCode = nextActive[0]?.code ?? "PAK";
        return next.map((region) => ({
          ...region,
          isDefault: region.code === fallbackCode,
        }));
      }

      return next;
    });
  }

  function setDefault(code: StoreRegionRecord["code"]) {
    setRegions((current) =>
      current.map((region) => ({
        ...region,
        active: region.code === code ? true : region.active,
        isDefault: region.code === code,
      }))
    );
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);

    const response = await fetch("/api/store-regions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        regions: regions.map((region) => ({
          code: region.code,
          active: region.active,
          isDefault: region.isDefault,
        })),
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus(payload?.error || "Unable to save region settings.");
      setSaving(false);
      return;
    }

    setRegions(payload.regions || regions);
    setStatus("Region settings saved.");
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="admin-form-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10">
              <Globe2 className="h-4.5 w-4.5 text-brand-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-800">Available Regions</h2>
              <p className="text-xs text-neutral-400">
                Activate the markets you want to sell in, then fill those region prices on every product.
              </p>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <div className="space-y-4">
            {regions.map((region) => (
              <div
                key={region.code}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {region.name} <span className="text-neutral-400">({region.currency})</span>
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Detection: {region.countryCodes.join(", ")} • Locale {region.locale}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Active</span>
                      <Switch
                        checked={region.active}
                        onCheckedChange={(value) => toggleRegion(region.code, value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant={region.isDefault ? "primary" : "outline"}
                      className="h-9"
                      onClick={() => setDefault(region.code)}
                    >
                      {region.isDefault ? "Default Region" : "Set Default"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Save Region Settings
            </Button>
            {status && <span className="text-sm text-neutral-500">{status}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10">
              <User className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">{adminName}</p>
              <p className="text-xs text-neutral-400">{adminEmail}</p>
            </div>
          </div>
          <div className="h-px bg-neutral-100" />
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Shield className="h-3.5 w-3.5" />
            <span>Administrator</span>
          </div>
        </div>

        <div className="admin-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-800">Region Summary</h3>
          <div className="h-px bg-neutral-100" />
          <div className="space-y-3 text-sm text-neutral-600">
            <div className="flex items-center justify-between">
              <span>Active Regions</span>
              <span className="font-semibold text-neutral-900">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Default Region</span>
              <span className="font-semibold text-neutral-900">
                {regions.find((region) => region.isDefault)?.name || "Pakistan"}
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            Products must have a price for every active region before they can be saved.
          </p>
        </div>
      </div>
    </div>
  );
}