import Link from "next/link";
import { ArtistForm } from "@/components/admin/ArtistForm";
import { ArrowLeft } from "lucide-react";

export default function NewArtistPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/artists"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Artisans
        </Link>
        <p className="admin-page-subtitle">Community</p>
        <h1 className="admin-page-title mt-1">New Artisan</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Register a new artisan or craftsperson</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <ArtistForm />
      </div>
    </div>
  );
}
