import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DatabaseService } from "@/services/database-service";

// GET a single therapist by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["admin", "superadmin"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const therapist = await DatabaseService.getTherapistById(params.id);

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    return NextResponse.json(therapist);
  } catch (error) {
    console.error(`Error fetching therapist ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to load therapist" }, { status: 500 });
  }
}

// PATCH to update therapist status or other fields
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["admin", "superadmin"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    // Get update data from request
    const data = await request.json();
    
    // Validate status if it's being updated
    if (data.verificationStatus) {
      if (!["pending", "verified", "rejected"].includes(data.verificationStatus)) {
        return NextResponse.json({ 
          error: "Invalid status value",
          details: "Status must be 'pending', 'verified', or 'rejected'"
        }, { status: 400 });
      }
    }

    // Update the therapist
    const updatedTherapist = await DatabaseService.updateTherapist(params.id, {
      ...data,
      updatedAt: new Date()
    });

    if (!updatedTherapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTherapist);
  } catch (error) {
    console.error(`Error updating therapist ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to update therapist" }, { status: 500 });
  }
}

// DELETE a therapist
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["admin", "superadmin"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    // Delete the therapist
    const success = await DatabaseService.deleteTherapist(params.id);

    if (!success) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting therapist ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to delete therapist" }, { status: 500 });
  }
}