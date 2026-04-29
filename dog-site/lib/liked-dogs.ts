"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const TOKEN_STORAGE_KEY = "psz-dog-browser-token";
const LIKED_STORAGE_PREFIX = "psz-dog-liked-ids";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getBrowserToken() {
  if (!canUseStorage()) {
    return "server";
  }

  const existingToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (existingToken) {
    return existingToken;
  }

  const nextToken = window.crypto.randomUUID();
  window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  return nextToken;
}

function getLikedKey(token: string) {
  return `${LIKED_STORAGE_PREFIX}:${token}`;
}

export function readLikedDogIds(token = getBrowserToken()) {
  if (!canUseStorage()) {
    return [] as string[];
  }

  try {
    const rawValue = window.localStorage.getItem(getLikedKey(token));
    if (!rawValue) {
      return [] as string[];
    }

    const parsed = JSON.parse(rawValue) as string[];
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [] as string[];
  }
}

export function writeLikedDogIds(ids: string[], token = getBrowserToken()) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(getLikedKey(token), JSON.stringify(Array.from(new Set(ids))));
}

export function toggleLikedDogId(dogId: string, token = getBrowserToken()) {
  const ids = readLikedDogIds(token);
  const nextIds = ids.includes(dogId) ? ids.filter((value) => value !== dogId) : [...ids, dogId];
  writeLikedDogIds(nextIds, token);
  return nextIds;
}

export function useLikedDogs() {
  const [token, setToken] = useState<string | null>(null);
  const [likedDogIds, setLikedDogIds] = useState<string[]>([]);

  useEffect(() => {
    if (!canUseStorage()) {
      return;
    }

    const activeToken = getBrowserToken();
    setToken(activeToken);
    setLikedDogIds(readLikedDogIds(activeToken));

    const syncLikes = () => setLikedDogIds(readLikedDogIds(activeToken));
    window.addEventListener("storage", syncLikes);

    return () => {
      window.removeEventListener("storage", syncLikes);
    };
  }, []);

  const isLiked = useCallback((dogId: string) => likedDogIds.includes(dogId), [likedDogIds]);

  const toggleLikedDog = useCallback((dogId: string) => {
    if (!token) {
      return [] as string[];
    }

    const nextIds = toggleLikedDogId(dogId, token);
    setLikedDogIds(nextIds);
    return nextIds;
  }, [token]);

  return useMemo(() => ({ token, likedDogIds, isLiked, toggleLikedDog }), [isLiked, likedDogIds, toggleLikedDog, token]);
}