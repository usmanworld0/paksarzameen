"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      setUploading(true);
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (images.length + newImages.length >= maxImages) break;

        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            newImages.push(data.url);
          }
        } catch {
          // Upload failed silently, user can retry
        }
      }

      onChange([...images, ...newImages]);
      setUploading(false);
      e.target.value = "";
    },
    [images, onChange, maxImages]
  );

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden bg-neutral-50 border border-neutral-200 ring-1 ring-neutral-100"
          >
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green/50 hover:bg-brand-green/[0.02] transition-colors">
            {uploading ? (
              <Loader2 className="h-5 w-5 text-neutral-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-neutral-400 mb-1" />
                <span className="text-[10px] text-neutral-400">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-neutral-400">
        {images.length}/{maxImages} images. Max 5MB each.
      </p>
    </div>
  );
}
