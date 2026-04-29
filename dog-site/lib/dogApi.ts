import { apiUrl } from "./api";
import { parseJsonResponse } from "./fetchHelpers";

export type DogRecord = {
  dogId: string;
  name: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  city: string | null;
  area: string | null;
  description: string;
  imageUrl: string;
  status: "available" | "pending" | "adopted";
  createdAt: string;
};

export type AdoptedDogRecord = {
  dogId: string;
  dogName: string;
  rescueName: string;
  petName: string | null;
  breed: string;
  color: string;
  age: string;
  gender: string;
  imageUrl: string;
  ownerName: string | null;
};

export type DogDetail = {
  dogId: string;
  name: string;
  rescueName: string;
  petName: string | null;
  breed: string;
  color: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: string;
  status: "available" | "pending" | "adopted";
};

export async function loadDogCatalog() {
  const res = await fetch(apiUrl("/api/dogs?status=available&status=adopted"), { cache: "no-store" });
  const payload = (await parseJsonResponse(res)) as { data?: DogRecord[]; error?: string };

  if (!res.ok) {
    throw new Error(payload?.error || `Failed to load dogs. (status ${res.status})`);
  }

  return payload.data ?? [];
}

export async function loadAdoptedDogs() {
  const res = await fetch(apiUrl("/api/dogs/adopted"), { cache: "no-store" });
  const payload = (await parseJsonResponse(res)) as { data?: AdoptedDogRecord[]; error?: string };

  if (!res.ok) {
    throw new Error(payload?.error || `Failed to load adopted dogs. (status ${res.status})`);
  }

  return payload.data ?? [];
}

export async function loadDogById(dogId: string) {
  const res = await fetch(apiUrl(`/api/dogs/${dogId}`), { cache: "no-store" });
  const payload = (await parseJsonResponse(res)) as { data?: { dog?: DogDetail; updates?: unknown[] } | DogDetail; error?: string };

  if (!res.ok) {
    throw new Error(payload?.error || `Failed to load dog. (status ${res.status})`);
  }

  return payload.data;
}