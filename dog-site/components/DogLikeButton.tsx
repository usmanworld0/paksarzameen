"use client";

import { Heart } from "lucide-react";

import { useLikedDogs } from "../lib/liked-dogs";

type DogLikeButtonProps = {
  dogId: string;
  className?: string;
  label?: string;
  compact?: boolean;
};

export function DogLikeButton({ dogId, className = "", label = "Save", compact = false }: DogLikeButtonProps) {
  const { isLiked, toggleLikedDog } = useLikedDogs();
  const liked = isLiked(dogId);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => toggleLikedDog(dogId)}
        aria-pressed={liked}
        aria-label={liked ? "Remove from liked dogs" : "Save dog"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${liked ? "bg-black text-white" : "bg-white text-neutral-700 hover:bg-black hover:text-white"} ${className}`}
      >
        <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleLikedDog(dogId)}
      aria-pressed={liked}
      aria-label={liked ? "Remove from liked dogs" : "Save dog"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition ${liked ? "border-black bg-black text-white" : "border-black/12 bg-white text-neutral-700 hover:bg-black hover:text-white"} ${className}`}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      <span>{liked ? "Saved" : label}</span>
    </button>
  );
}