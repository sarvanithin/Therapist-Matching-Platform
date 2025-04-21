import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET(request: Request) {
  try {
    // In a real app, get the user from session
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    // }

    // For demo purposes, use a hardcoded ID
    const url = new URL(request.url)
    const patientId = url.searchParams.get("patientId") || "patient-123"

    const matchResults = await DatabaseService.getMatchResults(patientId)

    return NextResponse.json(matchResults)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real app, verify authentication here

    const newMatch = await DatabaseService.createMatch(data)

    return NextResponse.json(newMatch)
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
  }
}
