"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Calendar, Settings, LogOut, ShieldAlert, Database, FileText } from "lucide-react"
import { Logo } from "@/components/logo"
import { Suspense } from "react"

export function AdminSidebar() {
  return (
    <Suspense fallback={<AdminSidebarSkeleton />}>
      <AdminSidebarClient />
    </Suspense>
  )
}

function AdminSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Logo href="/admin/dashboard" />
        <span className="ml-2 text-sm font-medium">Admin</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <div className="h-4 w-4 animate-pulse bg-muted-foreground/20 rounded" />
              <div className="h-4 w-20 animate-pulse bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="h-9 w-full animate-pulse bg-muted-foreground/20 rounded-md" />
      </div>
    </div>
  )
}

function AdminSidebarClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isSuperAdmin = searchParams.get("role") === "superadmin"

  const adminNavItems = [
    {
      title: "Dashboard",
      href: isSuperAdmin ? "/admin/dashboard?role=superadmin" : "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Therapists",
      href: isSuperAdmin ? "/admin/therapists?role=superadmin" : "/admin/therapists",
      icon: Users,
    },
    {
      title: "Appointments",
      href: isSuperAdmin ? "/admin/appointments?role=superadmin" : "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "Settings",
      href: isSuperAdmin ? "/admin/settings?role=superadmin" : "/admin/settings",
      icon: Settings,
    },
  ]

  // Super admin only items
  const superAdminItems = [
    {
      title: "User Management",
      href: "/admin/users?role=superadmin",
      icon: Users,
    },
    {
      title: "System Logs",
      href: "/admin/logs?role=superadmin",
      icon: FileText,
    },
    {
      title: "Database",
      href: "/admin/database?role=superadmin",
      icon: Database,
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Logo href={isSuperAdmin ? "/admin/dashboard?role=superadmin" : "/admin/dashboard"} />
        <span className="ml-2 text-sm font-medium">
          {isSuperAdmin ? (
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Super Admin
            </span>
          ) : (
            "Admin"
          )}
        </span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href.split("?")[0]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}

          {isSuperAdmin && (
            <>
              <div className="my-2 px-3 text-xs font-semibold text-muted-foreground">SUPER ADMIN</div>
              {superAdminItems.map((item) => {
                const isActive = pathname === item.href.split("?")[0]
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                      isActive && "bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link href="/auth/signin">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </Link>
      </div>
    </div>
  )
}
