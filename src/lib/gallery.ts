import { prisma } from "@/lib/prisma";

const galleryImageUserInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
} as const;

const publicGalleryImageSelect = {
  id: true,
  userId: true,
  publicId: true,
  imageUrl: true,
  thumbnailUrl: true,
  originalFilename: true,
  mimeType: true,
  fileSize: true,
  width: true,
  height: true,
  caption: true,
  approved: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} as const;

export type PublicGalleryImageRecord = {
  id: string;
  userId: string;
  publicId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type GalleryImageRecord = PublicGalleryImageRecord & {
  user: PublicGalleryImageRecord["user"] & {
    email: string | null;
  };
};

export function getApprovedGalleryImages(): Promise<PublicGalleryImageRecord[]> {
  return prisma.image.findMany({
    where: {
      approved: true,
    },
    select: publicGalleryImageSelect,
    orderBy: {
      createdAt: "desc",
    },
  }) as Promise<PublicGalleryImageRecord[]>;
}

export function getUserGalleryImages(userId: string): Promise<GalleryImageRecord[]> {
  return prisma.image.findMany({
    where: {
      userId,
    },
    include: galleryImageUserInclude,
    orderBy: {
      createdAt: "desc",
    },
  }) as Promise<GalleryImageRecord[]>;
}
