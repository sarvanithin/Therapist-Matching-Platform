import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise
    const db = client.db("therapymatch")

    // Get database stats
    const stats = await db.stats()

    // Get collection names
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    return NextResponse.json({
      status: "connected",
      databaseName: db.databaseName,
      collections: collectionNames,
      stats,
    })
  } catch (error) {
    console.error("MongoDB connection test failed:", error)
    return NextResponse.json(
      {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
