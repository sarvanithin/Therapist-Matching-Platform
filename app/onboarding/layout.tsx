import type React from "react"
import { OnboardingSidebar } from "@/components/onboarding-sidebar"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      <OnboardingSidebar />
      <main className="flex flex-col p-6 md:p-10">{children}</main>
    </div>
  )
}
