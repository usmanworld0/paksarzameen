import { prisma } from "@/lib/prisma";

const galleryImageInclude = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} as const;

const approvedGallerySelect = {
  id: true,
  imageUrl: true,
  thumbnailUrl: true,
  caption: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} as const;

export type ApprovedGalleryImage = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type GalleryUploadImage = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  originalFilename: string | null;
  caption: string | null;
  approved: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export async function getApprovedGalleryImages(): Promise<ApprovedGalleryImage[]> {
  try {
    return (await prisma.image.findMany({
      where: { approved: true },
      select: approvedGallerySelect,
      orderBy: { createdAt: "desc" },
    })) as ApprovedGalleryImage[];
  } catch (err) {
    // Defensive: if the images table doesn't exist or DB is unavailable,
    // don't crash the entire page — log and return an empty list.
    // The real fix is to ensure migrations are applied or DATABASE_URL is correct.
    // eslint-disable-next-line no-console
    console.error("getApprovedGalleryImages error:", err);
    return [];
  }
}

export async function getUserGalleryImages(userId: string): Promise<GalleryUploadImage[]> {
  try {
    return (await prisma.image.findMany({
      where: { userId },
      include: galleryImageInclude,
      orderBy: { createdAt: "desc" },
    })) as GalleryUploadImage[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("getUserGalleryImages error:", err);
    return [];
  }
}