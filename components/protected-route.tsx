"use client"

import { useAuth } from "@/hooks/use-auth"
import type { ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, userRole } = useAuth({
    required: true,
    role: requiredRole || null,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will redirect to sign in
  }

  if (requiredRole && userRole !== requiredRole) {
    return null // The useAuth hook will redirect to dashboard
  }

  return <>{children}</>
}
