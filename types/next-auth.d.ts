import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User {
    id: string
    role?: string
  }
}
