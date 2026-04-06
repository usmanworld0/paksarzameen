import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

import {
  getAuthSecret,
  getGoogleClientId,
  getGoogleClientSecret,
  hasGoogleConfig,
} from "@/lib/auth-env";

const googleClientId = getGoogleClientId();
const googleClientSecret = getGoogleClientSecret();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: getAuthSecret(),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  providers: hasGoogleConfig()
    ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : [],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};

export async function getCurrentSession() {
  const { getServerSession } = await import("next-auth/next");
  return getServerSession(authOptions);
}
