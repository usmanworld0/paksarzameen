"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useLikedDogs } from "../lib/liked-dogs";

export function LikedDogsNavButton() {
  const { likedDogIds } = useLikedDogs();
  return (
    <Link
      href="/liked-dogs"
      aria-label="Liked dogs"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity text-current"
    >
      <Heart className="h-5 w-5" />
      {likedDogIds.length > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[11px] font-medium text-white">
          {likedDogIds.length}
        </span>
      )}
    </Link>
  );
}