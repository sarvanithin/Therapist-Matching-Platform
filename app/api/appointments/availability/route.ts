import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DatabaseService } from "@/services/database-service";
import { getAvailableTimeSlots } from "@/lib/google-calendar-utils";

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get("therapistId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (!therapistId) {
      return NextResponse.json({ error: "Therapist ID is required" }, { status: 400 });
    }

    if (!startDateParam || !endDateParam) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (startDate >= endDate) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    // Get the therapist
    const therapist = await DatabaseService.getTherapistById(therapistId);

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    // If therapist has a Google Calendar ID and we have an access token, use Google Calendar
    if (therapist.googleCalendarId && session.accessToken) {
      try {
        // Get available slots from Google Calendar
        const availableSlots = await getAvailableTimeSlots(
          therapistId,
          therapist.googleCalendarId,
          session.accessToken,
          startDate,
          endDate
        );

        return NextResponse.json({ 
          availableSlots,
          source: "googleCalendar"
        });
      } catch (error) {
        console.error("Error fetching Google Calendar availability:", error);
        // Fall back to static availability if Google Calendar fails
      }
    }

    // If no Google Calendar integration, use the therapist's static availability
    const availableSlots = generateAvailableSlotsFromStaticSchedule(
      startDate,
      endDate,
      therapist.availability || [],
      therapistId
    );

    return NextResponse.json({ 
      availableSlots,
      source: "staticSchedule"
    });
  } catch (error) {
    console.error("Error fetching therapist availability:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// Helper function to generate available slots from static schedule
function generateAvailableSlotsFromStaticSchedule(
  startDate: Date,
  endDate: Date,
  therapistAvailability: Array<{ day: string; slots: string[] }>,
  therapistId: string
) {
  const availableSlots = [];
  const currentDate = new Date(startDate);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Loop through each day in the date range
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dayName = dayNames[dayOfWeek];

    // Find if the therapist is available on this day
    const dayAvailability = therapistAvailability.find((day) => day.day === dayName);

    if (dayAvailability) {
      // Generate slots for this day
      for (const timeSlot of dayAvailability.slots) {
        const [hour, minute] = timeSlot.split(":").map(Number);

        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, minute || 0, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + 1); // 1-hour appointments

        // Only include future slots
        if (slotStart > new Date()) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            therapistId,
          });
        }
      }
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableSlots;
}