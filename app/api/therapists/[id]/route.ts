import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const therapist = await DatabaseService.getTherapistById(params.id)

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    return NextResponse.json(therapist)
  } catch (error) {
    console.error("Error fetching therapist:", error)
    return NextResponse.json({ error: "Failed to fetch therapist" }, { status: 500 })
  }
}
