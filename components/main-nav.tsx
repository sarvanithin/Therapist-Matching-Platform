"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavItem {
  href: string
  label: string
  requireAuth?: boolean
}

export function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      requireAuth: true,
    },
    {
      href: "/appointments",
      label: "Appointments",
      requireAuth: true,
    },
    {
      href: "/therapists",
      label: "Therapists",
      requireAuth: false,
    },
    {
      href: "/demo/calendar-integration",
      label: "Calendar Demo",
      requireAuth: false,
    },
  ]

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter((item) => {
    if (item.requireAuth) {
      return !!session
    }
    return true
  })

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Logo href={session ? "/dashboard" : "/"} showText={false} />
      <nav className="flex gap-6">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
