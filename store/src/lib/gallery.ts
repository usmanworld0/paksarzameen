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

export function getApprovedGalleryImages(): Promise<ApprovedGalleryImage[]> {
  return prisma.image.findMany({
    where: { approved: true },
    select: approvedGallerySelect,
    orderBy: { createdAt: "desc" },
  }) as Promise<ApprovedGalleryImage[]>;
}

export function getUserGalleryImages(userId: string): Promise<GalleryUploadImage[]> {
  return prisma.image.findMany({
    where: { userId },
    include: galleryImageInclude,
    orderBy: { createdAt: "desc" },
  }) as Promise<GalleryUploadImage[]>;
}