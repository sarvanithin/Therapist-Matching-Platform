import { MongoClient } from "mongodb"
import { faker } from "@faker-js/faker"

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/therapymatch"
const client = new MongoClient(uri)

async function addCustomTherapist() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("therapymatch")
    const therapistsCollection = db.collection("therapists")

    // Check if therapist with this email already exists
    const existingTherapist = await therapistsCollection.findOne({ email: "sarvanithin@gmail.com" })

    if (existingTherapist) {
      console.log("Therapist with this email already exists. Updating profile...")
      await therapistsCollection.deleteOne({ email: "sarvanithin@gmail.com" })
    }

    // Create custom therapist profile
    const customTherapist = {
      userId: "user-custom",
      name: "Dr. Sarvan Nithin",
      email: "sarvanithin@gmail.com",
      profileImageUrl: faker.image.avatar(),
      gender: "male",
      age: 35,
      culturalBackground: "South Asian",
      languages: ["English", "Tamil", "Hindi"],
      credentials: {
        degree: "Ph.D. in Clinical Psychology",
        licenseType: "Licensed Clinical Psychologist",
        licenseNumber: "PSY12345",
        licenseState: "CA",
        yearsOfExperience: 8,
      },
      specializations: ["Anxiety", "Depression", "Stress Management", "Career Counseling", "Life Transitions"],
      approaches: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness-Based Therapy", "Solution-Focused Therapy"],
      biography:
        "Dr. Sarvan Nithin is a licensed clinical psychologist with 8 years of experience helping individuals overcome anxiety, depression, and stress. His approach is collaborative, empathetic, and evidence-based, focusing on practical strategies to improve mental well-being.",
      practiceDescription:
        "My practice focuses on creating a safe and supportive environment where clients can explore their thoughts and feelings without judgment. Together, we'll develop practical strategies to help you achieve your goals and improve your well-being.",
      sessionTypes: ["video", "in-person"],
      sessionFees: {
        initial: 180,
        ongoing: 150,
      },
      acceptedInsurance: ["Blue Cross Blue Shield", "Aetna", "Cigna"],
      location: {
        address: "123 Therapy Lane",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
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
      personalityTraits: ["Empathetic", "Patient", "Insightful", "Warm", "Analytical"],
      reviews: [
        {
          rating: 5,
          comment:
            "Dr. Nithin has been incredibly helpful in my journey with anxiety. His approach is both professional and compassionate.",
          patientId: "patient-101",
          createdAt: new Date("2023-05-15"),
        },
        {
          rating: 5,
          comment:
            "I've seen several therapists over the years, and Dr. Nithin is by far the best. He really listens and provides practical strategies.",
          patientId: "patient-102",
          createdAt: new Date("2023-06-22"),
        },
      ],
      averageRating: 5.0,
      verificationStatus: "verified",
      googleCalendarId: "sarvanithin@gmail.com", // This is the actual Google Calendar ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert therapist into database
    const result = await therapistsCollection.insertOne(customTherapist)
    console.log(`Therapist successfully inserted with ID: ${result.insertedId}`)

    return customTherapist
  } catch (error) {
    console.error("Error adding custom therapist:", error)
    throw error
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  addCustomTherapist()
    .then(() => {
      console.log("Custom therapist added successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Failed to add custom therapist:", error)
      process.exit(1)
    })
}

export { addCustomTherapist }
