import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    const client = await clientPromise
    const db = client.db("therapymatch")
    const therapistsCollection = db.collection("therapists")

    let query = {}

    // If email is provided, search by email
    if (email) {
      query = { email }
    }

    const therapists = await therapistsCollection.find(query).toArray()

    // Convert _id to string id for client-side use
    const formattedTherapists = therapists.map((therapist) => {
      const { _id, ...therapistData } = therapist
      return {
        id: _id.toString(),
        ...therapistData,
      }
    })

    // If searching by email, return the first match
    if (email && formattedTherapists.length > 0) {
      return NextResponse.json(formattedTherapists[0])
    }

    return NextResponse.json(formattedTherapists)
  } catch (error) {
    console.error("Error fetching therapists:", error)
    return NextResponse.json({ error: "Failed to fetch therapists" }, { status: 500 })
  }
}
