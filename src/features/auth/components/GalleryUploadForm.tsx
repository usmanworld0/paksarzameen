"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ImagePlus, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GalleryUploadForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedNames = useMemo(() => files.map((file) => file.name), [files]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (!files.length) {
        setError("Choose at least one image before uploading.");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("caption", caption);

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "Upload failed. Please try again.");
        return;
      }

      setFiles([]);
      setCaption("");
      setMessage("Upload received. Your art is waiting for review.");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/90 p-6 shadow-[0_20px_80px_rgba(7,35,20,0.08)] backdrop-blur-xl"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-psz-green">
          <Upload className="h-4 w-4" />
          Upload Form
        </div>
        <h2 className="text-2xl font-semibold text-psz-black">Share your artwork</h2>
        <p className="max-w-xl text-sm leading-6 text-neutral-600">
          Each upload is reviewed before it appears in the public gallery. Your
          submissions are saved under the account currently signed in.
        </p>
        {session?.user?.email ? (
          <p className="text-sm text-neutral-500">
            Signed in as <span className="font-medium text-neutral-900">{session.user.email}</span>
          </p>
        ) : null}
      </div>

      <label className="block rounded-2xl border border-dashed border-psz-green/25 bg-psz-green/5 p-6 transition hover:border-psz-green/40 hover:bg-psz-green/7">
        <div className="flex flex-col gap-3 text-center">
          <ImagePlus className="mx-auto h-8 w-8 text-psz-green" />
          <div>
            <p className="text-sm font-semibold text-psz-black">Choose artwork files</p>
            <p className="mt-1 text-xs text-neutral-500">
              PNG, JPG, WEBP, or AVIF files only.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mx-auto max-w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-psz-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-psz-green-light"
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              setFiles(nextFiles);
            }}
          />
        </div>
      </label>

      <div className="space-y-2">
        <label htmlFor="caption" className="text-sm font-medium text-neutral-700">
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          rows={4}
          placeholder="Tell us about the piece, the medium, or the story behind it"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-psz-green/40 focus:ring-4 focus:ring-psz-green/10"
        />
      </div>

      {selectedNames.length > 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Selected files
          </p>
          <ul className="mt-3 space-y-1 text-sm text-neutral-700">
            {selectedNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {message ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-2xl bg-psz-green px-6 text-sm font-semibold text-white shadow-lg shadow-psz-green/20 transition hover:bg-psz-green-light"
        disabled={isPending || isSubmitting}
      >
        {isPending || isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Upload to Gallery
      </Button>
    </form>
  );
}
