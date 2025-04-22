import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DatabaseService } from "@/services/database-service";
import { createCalendarAppointment } from "@/lib/google-calendar-utils";
import { z } from "zod";

// Appointment schema for validation
const appointmentSchema = z.object({
  therapistId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  appointmentType: z.enum(["video", "in-person", "phone"]),
  notes: z.string().optional(),
  location: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    
    // Get appointments from database
    const appointments = await DatabaseService.getAppointmentsByUserId(session.user.id);
    
    if (!appointments || appointments.length === 0) {
      return NextResponse.json([]);
    }
    
    // Filter appointments based on query parameters
    let filteredAppointments = [...appointments];
    
    if (upcoming) {
      filteredAppointments = filteredAppointments.filter(
        appointment => new Date(appointment.startTime) > new Date()
      );
    }
    
    if (past) {
      filteredAppointments = filteredAppointments.filter(
        appointment => new Date(appointment.startTime) <= new Date()
      );
    }
    
    // Sort appointments by date (most recent first for past, soonest first for upcoming)
    filteredAppointments.sort((a, b) => {
      const aTime = new Date(a.startTime).getTime();
      const bTime = new Date(b.startTime).getTime();
      return past ? bTime - aTime : aTime - bTime;
    });
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    return NextResponse.json({
      appointments: paginatedAppointments,
      pagination: {
        total: filteredAppointments.length,
        page,
        pageSize: limit,
        totalPages: Math.ceil(filteredAppointments.length / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request data
    const data = await request.json();
    
    try {
      appointmentSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Invalid appointment data", 
          details: validationError.errors 
        }, { status: 400 });
      }
    }
    
    const { therapistId, startTime, endTime, appointmentType, notes, location } = data;

    // Validate time slot
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }
    
    if (start < new Date()) {
      return NextResponse.json({ error: "Cannot book appointments in the past" }, { status: 400 });
    }
    
    // Check if slot is still available
    const availabilityResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/appointments/availability?therapistId=${therapistId}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );
    
    if (!availabilityResponse.ok) {
      return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
    }
    
    const availability = await availabilityResponse.json();
    
    const isSlotAvailable = availability.availableSlots.some(
      (slot: any) => 
        new Date(slot.start).getTime() === start.getTime() && 
        new Date(slot.end).getTime() === end.getTime()
    );
    
    if (!isSlotAvailable) {
      return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    // Get the therapist
    const therapist = await DatabaseService.getTherapistById(therapistId);

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    // Create appointment record in database
    const appointment = {
      patientId: session.user.id,
      patientName: session.user.name || "Patient",
      patientEmail: session.user.email || "",
      therapistId,
      therapistName: therapist.name,
      therapistEmail: therapist.email,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      appointmentType,
      status: "scheduled",
      notes: notes || "",
      location: location || (appointmentType === "in-person" ? therapist.location?.address : ""),
      createdAt: new Date().toISOString(),
    };
    
    // If Google Calendar integration is available, create calendar event
    let calendarEvent = null;
    
    if (therapist.googleCalendarId && session.accessToken) {
      try {
        // Create appointment in Google Calendar
        calendarEvent = await createCalendarAppointment(
          session.accessToken,
          {
            title: `Therapy Session with ${therapist.name}`,
            description: `Therapy session with ${therapist.name}\n\n${notes || ""}`,
            startTime,
            endTime,
            patientEmail: session.user.email || "",
            therapistEmail: therapist.googleCalendarId,
            location: appointmentType === "in-person" ? location || therapist.location?.address || "" : "",
            appointmentType,
          }
        );
        
        // Add calendar event details to appointment record
        appointment.calendarEventId = calendarEvent.eventId;
        appointment.calendarLink = calendarEvent.htmlLink;
      } catch (calendarError) {
        console.error("Error creating calendar event:", calendarError);
        // Continue with appointment creation even if calendar fails
      }
    }
    
    // Save appointment to database
    const createdAppointment = await DatabaseService.createAppointment(appointment);
    
    return NextResponse.json({
      appointment: createdAppointment,
      calendarEvent
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}