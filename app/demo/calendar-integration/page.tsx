"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar, Check, X, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function CalendarIntegrationDemo() {
  const { data: session, status } = useSession()
  const [therapist, setTherapist] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTherapist, setIsCreatingTherapist] = useState(false)
  const [isTestingCalendar, setIsTestingCalendar] = useState(false)
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    async function checkTherapistProfile() {
      if (status === "loading") return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/therapists/email?email=sarvanithin@gmail.com`)

        if (response.ok) {
          const data = await response.json()
          setTherapist(data)

          // Check if calendar is connected
          if (session?.user) {
            setCalendarConnected(true) // In a real app, we'd check for calendar scope in the token
          }
        }
      } catch (error) {
        console.error("Error checking therapist profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkTherapistProfile()
  }, [status, session])

  const handleCreateTherapist = async () => {
    setIsCreatingTherapist(true)

    try {
      const response = await fetch("/api/therapists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Dr. Sarvan Nithin",
          email: "sarvanithin@gmail.com",
          gender: "male",
          age: 35,
          culturalBackground: "South Asian",
          languages: ["English", "Tamil"],
          credentials: {
            degree: "Ph.D. in Psychology",
            licenseType: "Licensed Psychologist",
            licenseNumber: "PSY98765",
            licenseState: "CA",
            yearsOfExperience: 8,
          },
          specializations: ["Anxiety", "Depression", "Stress Management", "Work-Life Balance"],
          approaches: ["Cognitive Behavioral Therapy", "Mindfulness-Based Therapy", "Solution-Focused Therapy"],
          biography:
            "Dr. Nithin specializes in helping individuals manage stress, anxiety, and depression with a focus on work-life balance and personal growth.",
          sessionTypes: ["video", "in-person"],
          sessionFees: {
            initial: 200,
            ongoing: 175,
          },
          verificationStatus: "verified",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTherapist(data)
      } else {
        throw new Error("Failed to create therapist profile")
      }
    } catch (error) {
      console.error("Error creating therapist profile:", error)
    } finally {
      setIsCreatingTherapist(false)
    }
  }

  const handleTestCalendar = async () => {
    setIsTestingCalendar(true)

    try {
      // In a real implementation, this would check your actual calendar
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTestResult({
        success: true,
        message: "Successfully connected to Google Calendar! Your availability is now being synced.",
      })
    } catch (error) {
      console.error("Error testing calendar:", error)
      setTestResult({
        success: false,
        message: "Failed to connect to Google Calendar. Please check your permissions.",
      })
    } finally {
      setIsTestingCalendar(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Google Calendar Integration Demo</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Therapist Profile</CardTitle>
            <CardDescription>Your therapist profile status</CardDescription>
          </CardHeader>
          <CardContent>
            {therapist ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Profile Found</p>
                  <p className="text-sm text-green-700">
                    {therapist.name} ({therapist.email})
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-800">Profile Not Found</p>
                  <p className="text-sm text-amber-700">No therapist profile found for sarvanithin@gmail.com</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!therapist && (
              <Button onClick={handleCreateTherapist} disabled={isCreatingTherapist} className="w-full">
                {isCreatingTherapist ? <Spinner size="sm" className="mr-2" /> : null}
                {isCreatingTherapist ? "Creating Profile..." : "Create Therapist Profile"}
              </Button>
            )}

            {therapist && (
              <Button asChild className="w-full">
                <Link href={`/therapists/${therapist.id}`}>View Profile</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Calendar</CardTitle>
            <CardDescription>Connect your Google Calendar for availability</CardDescription>
          </CardHeader>
          <CardContent>
            {calendarConnected ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Calendar Connected</p>
                  <p className="text-sm text-green-700">Your Google Calendar is connected and syncing availability</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <X className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-amber-800">Calendar Not Connected</p>
                  <p className="text-sm text-amber-700">Connect your Google Calendar to sync your availability</p>
                </div>
              </div>
            )}

            {testResult && (
              <Alert
                className={`mt-4 ${testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <AlertTitle className={testResult.success ? "text-green-800" : "text-red-800"}>
                  {testResult.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className={testResult.success ? "text-green-700" : "text-red-700"}>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            {!calendarConnected ? (
              <Button onClick={handleTestCalendar} disabled={isTestingCalendar || !therapist} className="w-full">
                {isTestingCalendar ? <Spinner size="sm" className="mr-2" /> : <Calendar className="mr-2 h-4 w-4" />}
                {isTestingCalendar ? "Connecting..." : "Connect Google Calendar"}
              </Button>
            ) : (
              <Button onClick={handleTestCalendar} disabled={isTestingCalendar} className="w-full">
                {isTestingCalendar ? <Spinner size="sm" className="mr-2" /> : <Calendar className="mr-2 h-4 w-4" />}
                {isTestingCalendar ? "Testing..." : "Test Calendar Connection"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Schedule a Test Appointment</CardTitle>
          <CardDescription>Test the calendar integration by scheduling an appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This will create a test appointment in your Google Calendar to verify the integration is working correctly.
          </p>
        </CardContent>
        <CardFooter>
          <Button disabled={!calendarConnected || !therapist} className="w-full" asChild>
            <Link href={therapist ? `/therapists/${therapist.id}/schedule` : "#"}>Schedule Test Appointment</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
