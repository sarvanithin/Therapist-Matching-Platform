import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real app, check if user is admin

    const therapist = await DatabaseService.getTherapistById(params.id)

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    return NextResponse.json(therapist)
  } catch (error) {
    console.error(`Error fetching therapist ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to load therapist" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real app, check if user is admin

    const data = await request.json()

    const updatedTherapist = await DatabaseService.updateTherapist(params.id, data)

    if (!updatedTherapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTherapist)
  } catch (error) {
    console.error(`Error updating therapist ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update therapist" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real app, check if user is admin

    const success = await DatabaseService.deleteTherapist(params.id)

    if (!success) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting therapist ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete therapist" }, { status: 500 })
  }
}
