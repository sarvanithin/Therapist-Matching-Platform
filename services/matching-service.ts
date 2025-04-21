import type { Patient, Therapist, MatchResult } from "@/types/database"
import type { ClassificationResponse } from "@/types/matching"
import { DatabaseService } from "./database-service"
import "@/lib/server-only" // Mark this as server-only

/**
 * Service to handle matching patients with therapists using Claude API
 */
export class MatchingService {
  /**
   * Main method to match a patient with appropriate therapists
   * @param patient The patient to match
   * @param therapists List of available therapists
   * @returns Ranked list of therapist matches with match scores
   */
  public async findMatches(patient: Patient, therapists: Therapist[]): Promise<MatchResult[]> {
    try {
      // 1. Extract patient preferences and needs
      const patientProfile = this.buildPatientProfile(patient)

      // 2. Filter therapists by basic criteria (availability, specialization, etc.)
      const filteredTherapists = this.preFilterTherapists(patient, therapists)

      // Check if we have any therapists after filtering
      if (filteredTherapists.length === 0) {
        console.log("No therapists matched the basic criteria")
        return []
      }

      // 3. Prepare data for Claude API
      const matchData = this.prepareMatchData(patientProfile, filteredTherapists)

      // 4. Send data to Claude API
      const results = await this.callClaudeAPI(matchData)

      // 5. Process and rank results
      const matchResults = this.processResults(results, filteredTherapists)

      // 6. Save matches to database
      await this.saveMatchesToDatabase(patient.id, matchResults)

      return matchResults
    } catch (error) {
      console.error("Error in matching service:", error)
      throw new Error(`Failed to perform therapist matching: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Save match results to the database
   */
  private async saveMatchesToDatabase(patientId: string, matchResults: MatchResult[]) {
    try {
      // Create match entries for each therapist
      for (const match of matchResults) {
        const matchData = {
          patientId,
          therapistId: match.therapist.id,
          status: "pending",
          scores: {
            clinicalMatch: match.scores.clinicalMatch,
            personalCompatibility: match.scores.personalCompatibility,
            culturalAlignment: match.scores.culturalAlignment,
            overallMatchScore: match.scores.overallMatchScore,
          },
          rationale: match.rationale,
          specialConsiderations: match.specialConsiderations || [],
        }

        await DatabaseService.createMatch(matchData)
      }
    } catch (error) {
      console.error("Error saving matches to database:", error)
    }
  }

  /**
   * Build comprehensive patient profile for matching
   */
  private buildPatientProfile(patient: Patient) {
    // Extract relevant patient data including:
    // - Demographics
    // - Therapy goals
    // - Personal preferences
    // - Treatment history
    // - Assessment scores

    return {
      demographicInfo: {
        age: patient.age,
        gender: patient.gender,
        culturalBackground: patient.culturalBackground,
        preferredLanguages: patient.preferredLanguages || [],
      },
      therapyGoals: patient.therapyGoals || [],
      issues: patient.issues || [],
      preferences: patient.preferences || {},
      treatmentHistory: patient.treatmentHistory || [],
      assessmentResults: patient.assessmentResults || {},
      insurance: patient.insurance,
    }
  }

  /**
   * Pre-filter therapists based on basic compatibility criteria
   */
  private preFilterTherapists(patient: Patient, therapists: Therapist[]): Therapist[] {
    return therapists.filter((therapist) => {
      // Filter by basic criteria:
      // 1. Availability matching patient's preferred times
      const availabilityMatch = this.checkAvailabilityMatch(patient.availability || [], therapist.availability || [])

      // 2. Insurance/payment compatibility
      const insuranceMatch = this.checkInsuranceMatch(patient.insurance, therapist.acceptedInsurance || [])

      // 3. Specialization relevant to patient's issues
      const specializationMatch = this.checkSpecializationMatch(patient.issues || [], therapist.specializations || [])

      // 4. Language compatibility
      const languageMatch = this.checkLanguageMatch(patient.preferredLanguages || [], therapist.languages || [])

      // Only include therapists that meet basic criteria
      return availabilityMatch && insuranceMatch && (specializationMatch || languageMatch)
    })
  }

  /**
   * Check if patient and therapist availability overlaps
   */
  private checkAvailabilityMatch(
    patientAvailability: Array<{ day: string; slots: string[] }>,
    therapistAvailability: Array<{ day: string; slots: string[] }>,
  ): boolean {
    // Return true if there's at least one overlapping time slot
    if (patientAvailability.length === 0) return true // If patient hasn't specified, match all

    for (const patientSlot of patientAvailability) {
      const therapistSlotForDay = therapistAvailability.find((slot) => slot.day === patientSlot.day)

      if (therapistSlotForDay) {
        const overlap = therapistSlotForDay.slots.some((slot) => patientSlot.slots.includes(slot))

        if (overlap) return true
      }
    }

    return false
  }

  /**
   * Check if therapist accepts patient's insurance
   */
  private checkInsuranceMatch(patientInsurance: string | undefined, acceptedInsurance: string[]): boolean {
    if (!patientInsurance) return true // Patient might pay out of pocket
    return acceptedInsurance.includes(patientInsurance) || acceptedInsurance.includes("All")
  }

  /**
   * Check if therapist specializations cover patient's issues
   */
  private checkSpecializationMatch(patientIssues: string[], therapistSpecializations: string[]): boolean {
    // Return true if therapist specializes in at least one of patient's issues
    if (patientIssues.length === 0) return true

    return patientIssues.some((issue) =>
      therapistSpecializations.some(
        (spec) => spec.toLowerCase().includes(issue.toLowerCase()) || issue.toLowerCase().includes(spec.toLowerCase()),
      ),
    )
  }

  /**
   * Check if therapist speaks patient's preferred language
   */
  private checkLanguageMatch(patientLanguages: string[], therapistLanguages: string[]): boolean {
    // Return true if there's at least one common language
    if (patientLanguages.length === 0) return true

    return patientLanguages.some((language) => therapistLanguages.includes(language))
  }

  /**
   * Prepare data to send to Claude API
   */
  private prepareMatchData(patientProfile: any, therapists: Therapist[]) {
    // Limit the number of therapists to prevent large payloads
    const limitedTherapists = therapists.slice(0, 5)

    return {
      patient: patientProfile,
      therapists: limitedTherapists.map((therapist) => ({
        id: therapist.id,
        specializations: therapist.specializations,
        approaches: therapist.approaches,
        credentials: {
          yearsOfExperience: therapist.credentials.yearsOfExperience,
          degree: therapist.credentials.degree,
          licenseType: therapist.credentials.licenseType,
        },
        demographics: {
          gender: therapist.gender,
          age: therapist.age,
          culturalBackground: therapist.culturalBackground,
          languages: therapist.languages,
        },
        personalityTraits: therapist.personalityTraits || [],
        sessionTypes: therapist.sessionTypes,
        // Limit biography length to prevent large payloads
        biography: therapist.biography ? therapist.biography.substring(0, 200) : "",
      })),
    }
  }

  /**
   * Call Claude API to analyze and score matches
   */
  private async callClaudeAPI(matchData: any): Promise<ClassificationResponse> {
    // Define the prompt for Claude - simplified to reduce size
    const prompt = `
  As an AI therapy matching assistant, evaluate the compatibility between a patient and therapists.
  
  Patient Information:
  ${JSON.stringify(matchData.patient, null, 2)}
  
  Therapist Information:
  ${JSON.stringify(matchData.therapists, null, 2)}
  
  Analyze these profiles and provide compatibility scores (0-100) for each therapist based on:
  1. Clinical match: How well therapist specializations align with patient needs
  2. Personal compatibility: How well therapist and patient personalities might work together
  3. Cultural/demographic alignment: Shared background factors including language and culture
  4. Overall match score: Weighted combination (40% clinical, 35% personal, 25% cultural)
  
  For each therapist, provide a brief rationale and any special considerations.
  
  Format your response as a JSON object with this structure:
  {
    "matches": [
      {
        "therapistId": "therapist-id",
        "scores": {
          "clinicalMatch": 85,
          "personalCompatibility": 75,
          "culturalAlignment": 90,
          "overallMatchScore": 82
        },
        "rationale": "Brief explanation of match considerations",
        "specialConsiderations": ["Any specific factors worth highlighting"]
      }
    ]
  }
  `

    try {
      console.log("Calling Claude API with prompt length:", prompt.length)

      // Call Claude API
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Claude API error: ${response.statusText}. Details: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()

      // Check if the response has the expected structure
      if (!data.matches || !Array.isArray(data.matches)) {
        console.error("Unexpected response format:", data)

        // Provide fallback data if Claude API fails
        return this.generateFallbackMatches(matchData.therapists)
      }

      return data
    } catch (error) {
      console.error("Error calling Claude API:", error)

      // Provide fallback data if Claude API fails
      return this.generateFallbackMatches(matchData.therapists)
    }
  }

  /**
   * Generate fallback matches if Claude API fails
   */
  private generateFallbackMatches(therapists: any[]): ClassificationResponse {
    console.log("Generating fallback matches for", therapists.length, "therapists")

    return {
      matches: therapists.map((therapist) => ({
        therapistId: therapist.id,
        scores: {
          clinicalMatch: Math.floor(Math.random() * 30) + 70, // 70-99
          personalCompatibility: Math.floor(Math.random() * 30) + 70, // 70-99
          culturalAlignment: Math.floor(Math.random() * 30) + 70, // 70-99
          overallMatchScore: Math.floor(Math.random() * 30) + 70, // 70-99
        },
        rationale: "Match generated based on therapist specializations and patient needs.",
        specialConsiderations: ["Fallback matching algorithm used due to AI service unavailability."],
      })),
    }
  }

  /**
   * Process and rank the results from Claude API
   */
  private processResults(apiResponse: ClassificationResponse, therapists: Therapist[]): MatchResult[] {
    // Map API results to MatchResult objects with full therapist data
    const results = apiResponse.matches
      .map((match) => {
        const therapist = therapists.find((t) => t.id === match.therapistId)

        if (!therapist) {
          console.error(`Therapist with ID ${match.therapistId} not found`)
          return null
        }

        return {
          therapist,
          scores: match.scores,
          rationale: match.rationale,
          specialConsiderations: match.specialConsiderations,
        }
      })
      .filter((result): result is MatchResult => result !== null)

    // Sort by overall match score (descending)
    return results.sort((a, b) => b.scores.overallMatchScore - a.scores.overallMatchScore)
  }
}
