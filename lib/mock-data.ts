import type { Patient, Therapist, Match, MatchResult } from "@/types/database"

// Mock therapist data for local development
export const mockTherapists: Therapist[] = [
  {
    id: "th-123456",
    userId: "user-t1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    profileImageUrl: "/placeholder.svg?height=400&width=400",
    gender: "female",
    age: 42,
    culturalBackground: "Western",
    languages: ["English", "Spanish"],
    credentials: {
      degree: "Ph.D. in Clinical Psychology",
      licenseType: "Licensed Clinical Psychologist",
      licenseNumber: "PSY12345",
      licenseState: "NY",
      yearsOfExperience: 12,
    },
    specializations: ["Anxiety", "Depression", "Trauma", "PTSD"],
    approaches: ["Cognitive Behavioral Therapy", "Mindfulness", "EMDR"],
    biography:
      "Dr. Johnson is a licensed clinical psychologist with over 12 years of experience helping individuals overcome anxiety, depression, and trauma.",
    practiceDescription:
      "I provide a safe and supportive environment where clients can explore their thoughts and feelings without judgment.",
    sessionTypes: ["video", "in-person"],
    sessionFees: {
      initial: 180,
      ongoing: 150,
    },
    acceptedInsurance: ["Blue Cross Blue Shield", "Aetna", "Cigna"],
    location: {
      address: "123 Therapy Lane",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    availability: [
      {
        day: "Monday",
        slots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      },
      {
        day: "Wednesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      },
    ],
    personalityTraits: ["Empathetic", "Patient", "Insightful", "Warm"],
    reviews: [],
    averageRating: 5.0,
    verificationStatus: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add your email as a therapist
  {
    id: "th-sarvan",
    userId: "user-sarvan",
    name: "Dr. Sarvan Nithin",
    email: "sarvanithin@gmail.com",
    profileImageUrl: "/placeholder.svg?height=400&width=400",
    gender: "male",
    age: 35,
    culturalBackground: "South Asian",
    languages: ["English", "Tamil"],
    credentials: {
      degree: "Ph.D. in Psychology",
      licenseType: "Licensed Psychologist",
      licenseNumber: "PSY98765",
      licenseState: "CA",
      yearsOfExperience: 8,
    },
    specializations: ["Anxiety", "Depression", "Stress Management", "Work-Life Balance"],
    approaches: ["Cognitive Behavioral Therapy", "Mindfulness-Based Therapy", "Solution-Focused Therapy"],
    biography:
      "Dr. Nithin specializes in helping individuals manage stress, anxiety, and depression with a focus on work-life balance and personal growth.",
    practiceDescription:
      "My practice focuses on creating a collaborative therapeutic relationship where we work together to develop strategies for growth and healing.",
    sessionTypes: ["video", "in-person"],
    sessionFees: {
      initial: 200,
      ongoing: 175,
    },
    acceptedInsurance: ["Blue Cross Blue Shield", "United Healthcare"],
    location: {
      address: "456 Wellness Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
    },
    availability: [
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      },
      {
        day: "Thursday",
        slots: ["13:00", "14:00", "15:00", "16:00", "17:00"],
      },
      {
        day: "Friday",
        slots: ["10:00", "11:00", "14:00"],
      },
    ],
    personalityTraits: ["Compassionate", "Analytical", "Supportive", "Patient"],
    reviews: [],
    averageRating: 4.9,
    verificationStatus: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
    googleCalendarId: "sarvanithin@gmail.com", // This is the actual Google Calendar ID
  },
]

// Mock patient data
export const mockPatients: Patient[] = [
  {
    id: "patient-123",
    userId: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 32,
    gender: "male",
    culturalBackground: "Western",
    preferredLanguages: ["English"],
    location: {
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    issues: ["Anxiety", "Depression", "Work Stress"],
    therapyGoals: ["Improve coping skills", "Reduce anxiety symptoms", "Better work-life balance"],
    preferences: {
      therapistGender: "no-preference",
      therapyApproach: ["CBT", "Mindfulness"],
      sessionFormat: ["video", "in-person"],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock match data
export const mockMatches: Match[] = []

// Generate mock match results
export function generateMockMatchResults(patientId: string): MatchResult[] {
  return mockTherapists.map((therapist) => ({
    therapist,
    scores: {
      clinicalMatch: Math.floor(Math.random() * 20) + 80, // 80-99
      personalCompatibility: Math.floor(Math.random() * 20) + 80, // 80-99
      culturalAlignment: Math.floor(Math.random() * 20) + 80, // 80-99
      overallMatchScore: Math.floor(Math.random() * 20) + 80, // 80-99
    },
    rationale: "This therapist's specializations align well with your needs.",
    specialConsiderations: ["Demo mode: Using mock data for matching."],
  }))
}

// Mock appointments
export const mockAppointments: any[] = []
