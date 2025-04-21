import { google } from "googleapis"
import type { OAuth2Client } from "google-auth-library"

// Initialize the OAuth2 client with your credentials
export function getOAuth2Client(): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  )

  return oauth2Client
}

// Get available time slots from a therapist's calendar
export async function getAvailableSlots(calendarId: string, accessToken: string, startDate: Date, endDate: Date) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  try {
    // Get busy times from the calendar
    const busyTimesResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
      },
    })

    const busySlots = busyTimesResponse.data.calendars?.[calendarId]?.busy || []

    // Generate available time slots based on therapist's working hours
    // and exclude busy times
    const availableSlots = generateAvailableSlots(startDate, endDate, busySlots)

    return availableSlots
  } catch (error) {
    console.error("Error fetching available slots:", error)
    throw error
  }
}

// Create a new appointment in the therapist's calendar
export async function createAppointment(
  calendarId: string,
  accessToken: string,
  appointment: {
    summary: string
    description: string
    startTime: Date
    endTime: Date
    patientEmail: string
    location?: string
  },
) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  try {
    const event = {
      summary: appointment.summary,
      description: appointment.description,
      start: {
        dateTime: appointment.startTime.toISOString(),
        timeZone: "America/New_York", // You might want to make this dynamic
      },
      end: {
        dateTime: appointment.endTime.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [{ email: appointment.patientEmail }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    }

    if (appointment.location) {
      event.location = appointment.location
    }

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: "all", // Send email notifications to attendees
    })

    return response.data
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

// Helper function to generate available time slots
function generateAvailableSlots(startDate: Date, endDate: Date, busySlots: Array<{ start: string; end: string }>) {
  const availableSlots = []
  const currentDate = new Date(startDate)

  // Loop through each day in the date range
  while (currentDate <= endDate) {
    // Skip weekends (0 = Sunday, 6 = Saturday)
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Define working hours (9 AM to 5 PM)
      const workStartHour = 9
      const workEndHour = 17

      // Generate 1-hour slots
      for (let hour = workStartHour; hour < workEndHour; hour++) {
        const slotStart = new Date(currentDate)
        slotStart.setHours(hour, 0, 0, 0)

        const slotEnd = new Date(currentDate)
        slotEnd.setHours(hour + 1, 0, 0, 0)

        // Check if this slot overlaps with any busy slot
        const isSlotBusy = busySlots.some((busySlot) => {
          const busyStart = new Date(busySlot.start)
          const busyEnd = new Date(busySlot.end)

          return (
            (slotStart >= busyStart && slotStart < busyEnd) ||
            (slotEnd > busyStart && slotEnd <= busyEnd) ||
            (slotStart <= busyStart && slotEnd >= busyEnd)
          )
        })

        if (!isSlotBusy) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          })
        }
      }
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return availableSlots
}
