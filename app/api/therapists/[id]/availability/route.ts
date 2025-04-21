import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { DatabaseService } from "@/services/database-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    if (!startDateParam || !endDateParam) {
      return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 })
    }

    const startDate = new Date(startDateParam)
    const endDate = new Date(endDateParam)

    // Get the therapist from the database
    const therapist = await DatabaseService.getTherapistById(params.id)

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    // Generate available slots based on therapist availability
    const availableSlots = generateAvailableSlots(startDate, endDate, therapist.availability || [], therapist)

    return NextResponse.json({ availableSlots })
  } catch (error) {
    console.error("Error fetching therapist availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

// Helper function to generate available slots based on therapist availability
function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  therapistAvailability: Array<{ day: string; slots: string[] }>,
  therapist: any,
) {
  const availableSlots = []
  const currentDate = new Date(startDate)
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Loop through each day in the date range
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    const dayName = dayNames[dayOfWeek]

    // Find if the therapist is available on this day
    const dayAvailability = therapistAvailability.find((day) => day.day === dayName)

    if (dayAvailability) {
      // Generate slots for this day
      for (const timeSlot of dayAvailability.slots) {
        const [hour, minute] = timeSlot.split(":").map(Number)

        const slotStart = new Date(currentDate)
        slotStart.setHours(hour, minute || 0, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setHours(slotStart.getHours() + 1) // 1-hour appointments

        // Only include future slots
        if (slotStart > new Date()) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            therapistId: therapist.id,
          })
        }
      }
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return availableSlots
}
