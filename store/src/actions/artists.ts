"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getArtists() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.artist.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getArtistById(id: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await prisma.artist.findUnique({
      where: { id },
      include: {
        products: {
          where: { active: true },
          include: { images: { orderBy: { position: "asc" } }, category: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getArtistBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await prisma.artist.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          include: { images: { orderBy: { position: "asc" } }, category: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function createArtist(data: {
  name: string;
  slug: string;
  bio?: string;
  location?: string;
  profileImage?: string | null;
  socialLinks?: Record<string, string>;
}) {
  const artist = await prisma.artist.create({ data });
  revalidatePath("/artists");
  revalidatePath("/admin/artists");
  return artist;
}

export async function updateArtist(
  id: string,
  data: {
    name?: string;
    slug?: string;
    bio?: string;
    location?: string;
    profileImage?: string | null;
    socialLinks?: Record<string, string>;
  }
) {
  const artist = await prisma.artist.update({ where: { id }, data });
  revalidatePath("/artists");
  revalidatePath(`/artists/${artist.id}`);
  revalidatePath("/admin/artists");
  return artist;
}

export async function deleteArtist(id: string) {
  await prisma.artist.delete({ where: { id } });
  revalidatePath("/artists");
  revalidatePath("/admin/artists");
}
