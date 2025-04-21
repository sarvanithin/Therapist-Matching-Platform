"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // In a real application, you would fetch this data from your API
  const profileData = {
    personal: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      age: "25-34",
      gender: "Male",
      address: "123 Main St, New York, NY 10001",
      birthday: "1990-05-15",
      isMinor: "No",
      relationshipStatus: "Married",
      employmentStatus: "Full-time",
      emergencyContact: "Jane Doe (Spouse) - (123) 555-7890",
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      cardNumber: "XXXX-XXXX-XXXX-1234",
      groupNumber: "GRP12345",
    },
    goals: {
      selected: ["Anxiety Management", "Stress Management", "Self-Esteem"],
      description:
        "I've been feeling overwhelmed with work and personal life. I'd like to develop better coping mechanisms for stress and anxiety, and work on building my self-confidence.",
    },
    preferences: {
      therapistGender: "No preference",
      therapistAge: "No preference",
      therapyApproach: "Cognitive Behavioral Therapy (CBT)",
      sessionFormat: "Video sessions",
    },
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "Evening (5pm - 9pm)",
      frequency: "Weekly",
    },
  }

  async function handleSubmit() {
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile completed!",
        description: "Your profile has been submitted. We'll match you with a therapist soon.",
      })

      // Navigate to the matching page
      router.push("/matching")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review Your Profile</h1>
        <p className="text-muted-foreground">Please review your information before submitting.</p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{profileData.personal.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{profileData.personal.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{profileData.personal.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="text-sm">{profileData.personal.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Birthday</dt>
                <dd className="text-sm">{profileData.personal.birthday}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Age Range</dt>
                <dd className="text-sm">{profileData.personal.age}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                <dd className="text-sm">{profileData.personal.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Minor</dt>
                <dd className="text-sm">{profileData.personal.isMinor}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Relationship Status</dt>
                <dd className="text-sm">{profileData.personal.relationshipStatus}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Employment Status</dt>
                <dd className="text-sm">{profileData.personal.employmentStatus}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Emergency Contact</dt>
                <dd className="text-sm">{profileData.personal.emergencyContact}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding")}>
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
            <CardDescription>Your insurance details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
                <dd className="text-sm">{profileData.insurance.provider}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Card Number</dt>
                <dd className="text-sm">{profileData.insurance.cardNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Group Number</dt>
                <dd className="text-sm">{profileData.insurance.groupNumber}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding")}>
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Therapy Goals</CardTitle>
            <CardDescription>What you want to achieve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Selected Goals</h4>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {profileData.goals.selected.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="mt-1 text-sm">{profileData.goals.description}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding/goals")}>
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Therapist Preferences</CardTitle>
            <CardDescription>Your ideal therapist</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Therapist Gender</dt>
                <dd className="text-sm">{profileData.preferences.therapistGender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Therapist Age</dt>
                <dd className="text-sm">{profileData.preferences.therapistAge}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Therapy Approach</dt>
                <dd className="text-sm">{profileData.preferences.therapyApproach}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Session Format</dt>
                <dd className="text-sm">{profileData.preferences.sessionFormat}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding/preferences")}>
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>When you can attend sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Available Days</dt>
                <dd className="text-sm">{profileData.availability.days.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Preferred Time</dt>
                <dd className="text-sm">{profileData.availability.time}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Session Frequency</dt>
                <dd className="text-sm">{profileData.availability.frequency}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding/availability")}>
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Submit?</CardTitle>
            <CardDescription>
              Once you submit your profile, our matching algorithm will find the best therapist for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              By submitting, you agree to our Terms of Service and Privacy Policy. You can edit your profile information
              at any time.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/onboarding/availability")}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
