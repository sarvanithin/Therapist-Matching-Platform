"use client"

import type React from "react"
import { Suspense } from "react"
import { AdminSidebarSkeleton } from "@/components/admin-sidebar-skeleton"
import { AdminSidebarClient } from "@/components/admin-sidebar-client"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <Suspense fallback={<AdminSidebarSkeleton />}>
          <AdminSidebarClient />
        </Suspense>
        <main className="flex flex-col p-6 md:p-10">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
