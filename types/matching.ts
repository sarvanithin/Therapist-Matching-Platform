export interface ClassificationResponse {
  matches: Array<{
    therapistId: string
    scores: {
      clinicalMatch: number
      personalCompatibility: number
      culturalAlignment: number
      overallMatchScore: number
    }
    rationale: string
    specialConsiderations: string[]
  }>
}

export interface Preference {
  name: string
  weight: number
  value: string | string[] | number | boolean
}
