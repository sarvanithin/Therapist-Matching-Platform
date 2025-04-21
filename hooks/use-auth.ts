"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth({ required = false, role = null }: { required?: boolean; role?: string | null } = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user
  const userRole = session?.user?.role

  useEffect(() => {
    if (!isLoading) {
      // If authentication is required and the user is not authenticated
      if (required && !isAuthenticated) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`)
      }

      // If a specific role is required and the user doesn't have it
      if (role && userRole !== role) {
        router.push("/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, required, role, userRole, router])

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    userRole,
  }
}
