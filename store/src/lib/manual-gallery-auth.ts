import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const MANUAL_GALLERY_SESSION_COOKIE = "manual-user-session";

export type ManualGalleryUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function getManualGalleryUser(): Promise<ManualGalleryUser | null> {
  const token = cookies().get(MANUAL_GALLERY_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.galleryManualSession.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
      signup: { status: "active" },
    },
    select: {
      signup: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!session?.signup.user?.id || !session.signup.user.email) {
    return null;
  }

  return {
    id: session.signup.user.id,
    email: session.signup.user.email,
    name: session.signup.user.name ?? null,
  };
}
