import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { addCustomTherapist } from "@/scripts/add-custom-therapist"

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const script = searchParams.get("script")

    if (!script) {
      return NextResponse.json({ error: "Script parameter is required" }, { status: 400 })
    }

    let result

    // Run the specified script
    switch (script) {
      case "add-custom-therapist":
        result = await addCustomTherapist()
        break
      default:
        return NextResponse.json({ error: "Unknown script" }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error running script:", error)
    return NextResponse.json({ error: "Failed to run script" }, { status: 500 })
  }
}
