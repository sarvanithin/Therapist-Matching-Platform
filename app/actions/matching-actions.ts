"use server"

import { DatabaseService } from "@/services/database-service"
import { MatchingService } from "@/services/matching-service"
import type { MatchResult } from "@/types/database"

export async function getMatchResults(patientId: string): Promise<MatchResult[]> {
  try {
    return await DatabaseService.getMatchResults(patientId)
  } catch (error) {
    console.error("Error fetching match results:", error)
    return []
  }
}

export async function findMatches(patientId: string): Promise<MatchResult[]> {
  try {
    const patient = await DatabaseService.getPatientById(patientId)
    if (!patient) {
      throw new Error("Patient not found")
    }

    const therapists = await DatabaseService.getAvailableTherapists()
    const matchingService = new MatchingService()
    return await matchingService.findMatches(patient, therapists)
  } catch (error) {
    console.error("Error finding matches:", error)
    return []
  }
}
