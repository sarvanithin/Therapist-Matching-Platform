import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { DatabaseService } from "@/services/database-service"
import { mockAppointments } from "@/lib/mock-data"

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For demo purposes, return mock appointments
    const appointments = mockAppointments.filter((appointment) => appointment.patientEmail === session.user.email)

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { therapistId, startTime, endTime, notes } = data

    if (!therapistId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the therapist
    const therapist = await DatabaseService.getTherapistById(therapistId)

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    // Create a mock appointment
    const appointment = {
      id: `appointment-${Date.now()}`,
      patientId: session.user.id,
      patientEmail: session.user.email,
      patientName: session.user.name,
      therapistId,
      therapistName: therapist.name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "scheduled",
      sessionType: therapist.sessionTypes[0],
      location: therapist.location?.address,
      notes: notes || "",
      createdAt: new Date(),
    }

    // Add to mock appointments
    mockAppointments.push(appointment)

    // If this is your email, simulate Google Calendar integration
    if (therapist.email === "sarvanithin@gmail.com") {
      console.log("Creating Google Calendar event for:", appointment)
      // In a real app, this would create a Google Calendar event
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
