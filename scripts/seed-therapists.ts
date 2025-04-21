import { MongoClient } from "mongodb"
import { faker } from "@faker-js/faker"

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/therapymatch"
const client = new MongoClient(uri)

// Therapist specializations
const specializations = [
  "Anxiety",
  "Depression",
  "Trauma",
  "PTSD",
  "Relationships",
  "Family Therapy",
  "Addiction",
  "Grief and Loss",
  "Stress Management",
  "Self-Esteem",
  "Eating Disorders",
  "OCD",
  "Bipolar Disorder",
  "ADHD",
  "Career Counseling",
  "Life Transitions",
  "Identity Issues",
  "LGBTQ+ Issues",
  "Chronic Illness",
  "Anger Management",
]

// Therapeutic approaches
const approaches = [
  "Cognitive Behavioral Therapy (CBT)",
  "Psychodynamic Therapy",
  "Humanistic Therapy",
  "Mindfulness-Based Therapy",
  "Solution-Focused Therapy",
  "EMDR",
  "Family Systems Therapy",
  "Narrative Therapy",
  "Dialectical Behavior Therapy (DBT)",
  "Acceptance and Commitment Therapy (ACT)",
  "Gestalt Therapy",
  "Interpersonal Therapy",
  "Eclectic/Integrative Approach",
]

// Languages
const languages = [
  "English",
  "Spanish",
  "French",
  "Mandarin",
  "Cantonese",
  "Vietnamese",
  "Arabic",
  "Russian",
  "Portuguese",
  "German",
]

// Personality traits
const personalityTraits = [
  "Empathetic",
  "Patient",
  "Insightful",
  "Warm",
  "Analytical",
  "Compassionate",
  "Direct",
  "Supportive",
  "Calm",
  "Engaging",
  "Thoughtful",
  "Non-judgmental",
  "Authentic",
  "Attentive",
  "Respectful",
]

// Generate a random therapist profile
function generateTherapist(index: number) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const gender = faker.helpers.arrayElement(["male", "female", "non-binary"])
  const age = faker.number.int({ min: 30, max: 70 })

  // Select 2-5 random specializations
  const therapistSpecializations = faker.helpers.arrayElements(specializations, faker.number.int({ min: 2, max: 5 }))

  // Select 2-4 random approaches
  const therapistApproaches = faker.helpers.arrayElements(approaches, faker.number.int({ min: 2, max: 4 }))

  // Select 1-3 random languages
  const therapistLanguages = faker.helpers.arrayElements(languages, faker.number.int({ min: 1, max: 3 }))

  // Always include English
  if (!therapistLanguages.includes("English")) {
    therapistLanguages.push("English")
  }

  // Select 3-5 random personality traits
  const therapistPersonalityTraits = faker.helpers.arrayElements(
    personalityTraits,
    faker.number.int({ min: 3, max: 5 }),
  )

  // Generate random availability
  const availableDays = faker.helpers.arrayElements(
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    faker.number.int({ min: 3, max: 5 }),
  )

  const availability = availableDays.map((day) => {
    const slots = []
    const startHour = faker.number.int({ min: 8, max: 12 })
    const endHour = faker.number.int({ min: 13, max: 18 })

    for (let hour = startHour; hour <= endHour; hour++) {
      if (faker.datatype.boolean(0.7)) {
        // 70% chance to have this slot available
        slots.push(`${hour}:00`)
      }
      if (faker.datatype.boolean(0.5)) {
        // 50% chance to have half-hour slot
        slots.push(`${hour}:30`)
      }
    }

    return {
      day,
      slots,
    }
  })

  // Generate credentials
  const degrees = ["Ph.D. in Clinical Psychology", "Psy.D.", "M.A. in Counseling", "M.S.W.", "M.D. in Psychiatry"]
  const licenseTypes = [
    "Licensed Clinical Psychologist",
    "Licensed Marriage and Family Therapist",
    "Licensed Professional Counselor",
    "Licensed Clinical Social Worker",
  ]

  return {
    userId: `user-t${index}`,
    name: `Dr. ${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: "example.com" }).toLowerCase(),
    profileImageUrl: faker.image.avatar(),
    gender,
    age,
    culturalBackground: faker.helpers.arrayElement([
      "Western",
      "Asian American",
      "Hispanic",
      "African American",
      "Middle Eastern",
      "European",
      "South Asian",
    ]),
    languages: therapistLanguages,
    credentials: {
      degree: faker.helpers.arrayElement(degrees),
      licenseType: faker.helpers.arrayElement(licenseTypes),
      licenseNumber: `${faker.string.alpha(3).toUpperCase()}${faker.number.int({ min: 10000, max: 99999 })}`,
      licenseState: faker.location.state({ abbreviated: true }),
      yearsOfExperience: faker.number.int({ min: 3, max: 25 }),
    },
    specializations: therapistSpecializations,
    approaches: therapistApproaches,
    biography: faker.lorem.paragraphs(2),
    practiceDescription: faker.lorem.paragraph(),
    sessionTypes: faker.helpers.arrayElements(["video", "in-person", "phone"], faker.number.int({ min: 1, max: 3 })),
    sessionFees: {
      initial: faker.number.int({ min: 120, max: 250 }),
      ongoing: faker.number.int({ min: 100, max: 200 }),
    },
    acceptedInsurance: faker.helpers.arrayElements(
      ["Blue Cross Blue Shield", "Aetna", "Cigna", "United Healthcare", "Kaiser Permanente", "Medicare", "Medicaid"],
      faker.number.int({ min: 0, max: 5 }),
    ),
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
    },
    availability,
    personalityTraits: therapistPersonalityTraits,
    reviews: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      rating: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.paragraph(),
      patientId: `patient-${faker.string.uuid().substring(0, 8)}`,
      createdAt: faker.date.past(),
    })),
    averageRating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
    verificationStatus: "verified",
    googleCalendarId: `therapist${index}@example.com`, // This would be the actual Google Calendar ID in production
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

async function seedTherapists() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("therapymatch")
    const therapistsCollection = db.collection("therapists")

    // Clear existing therapists
    await therapistsCollection.deleteMany({})
    console.log("Cleared existing therapist data")

    // Generate 15 therapist profiles
    const therapists = Array.from({ length: 15 }, (_, i) => generateTherapist(i + 1))

    // Insert therapists into database
    const result = await therapistsCollection.insertMany(therapists)
    console.log(`${result.insertedCount} therapists successfully inserted`)

    return therapists
  } catch (error) {
    console.error("Error seeding therapists:", error)
    throw error
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedTherapists()
    .then(() => {
      console.log("Therapist seeding completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Therapist seeding failed:", error)
      process.exit(1)
    })
}

export { seedTherapists }
