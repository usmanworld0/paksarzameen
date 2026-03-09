import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  // Protect /admin itself AND all sub-paths except /admin/login
  matcher: ["/admin", "/admin/((?!login).*)"],
};
