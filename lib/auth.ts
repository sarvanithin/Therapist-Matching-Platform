import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Add credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simplified mock authentication
        // In a real app, you would check against your database
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo users for testing
        const users = [
          {
            id: "1",
            name: "Super Admin",
            email: "superadmin@therapymatch.com",
            password: "password",
            role: "superadmin",
          },
          { id: "2", name: "Admin", email: "admin@therapymatch.com", password: "password", role: "admin" },
          { id: "3", name: "User", email: "user@example.com", password: "password", role: "user" },
        ]

        const user = users.find((user) => user.email === credentials.email && user.password === credentials.password)

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Add user ID and role to the session
      if (session.user) {
        session.user.id = user?.id || token?.sub || ""

        // Add role from token
        if (token?.role) {
          session.user.role = token.role as string
        }

        // If we have a token with access_token, add it to the session
        if (token?.accessToken) {
          session.accessToken = token.accessToken as string
        }
      }
      return session
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user role to the token
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }

      // Add role from user to token
      if (user) {
        token.role = (user as any).role
      }

      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
