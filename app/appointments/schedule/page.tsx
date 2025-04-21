"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentScheduler } from "@/components/appointment-scheduler"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Therapist {
  id: string
  name: string
  credentials: {
    licenseType: string
  }
  specializations: string[]
  sessionTypes: string[]
  sessionFees: {
    initial: number
    ongoing: number
  }
}

export default function ScheduleAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const therapistId = searchParams.get("therapistId")

  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!therapistId) {
      setError("No therapist ID provided")
      setIsLoading(false)
      return
    }

    async function fetchTherapist() {
      try {
        const response = await fetch(`/api/therapists/${therapistId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch therapist")
        }

        const data = await response.json()
        setTherapist(data)
      } catch (error) {
        console.error("Error fetching therapist:", error)
        setError("Failed to load therapist information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapist()
  }, [therapistId])

  if (isLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !therapist) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Failed to load therapist information"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/matching">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Therapist Matches
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/matching">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Therapist Matches
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{therapist.name}</CardTitle>
              <CardDescription>{therapist.credentials.licenseType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Specializations</h3>
                  <p className="text-sm text-muted-foreground">{therapist.specializations.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Session Types</h3>
                  <p className="text-sm text-muted-foreground">
                    {therapist.sessionTypes
                      .map((type) => (type === "video" ? "Video" : type === "in-person" ? "In-Person" : "Phone"))
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Session Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Initial: ${therapist.sessionFees.initial} / Ongoing: ${therapist.sessionFees.ongoing}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <AppointmentScheduler therapistId={therapistId} therapistName={therapist.name} />
        </div>
      </div>
    </div>
  )
}
