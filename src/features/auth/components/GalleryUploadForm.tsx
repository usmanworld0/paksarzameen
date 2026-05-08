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
      className="space-y-6 rounded-2xl border border-[#E5E5E5] bg-white p-6"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Upload Form</p>
        <h2 className="mt-2 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Share your artwork</h2>
        <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#707072]">
          Each upload is reviewed before it appears in the public gallery. Your
          submissions are saved under the account currently signed in.
        </p>
        {session?.user?.email ? (
          <p className="mt-2 text-xs font-medium text-[#707072]">
            Signed in as <span className="font-semibold text-[#111111]">{session.user.email}</span>
          </p>
        ) : null}
      </div>

      <label className="block rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-[#f3f3ee] p-8 text-center transition hover:border-[#0f7a47]/40 cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <ImagePlus className="h-8 w-8 text-[#0f7a47]" />
          <div>
            <p className="text-sm font-black tracking-tighter text-[#111111]">Choose artwork files</p>
            <p className="mt-1 text-xs font-medium text-[#707072]">
              PNG, JPG, WEBP, or AVIF files only.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mx-auto max-w-full text-sm text-[#707072] file:mr-4 file:rounded-xl file:border-0 file:bg-[#111111] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white hover:file:bg-[#333]"
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              setFiles(nextFiles);
            }}
          />
        </div>
      </label>

      <div>
        <label htmlFor="caption" className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          rows={4}
          placeholder="Tell us about the piece, the medium, or the story behind it"
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
        />
      </div>

      {selectedNames.length > 0 ? (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">
            Selected files
          </p>
          <ul className="mt-3 space-y-1 text-sm font-medium text-[#111111]">
            {selectedNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
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
