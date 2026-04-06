import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import {
  getAuthSecret,
  getAuthUrl,
  getGoogleAuthClientId,
  getGoogleAuthClientSecret,
  getHardcodedAdminCredentials,
} from "./auth-env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: getAuthSecret(),
  debug: process.env.NODE_ENV !== "production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: getAuthUrl().startsWith("https://")
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: getAuthUrl().startsWith("https://"),
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleAuthClientId(),
      clientSecret: getGoogleAuthClientSecret(),
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const hardcodedAdmin = getHardcodedAdminCredentials();

        if (
          normalizedEmail === hardcodedAdmin.email.toLowerCase() &&
          credentials.password === hardcodedAdmin.password
        ) {
          return {
            id: "hardcoded-admin",
            email: hardcodedAdmin.email.toLowerCase(),
            name: "Admin",
            role: "admin",
          };
        }

        try {
          const admin = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
          });
          if (!admin) return null;

          const isValid = await compare(credentials.password, admin.password);
          if (!isValid) return null;

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
