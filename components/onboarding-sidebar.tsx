"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { CheckCircle2, CircleDashed } from "lucide-react"

const steps = [
  {
    title: "Personal Information",
    description: "Basic details about you",
    href: "/onboarding",
  },
  {
    title: "Therapy Goals",
    description: "What you want to achieve",
    href: "/onboarding/goals",
  },
  {
    title: "Preferences",
    description: "Your ideal therapist",
    href: "/onboarding/preferences",
  },
  {
    title: "Availability",
    description: "When you can attend sessions",
    href: "/onboarding/availability",
  },
  {
    title: "Review",
    description: "Confirm your information",
    href: "/onboarding/review",
  },
]

export function OnboardingSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-secondary/20">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/" />
      </div>
      <div className="flex-1 overflow-auto py-6 px-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Profile Setup</h2>
        <p className="mb-6 px-4 text-sm text-muted-foreground">
          Complete these steps to find your perfect therapist match
        </p>
        <nav className="grid items-start gap-4 text-sm font-medium">
          {steps.map((step, index) => {
            const isActive = pathname === step.href
            const isCompleted = steps.findIndex((s) => s.href === pathname) > index

            return (
              <Link
                key={step.href}
                href={step.href}
                className={cn(
                  "group flex flex-col gap-2 rounded-xl p-4 transition-all hover:bg-secondary",
                  isActive && "bg-secondary",
                  isCompleted && "bg-secondary/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs transition-colors",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-muted-foreground text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isActive ? (
                      index + 1
                    ) : (
                      <CircleDashed className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className={cn("font-medium", isActive && "text-primary", isCompleted && "text-primary")}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {isActive && (
                  <div className="ml-11 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/50 animate-pulse-slow"></div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="sticky bottom-0 border-t bg-background p-4">
        <div className="rounded-lg bg-secondary/50 p-4 mb-4">
          <h3 className="text-sm font-medium">Need help?</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <Button variant="link" className="px-0 py-0 h-auto text-xs text-primary mt-1">
            Contact Support
          </Button>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="w-full rounded-lg">
            Save and exit
          </Button>
        </Link>
      </div>
    </div>
  )
}
