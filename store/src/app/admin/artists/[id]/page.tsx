import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArtistForm } from "@/components/admin/ArtistForm";
import { ArrowLeft } from "lucide-react";

interface EditArtistPageProps {
  params: { id: string };
}

export default async function EditArtistPage({ params }: EditArtistPageProps) {
  const artist = await prisma.artist.findUnique({ where: { id: params.id } });
  if (!artist) notFound();

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
        <h1 className="admin-page-title mt-1">Edit Artisan</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Update &quot;{artist.name}&quot;</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <ArtistForm artist={artist} />
      </div>
    </div>
  );
}
