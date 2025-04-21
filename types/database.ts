export interface Patient {
  id: string
  userId: string
  name: string
  email: string
  age?: number
  gender?: string
  culturalBackground?: string
  preferredLanguages?: string[]
  location?: {
    city: string
    state: string
    zipCode: string
  }
  issues?: string[] // Mental health concerns
  therapyGoals?: string[]
  treatmentHistory?: {
    previousTherapy: boolean
    duration?: string
    approaches?: string[]
    reason?: string
  }[]
  preferences?: {
    therapistGender?: string
    therapistAgeRange?: {
      min?: number
      max?: number
    }
    therapistExperience?: string
    therapyApproach?: string[]
    sessionFormat?: string[] // "in-person", "video", "phone"
    culturalFactors?: string[]
  }
  assessmentResults?: {
    depressionScore?: number
    anxietyScore?: number
    stressScore?: number
    wellbeingScore?: number
    [key: string]: number | undefined
  }
  insurance?: string
  availability?: Array<{
    day: string
    slots: string[]
  }>
  createdAt: Date
  updatedAt: Date
}

export interface Therapist {
  id: string
  userId: string
  name: string
  email: string
  profileImageUrl?: string
  gender?: string
  age?: number
  culturalBackground?: string
  languages: string[]
  credentials: {
    degree: string
    licenseType: string
    licenseNumber: string
    licenseState: string
    yearsOfExperience: number
  }
  specializations: string[] // Areas of expertise
  approaches: string[] // Therapeutic approaches
  biography: string
  practiceDescription?: string
  sessionTypes: string[] // "in-person", "video", "phone"
  sessionFees: {
    initial: number
    ongoing: number
  }
  acceptedInsurance: string[]
  location?: {
    address?: string
    city: string
    state: string
    zipCode: string
  }
  availability: Array<{
    day: string
    slots: string[]
  }>
  personalityTraits?: string[]
  reviews?: {
    rating: number
    comment?: string
    patientId: string
    createdAt: Date
  }[]
  averageRating?: number
  verificationStatus: "pending" | "verified" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface Match {
  id: string
  patientId: string
  therapistId: string
  status: "pending" | "accepted" | "rejected" | "completed"
  scores: {
    clinicalMatch: number
    personalCompatibility: number
    culturalAlignment: number
    overallMatchScore: number
  }
  rationale: string
  specialConsiderations?: string[]
  patientFeedback?: {
    rating: number
    comments?: string
    createdAt: Date
  }
  therapistFeedback?: {
    accepted: boolean
    comments?: string
    createdAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface MatchResult {
  therapist: Therapist
  scores: {
    clinicalMatch: number
    personalCompatibility: number
    culturalAlignment: number
    overallMatchScore: number
  }
  rationale: string
  specialConsiderations?: string[]
}
