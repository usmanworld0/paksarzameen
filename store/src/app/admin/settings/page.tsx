"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Store,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local UI state for settings (not persisted yet — placeholder)
  const [storeName, setStoreName] = useState("Commonwealth Lab");
  const [storeEmail, setStoreEmail] = useState("admin@commonwealthlab.pk");
  const [currency, setCurrency] = useState("PKR");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  async function handleSave() {
    setSaving(true);
    // Simulate save — wire up to API when ready
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="admin-page-subtitle">Configuration</p>
        <h1 className="admin-page-title mt-1">Settings</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Manage your store preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Settings */}
          <div className="admin-form-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10">
                <Store className="h-4.5 w-4.5 text-brand-green" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-800">Store Information</h2>
                <p className="text-xs text-neutral-400">Basic store details</p>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStock">Low Stock Threshold</Label>
                <Input
                  id="lowStock"
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="admin-form-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
                <Bell className="h-4.5 w-4.5 text-neutral-700" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-800">Notifications</h2>
                <p className="text-xs text-neutral-400">Alert preferences</p>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Email Notifications</p>
                  <p className="text-xs text-neutral-400">Receive updates via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="h-px bg-neutral-50" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Low Stock Alerts</p>
                  <p className="text-xs text-neutral-400">Get notified when products run low</p>
                </div>
                <Switch
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                />
              </div>
              <div className="h-px bg-neutral-50" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-700">New Order Alerts</p>
                  <p className="text-xs text-neutral-400">Get notified on new orders</p>
                </div>
                <Switch
                  checked={orderAlerts}
                  onCheckedChange={setOrderAlerts}
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saved ? "Saved" : "Save Changes"}
            </Button>
            {saved && (
              <span className="text-sm text-brand-green font-medium">
                Settings updated successfully
              </span>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10">
                <User className="h-5 w-5 text-brand-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-neutral-400">
                  {session?.user?.email || "admin@gmail.com"}
                </p>
              </div>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Shield className="h-3.5 w-3.5" />
              <span>Administrator</span>
            </div>
          </div>

          {/* Theme Info */}
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
                <Palette className="h-4.5 w-4.5 text-neutral-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Theme</h3>
                <p className="text-xs text-neutral-400">PSZ Commonwealth</p>
              </div>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg bg-brand-green" />
                <span className="text-[10px] text-neutral-400">Green</span>
              </div>
              <div className="space-y-1 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg bg-neutral-500" />
                <span className="text-[10px] text-neutral-400">Stone</span>
              </div>
              <div className="space-y-1 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg bg-brand-charcoal" />
                <span className="text-[10px] text-neutral-400">Charcoal</span>
              </div>
              <div className="space-y-1 text-center">
                <div className="mx-auto h-8 w-8 rounded-lg bg-[#FAF9F6] border border-neutral-200" />
                <span className="text-[10px] text-neutral-400">Cream</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
