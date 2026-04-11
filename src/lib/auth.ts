import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { validateUserCredentials } from "@/server/auth-service";
import { isValidEmail, normalizeEmail } from "@/server/validation";

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
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "email-password",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ? normalizeEmail(credentials.email) : "";
        const password = credentials?.password ?? "";

        if (!email || !isValidEmail(email)) {
          return null;
        }

        const user = await validateUserCredentials({ email, password });
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    ...(hasGoogleConfig()
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? "";
        session.user.role = (token.role as string) ?? "donor";
      }

      return session;
    },
  },
};

export async function getCurrentSession() {
  const { getServerSession } = await import("next-auth/next");
  return getServerSession(authOptions);
}
