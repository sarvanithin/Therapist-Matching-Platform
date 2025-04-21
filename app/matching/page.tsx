import { DatabaseService } from "@/services/database-service"
import { MatchingClient } from "@/components/matching-client"
import type { MatchResult } from "@/types/database"

export default async function MatchingPage() {
  // Fetch data on the server
  const patientId = "patient-123" // In a real app, get this from the session

  // Get match results from the database
  let matchResults: MatchResult[] = []
  try {
    matchResults = await DatabaseService.getMatchResults(patientId)
  } catch (error) {
    console.error("Error fetching match results:", error)
  }

  return <MatchingClient initialMatches={matchResults} />
}
