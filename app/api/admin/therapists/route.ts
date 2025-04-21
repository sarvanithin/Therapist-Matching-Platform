import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET() {
  try {
    // In a real app, check if user is admin
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.role === 'admin') {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    // }

    const therapists = await DatabaseService.getAllTherapists()

    return NextResponse.json(therapists)
  } catch (error) {
    console.error("Error fetching therapists:", error)
    return NextResponse.json({ error: "Failed to load therapists" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // In a real app, check if user is admin
    const data = await request.json()

    const newTherapist = await DatabaseService.createTherapist(data)

    return NextResponse.json(newTherapist)
  } catch (error) {
    console.error("Error creating therapist:", error)
    return NextResponse.json({ error: "Failed to create therapist" }, { status: 500 })
  }
}
