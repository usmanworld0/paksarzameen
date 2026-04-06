"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type GalleryUploadFormProps = {
  signedInEmail?: string | null;
};

export function GalleryUploadForm({ signedInEmail }: GalleryUploadFormProps) {
  const router = useRouter();
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
      className="space-y-6 rounded-none border border-[#E0E0E0] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#444444]">
          <Upload className="h-4 w-4" />
          Upload Form
        </div>
        <h2 className="text-2xl font-semibold text-[#000000]">Share your artwork</h2>
        <p className="max-w-xl text-sm leading-6 text-[#444444]">
          Each upload is reviewed before it appears in the public gallery. Your
          submissions are saved under the account currently signed in.
        </p>
        {signedInEmail ? (
          <p className="text-sm text-[#444444]">
            Signed in as <span className="font-medium text-[#000000]">{signedInEmail}</span>
          </p>
        ) : null}
      </div>

      <label className="block rounded-none border border-dashed border-[#E0E0E0] bg-[#fafafa] p-6 transition hover:border-[#BFA56A] hover:bg-[#fffdf8]">
        <div className="flex flex-col gap-3 text-center">
          <ImagePlus className="mx-auto h-8 w-8 text-[#BFA56A]" />
          <div>
            <p className="text-sm font-semibold text-[#000000]">Choose artwork files</p>
            <p className="mt-1 text-xs text-[#444444]">
              PNG, JPG, WEBP, or AVIF files only.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mx-auto max-w-full text-sm text-[#444444] file:mr-4 file:rounded-none file:border-0 file:bg-[#000000] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#BFA56A] hover:file:text-[#000000]"
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              setFiles(nextFiles);
            }}
          />
        </div>
      </label>

      <div className="space-y-2">
        <label htmlFor="caption" className="text-sm font-medium text-[#000000]">
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          rows={4}
          placeholder="Tell us about the piece, the medium, or the story behind it"
          className="w-full rounded-none border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#000000] outline-none transition placeholder:text-[#444444] focus:border-[#BFA56A]"
        />
      </div>

      {selectedNames.length > 0 ? (
        <div className="rounded-none border border-[#E0E0E0] bg-[#fafafa] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#444444]">
            Selected files
          </p>
          <ul className="mt-3 space-y-1 text-sm text-[#444444]">
            {selectedNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {message ? (
        <p className="rounded-none border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-none border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-none bg-[#000000] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:bg-[#BFA56A] hover:text-[#000000]"
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