"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TherapistMatchingResults } from "@/components/therapist-matching-results"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, RotateCw, UserSearch, AlertTriangle } from "lucide-react"
import type { MatchResult } from "@/types/database"

interface MatchingClientProps {
  initialMatches: MatchResult[]
}

export function MatchingClient({ initialMatches }: MatchingClientProps) {
  const router = useRouter()
  const [matches, setMatches] = useState<MatchResult[]>(initialMatches)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("matches")
  const [matchingProgress, setMatchingProgress] = useState(100) // Start at 100% since we have initial matches

  // Handler for scheduling a session with a therapist
  function handleScheduleSession(therapistId: string) {
    router.push(`/appointments/schedule?therapistId=${therapistId}`)
  }

  // Handler for viewing a therapist's full profile
  function handleViewProfile(therapistId: string) {
    router.push(`/therapists/${therapistId}`)
  }

  // Handler for requesting new matches (after updating preferences)
  function handleRequestNewMatches() {
    router.push("/onboarding/preferences")
  }

  // Calculate profile completion percentage
  function getProfileCompletionPercentage(): number {
    // This would normally be calculated based on the user's profile
    return 75 // Example value
  }

  const profileCompletionPercentage = getProfileCompletionPercentage()

  return (
    <div className="container space-y-8 px-4 py-8 md:px-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 mb-2">
            AI-Powered Matching
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Therapist Matching</h1>
          <p className="text-muted-foreground">Find the perfect therapist for your unique needs</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg" onClick={handleRequestNewMatches}>
            <RotateCw className="mr-2 h-4 w-4" />
            Update Preferences
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Note</AlertTitle>
          <AlertDescription className="text-amber-700">{error}</AlertDescription>
        </Alert>
      )}

      {profileCompletionPercentage < 100 && (
        <Card className="mb-6 border-0 shadow-soft overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Complete Your Profile</CardTitle>
            <CardDescription>Enhance your matches by completing your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-bold">{profileCompletionPercentage}%</span>
            </div>
            <Progress
              value={profileCompletionPercentage}
              className="mb-4 h-2"
              indicatorClassName="bg-gradient-to-r from-primary to-accent"
            />
            <Button size="sm" className="rounded-lg shadow-soft" onClick={() => router.push("/onboarding")}>
              Continue Setup
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto rounded-lg p-1">
          <TabsTrigger value="matches" className="rounded-md">
            <UserSearch className="mr-2 h-4 w-4" />
            Recommended Matches
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="rounded-md">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4 animate-fade-in">
          <TherapistMatchingResults
            matches={matches}
            onScheduleSession={handleScheduleSession}
            onViewProfile={handleViewProfile}
            onRequestNewMatches={handleRequestNewMatches}
          />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4 animate-fade-in">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Schedule a Session</CardTitle>
              <CardDescription>Select a therapist above first, then schedule your session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-secondary p-6">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-medium mt-4 mb-2">No appointment selected</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Choose a therapist from your matches to schedule an appointment.
                </p>
                <Button variant="outline" className="rounded-lg" onClick={() => setActiveTab("matches")}>
                  View Matches
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
