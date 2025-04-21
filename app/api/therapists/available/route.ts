import { NextResponse } from "next/server"
import { DatabaseService } from "@/services/database-service"

export async function GET() {
  try {
    const therapists = await DatabaseService.getAvailableTherapists()

    if (!therapists || therapists.length === 0) {
      // If no therapists exist, seed some mock data
      await seedMockTherapists()
      return NextResponse.json(await DatabaseService.getAvailableTherapists())
    }

    return NextResponse.json(therapists)
  } catch (error) {
    console.error("Error fetching available therapists:", error)
    return NextResponse.json({ error: "Failed to load available therapists" }, { status: 500 })
  }
}

// Helper function to seed mock therapists for demo purposes
async function seedMockTherapists() {
  const mockTherapists = [
    {
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
        "Dr. Johnson is a licensed clinical psychologist with over 12 years of experience helping individuals overcome anxiety, depression, and trauma. Her approach is collaborative, empathetic, and evidence-based.",
      practiceDescription:
        "I provide a safe and supportive environment where clients can explore their thoughts and feelings without judgment. Together, we'll develop practical strategies to help you achieve your goals and improve your well-being.",
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
        {
          day: "Friday",
          slots: ["10:00", "11:00", "14:00", "15:00"],
        },
      ],
      personalityTraits: ["Empathetic", "Patient", "Insightful", "Warm"],
      reviews: [
        {
          rating: 5,
          comment:
            "Dr. Johnson has been incredibly helpful in my journey with anxiety. Her approach is both professional and compassionate.",
          patientId: "patient-101",
          createdAt: new Date("2023-05-15"),
        },
        {
          rating: 5,
          comment:
            "I've seen several therapists over the years, and Dr. Johnson is by far the best. She really listens and provides practical strategies.",
          patientId: "patient-102",
          createdAt: new Date("2023-06-22"),
        },
      ],
      averageRating: 5.0,
      verificationStatus: "verified",
    },
    {
      userId: "user-t2",
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      profileImageUrl: "/placeholder.svg?height=400&width=400",
      gender: "male",
      age: 38,
      culturalBackground: "Asian American",
      languages: ["English", "Mandarin"],
      credentials: {
        degree: "Psy.D. in Clinical Psychology",
        licenseType: "Licensed Psychologist",
        licenseNumber: "PSY67890",
        licenseState: "NY",
        yearsOfExperience: 8,
      },
      specializations: ["Depression", "Anxiety", "Cultural Identity", "Life Transitions"],
      approaches: ["Psychodynamic Therapy", "Cognitive Behavioral Therapy", "Acceptance and Commitment Therapy"],
      biography:
        "Dr. Chen specializes in helping individuals navigate life transitions, cultural identity issues, and mood disorders. With 8 years of experience, he brings a unique perspective to therapy that integrates Eastern and Western approaches.",
      practiceDescription:
        "My practice focuses on creating a collaborative therapeutic relationship where we work together to understand patterns that may be contributing to your current challenges and develop strategies for growth and healing.",
      sessionTypes: ["video", "in-person"],
      sessionFees: {
        initial: 200,
        ongoing: 175,
      },
      acceptedInsurance: ["Blue Cross Blue Shield", "United Healthcare"],
      location: {
        address: "456 Wellness Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
      },
      availability: [
        {
          day: "Tuesday",
          slots: ["11:00", "12:00", "13:00", "17:00", "18:00"],
        },
        {
          day: "Thursday",
          slots: ["11:00", "12:00", "13:00", "17:00", "18:00"],
        },
        {
          day: "Friday",
          slots: ["14:00", "15:00", "16:00"],
        },
      ],
      personalityTraits: ["Thoughtful", "Calm", "Analytical", "Supportive"],
      reviews: [
        {
          rating: 5,
          comment: "Dr. Chen helped me work through a difficult career transition with insight and compassion.",
          patientId: "patient-201",
          createdAt: new Date("2023-04-10"),
        },
        {
          rating: 4,
          comment: "Very knowledgeable and professional. Helped me understand my anxiety patterns.",
          patientId: "patient-202",
          createdAt: new Date("2023-05-18"),
        },
      ],
      averageRating: 4.5,
      verificationStatus: "verified",
    },
    {
      userId: "user-t3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      profileImageUrl: "/placeholder.svg?height=400&width=400",
      gender: "female",
      age: 45,
      culturalBackground: "Hispanic",
      languages: ["English", "Spanish"],
      credentials: {
        degree: "Ph.D. in Clinical Psychology",
        licenseType: "Licensed Clinical Psychologist",
        licenseNumber: "PSY54321",
        licenseState: "NY",
        yearsOfExperience: 15,
      },
      specializations: ["Relationships", "Family Therapy", "Trauma", "Grief and Loss"],
      approaches: ["Family Systems Therapy", "Emotionally Focused Therapy", "Narrative Therapy"],
      biography:
        "Dr. Rodriguez has 15 years of experience working with individuals, couples, and families. She specializes in relationship issues, family dynamics, and helping people heal from trauma and loss.",
      practiceDescription:
        "I believe in the power of relationships to heal and transform. My approach focuses on understanding the patterns in your relationships and helping you create healthier connections with yourself and others.",
      sessionTypes: ["video", "in-person", "phone"],
      sessionFees: {
        initial: 190,
        ongoing: 160,
      },
      acceptedInsurance: ["Aetna", "Cigna", "Oscar"],
      location: {
        address: "789 Healing Street",
        city: "New York",
        state: "NY",
        zipCode: "10003",
      },
      availability: [
        {
          day: "Monday",
          slots: ["09:00", "10:00", "15:00", "16:00", "17:00"],
        },
        {
          day: "Wednesday",
          slots: ["12:00", "13:00", "14:00", "15:00"],
        },
        {
          day: "Thursday",
          slots: ["09:00", "10:00", "15:00", "16:00", "17:00"],
        },
      ],
      personalityTraits: ["Compassionate", "Direct", "Engaging", "Warm"],
      reviews: [
        {
          rating: 5,
          comment:
            "Dr. Rodriguez helped save our marriage. Her insights into our communication patterns were invaluable.",
          patientId: "patient-301",
          createdAt: new Date("2023-03-22"),
        },
        {
          rating: 5,
          comment:
            "After losing my father, Dr. Rodriguez helped me navigate the grief process with compassion and wisdom.",
          patientId: "patient-302",
          createdAt: new Date("2023-04-30"),
        },
      ],
      averageRating: 5.0,
      verificationStatus: "verified",
    },
  ]

  for (const therapist of mockTherapists) {
    await DatabaseService.createTherapist(therapist)
  }
}
