import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const therapist = await DatabaseService.getTherapistByEmail(email)

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    return NextResponse.json(therapist)
  } catch (error) {
    console.error("Error finding therapist by email:", error)
    return NextResponse.json({ error: "Failed to find therapist" }, { status: 500 })
  }
}
