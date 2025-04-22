import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

// Interface for available time slots
export interface TimeSlot {
  start: Date | string;
  end: Date | string;
  therapistId: string;
}

// Interface for appointment data
export interface AppointmentData {
  title: string;
  description: string;
  startTime: Date | string;
  endTime: Date | string;
  patientEmail: string;
  therapistEmail: string;
  location?: string;
  meetingLink?: string;
  appointmentType: 'video' | 'in-person' | 'phone';
}

/**
 * Create OAuth2 client with credentials
 */
export function createOAuth2Client(tokens?: { access_token: string, refresh_token?: string }): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );
  
  if (tokens) {
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }
  
  return oauth2Client;
}

/**
 * Get available time slots from a therapist's calendar
 */
export async function getAvailableTimeSlots(
  therapistId: string,
  therapistEmail: string,
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<TimeSlot[]> {
  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client({ access_token: accessToken });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Step 1: Get therapist's busy times
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: therapistEmail }],
      },
    });
    
    const busyTimes = freeBusyResponse.data.calendars?.[therapistEmail]?.busy || [];
    
    // Step 2: Get therapist availability from database (working hours)
    const therapist = await import('../services/database-service')
      .then(module => module.DatabaseService.getTherapistById(therapistId));
    
    if (!therapist) {
      throw new Error('Therapist not found');
    }
    
    // Step 3: Generate available slots based on working hours and busy times
    const availableSlots = generateAvailableSlots(
      startDate,
      endDate,
      therapist.availability || [],
      busyTimes.map(busy => ({
        start: new Date(busy.start || ''),
        end: new Date(busy.end || ''),
      })),
      therapistId
    );
    
    return availableSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
}

/**
 * Create a new appointment in Google Calendar
 */
export async function createCalendarAppointment(
  accessToken: string,
  appointmentData: AppointmentData
): Promise<{ eventId: string, htmlLink: string }> {
  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client({ access_token: accessToken });
    
    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Format event data
    const event: any = {
      summary: appointmentData.title,
      description: appointmentData.description,
      start: {
        dateTime: new Date(appointmentData.startTime).toISOString(),
        timeZone: 'America/New_York', // Consider making this dynamic based on user's timezone
      },
      end: {
        dateTime: new Date(appointmentData.endTime).toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: appointmentData.patientEmail },
        { email: appointmentData.therapistEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };
    
    // Add location for in-person appointments
    if (appointmentData.appointmentType === 'in-person' && appointmentData.location) {
      event.location = appointmentData.location;
    }
    
    // For video appointments, create a Google Meet link if not provided
    if (appointmentData.appointmentType === 'video') {
      if (appointmentData.meetingLink) {
        event.location = appointmentData.meetingLink;
      } else {
        event.conferenceData = {
          createRequest: {
            requestId: `therapy-match-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        };
      }
    }
    
    // Create the event
    const response = await calendar.events.insert({
      calendarId: appointmentData.therapistEmail,
      requestBody: event,
      conferenceDataVersion: 1, // Enable creation of Google Meet link
      sendUpdates: 'all', // Send email notifications to attendees
    });
    
    if (!response.data.id) {
      throw new Error('Failed to create calendar event');
    }
    
    return {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink || '',
    };
  } catch (error) {
    console.error('Error creating calendar appointment:', error);
    throw error;
  }
}

/**
 * Helper function to generate available time slots based on therapist availability and busy times
 */
function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  therapistAvailability: Array<{ day: string; slots: string[] }>,
  busyTimes: Array<{ start: Date; end: Date }>,
  therapistId: string
): TimeSlot[] {
  const availableSlots: TimeSlot[] = [];
  const currentDate = new Date(startDate);
  
  // Map day names to day of week numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMapping: Record<string, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
  };
  
  // Loop through each day in the date range
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    
    // Find therapist's availability for this day of the week
    const dayName = Object.keys(dayMapping).find(key => dayMapping[key] === dayOfWeek);
    
    if (!dayName) continue;
    
    const dayAvailability = therapistAvailability.find(avail => 
      avail.day.toLowerCase() === dayName.toLowerCase()
    );
    
    if (dayAvailability && dayAvailability.slots.length > 0) {
      // For each time slot in the therapist's availability
      for (const timeSlot of dayAvailability.slots) {
        // Parse time (format should be 'HH:MM')
        const [hours, minutes] = timeSlot.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes)) continue;
        
        // Create slot start and end times (1 hour sessions)
        const slotStart = new Date(currentDate);
        slotStart.setHours(hours, minutes, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + 1);
        
        // Skip slots in the past
        if (slotStart < new Date()) continue;
        
        // Check if this slot overlaps with any busy times
        const isOverlapping = busyTimes.some(busy => {
          return (
            (slotStart >= busy.start && slotStart < busy.end) ||
            (slotEnd > busy.start && slotEnd <= busy.end) ||
            (slotStart <= busy.start && slotEnd >= busy.end)
          );
        });
        
        // If not overlapping, add to available slots
        if (!isOverlapping) {
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
  
  // Sort by date/time
  return availableSlots.sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}