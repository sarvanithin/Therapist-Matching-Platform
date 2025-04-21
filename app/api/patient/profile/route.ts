import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET() {
  try {
    // In a real application, you would get the user from the session
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    // }

    // For demo purposes, use a hardcoded user ID
    const userId = "user-123"

    const patient = await DatabaseService.getPatientByUserId(userId)

    if (!patient) {
      // For demo, return a mock patient if none exists
      return NextResponse.json(await createMockPatient(userId))
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error fetching patient profile:", error)
    return NextResponse.json({ error: "Failed to load patient profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real application, you would get the user from the session
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    // }

    // For demo purposes, use a hardcoded user ID
    const userId = "user-123"

    const existingPatient = await DatabaseService.getPatientByUserId(userId)

    if (existingPatient) {
      const updatedPatient = await DatabaseService.updatePatient(existingPatient.id, {
        ...data,
        userId,
      })
      return NextResponse.json(updatedPatient)
    } else {
      const newPatient = await DatabaseService.createPatient({
        ...data,
        userId,
      })
      return NextResponse.json(newPatient)
    }
  } catch (error) {
    console.error("Error updating patient profile:", error)
    return NextResponse.json({ error: "Failed to update patient profile" }, { status: 500 })
  }
}

// Helper function to create a mock patient for demo purposes
async function createMockPatient(userId: string) {
  const mockPatient = {
    userId,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 32,
    gender: "male",
    culturalBackground: "Western",
    preferredLanguages: ["English"],
    location: {
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    issues: ["Anxiety", "Depression", "Work Stress"],
    therapyGoals: ["Improve coping skills", "Reduce anxiety symptoms", "Better work-life balance"],
    treatmentHistory: [
      {
        previousTherapy: true,
        duration: "6 months",
        approaches: ["CBT"],
        reason: "Moved to a new city",
      },
    ],
    preferences: {
      therapistGender: "no-preference",
      therapistAgeRange: {
        min: 30,
        max: 60,
      },
      therapistExperience: "5+ years",
      therapyApproach: ["CBT", "Mindfulness"],
      sessionFormat: ["video", "in-person"],
      culturalFactors: [],
    },
    assessmentResults: {
      depressionScore: 12,
      anxietyScore: 18,
      stressScore: 20,
      wellbeingScore: 65,
    },
    insurance: "Blue Cross Blue Shield",
    availability: [
      {
        day: "Monday",
        slots: ["18:00", "19:00"],
      },
      {
        day: "Wednesday",
        slots: ["18:00", "19:00"],
      },
      {
        day: "Friday",
        slots: ["17:00", "18:00"],
      },
    ],
  }

  return await DatabaseService.createPatient(mockPatient)
}
