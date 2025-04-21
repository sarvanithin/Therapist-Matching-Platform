import type React from "react"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
