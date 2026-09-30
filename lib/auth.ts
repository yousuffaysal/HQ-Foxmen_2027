import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/site/store";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;
        // Brute-force guard: 10 attempts per 15 min per IP and per account.
        const email = String(credentials.email).toLowerCase().slice(0, 254);
        const [ipOk, acctOk] = await Promise.all([
          rateLimit("login-ip", clientIp(request), 10, 900),
          rateLimit("login-acct", email, 10, 900),
        ]);
        if (!ipOk || !acctOk) return null;
        const rows = await sql`SELECT * FROM users WHERE email = ${credentials.email as string} LIMIT 1` as { id: string; name: string; email: string; role: string; password_hash: string; blocked?: boolean }[];
        const user = rows[0];
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password_hash);
        if (!valid) return null;
        if (user.blocked) return null;
        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "client";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
