"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function SignOutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-3">
                <LogOut className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sign Out</CardTitle>
            <CardDescription className="text-center">
              Are you sure you want to sign out of your account?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground text-center">
              You will need to sign in again to access your account.
            </p>
          </CardContent>
          <CardFooter>
            <div className="grid w-full gap-2">
              <Button onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
