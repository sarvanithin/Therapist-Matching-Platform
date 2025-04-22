import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DatabaseService } from "@/services/database-service";
import { MatchingService } from "@/services/matching-service";

// API endpoint to get matched therapists for a patient
export async function GET(request: Request) {
  try {
    // Get session information
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    // Allow overriding patient ID for testing, but normally use the session user ID
    const patientId = searchParams.get("patientId") || session.user.id;
    const refresh = searchParams.get("refresh") === "true";
    
    // Get patient information
    const patient = await DatabaseService.getPatientByUserId(patientId);
    
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found. Please complete your profile first." }, 
        { status: 404 }
      );
    }
    
    // Check if we should use cached results or regenerate matches
    let matchResults;
    
    if (!refresh) {
      // Try to get existing matches
      matchResults = await DatabaseService.getMatchResults(patient.id);
    }
    
    // If no matches or refresh requested, generate new matches
    if (!matchResults || matchResults.length === 0 || refresh) {
      // Get available therapists
      const therapists = await DatabaseService.getAvailableTherapists();
      
      if (!therapists || therapists.length === 0) {
        return NextResponse.json(
          { error: "No therapists available for matching" }, 
          { status: 404 }
        );
      }
      
      // Initialize matching service
      const matchingService = new MatchingService();
      
      // Find matches
      matchResults = await matchingService.findMatches(patient, therapists);
      
      // If still no matches, return error
      if (!matchResults || matchResults.length === 0) {
        return NextResponse.json(
          { error: "No suitable therapist matches found. Please adjust your preferences." }, 
          { status: 404 }
        );
      }
    }
    
    // Return matches with pagination info
    return NextResponse.json({
      matches: matchResults.slice(0, 10), // Limit to top 10 matches
      pagination: {
        total: matchResults.length,
        page: 1,
        pageSize: 10,
        totalPages: Math.ceil(matchResults.length / 10)
      }
    });
  } catch (error) {
    console.error("Error in matching API:", error);
    return NextResponse.json(
      { error: "Failed to find therapist matches", details: String(error) }, 
      { status: 500 }
    );
  }
}

// API endpoint to manually trigger matching for a specific patient
export async function POST(request: Request) {
  try {
    // Check for admin role in a real app
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || !["admin", "superadmin"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }
    
    // Get request body
    const data = await request.json();
    const { patientId } = data;
    
    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }
    
    // Get patient information
    const patient = await DatabaseService.getPatientById(patientId);
    
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    
    // Get available therapists
    const therapists = await DatabaseService.getAvailableTherapists();
    
    if (!therapists || therapists.length === 0) {
      return NextResponse.json({ error: "No therapists available for matching" }, { status: 404 });
    }
    
    // Initialize matching service
    const matchingService = new MatchingService();
    
    // Find matches
    const matchResults = await matchingService.findMatches(patient, therapists);
    
    if (!matchResults || matchResults.length === 0) {
      return NextResponse.json(
        { error: "No suitable therapist matches found for this patient" }, 
        { status: 404 }
      );
    }
    
    // Return matches
    return NextResponse.json({
      success: true,
      matches: matchResults,
      matchCount: matchResults.length
    });
  } catch (error) {
    console.error("Error triggering manual matching:", error);
    return NextResponse.json(
      { error: "Failed to perform matching", details: String(error) }, 
      { status: 500 }
    );
  }
}