"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Artist } from "@prisma/client";
import { artistSchema, type ArtistFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { Loader2 } from "lucide-react";

interface ArtistFormProps {
  artist?: Artist;
}

export function ArtistForm({ artist }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(
    artist?.profileImage ? [artist.profileImage] : []
  );

  const socialLinks = (artist?.socialLinks as Record<string, string>) || {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: artist?.name || "",
      slug: artist?.slug || "",
      bio: artist?.bio || "",
      location: artist?.location || "",
      profileImage: artist?.profileImage || "",
      socialLinks: {
        instagram: socialLinks.instagram || "",
        facebook: socialLinks.facebook || "",
        website: socialLinks.website || "",
      },
    },
  });

  async function onSubmit(data: ArtistFormData) {
    setLoading(true);
    setSubmitError(null);
    try {
      const url = artist ? `/api/artists/${artist.id}` : "/api/artists";
      const method = artist ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, profileImage: images[0] ?? undefined }),
      });

      if (res.ok) {
        router.push("/admin/artists");
        router.refresh();
        return;
      }

      const payload = await res.json().catch(() => null);
      setSubmitError(
        payload?.error || payload?.message || "Unable to save artist."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input
            id="name"
            {...register("name", {
              onChange: (e) => {
                if (!artist) setValue("slug", slugify(e.target.value));
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
        </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} {...register("bio")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="City, Province" />
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Profile Image</h3>
        <ImageUploader images={images} onChange={setImages} maxImages={1} />
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Social Links</legend>
        <Input {...register("socialLinks.instagram")} placeholder="Instagram URL" />
        <Input {...register("socialLinks.facebook")} placeholder="Facebook URL" />
        <Input {...register("socialLinks.website")} placeholder="Website URL" />
      </section>

      <div className="h-px bg-neutral-100" />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {artist ? "Update Artist" : "Create Artist"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
