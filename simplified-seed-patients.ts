import { MongoClient } from "mongodb";

// MongoDB connection string - replace with your actual connection string
const uri = "mongodb+srv://sarvanithin:Nithin%40123@therapistmatcher.mongodb.net/therapymatch?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Define patient data
const patients = [
  {
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
    treatmentHistory: [
      {
        previousTherapy: true,
        duration: "6 months",
        approaches: ["CBT"],
        reason: "Moved to a new city",
      },
    ],
    preferences: {
      therapistGender: "no-preference",
      therapistAgeRange: {
        min: 30,
        max: 60,
      },
      therapistExperience: "5+ years",
      therapyApproach: ["CBT", "Mindfulness"],
      sessionFormat: ["video", "in-person"],
      culturalFactors: [],
    },
    assessmentResults: {
      depressionScore: 12,
      anxietyScore: 18,
      stressScore: 20,
      wellbeingScore: 65,
    },
    insurance: "Blue Cross Blue Shield",
    availability: [
      {
        day: "Monday",
        slots: ["18:00", "19:00"],
      },
      {
        day: "Wednesday",
        slots: ["18:00", "19:00"],
      },
      {
        day: "Friday",
        slots: ["17:00", "18:00"],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "user-456",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    age: 28,
    gender: "female",
    culturalBackground: "Hispanic",
    preferredLanguages: ["English", "Spanish"],
    location: {
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    },
    issues: ["Relationship Issues", "Self-Esteem", "Life Transitions"],
    therapyGoals: ["Improve relationships", "Build self-confidence", "Navigate career change"],
    treatmentHistory: [],
    preferences: {
      therapistGender: "female",
      therapistAgeRange: {
        min: 35,
        max: 55,
      },
      therapistExperience: "10+ years",
      therapyApproach: ["Psychodynamic", "Family Systems"],
      sessionFormat: ["video"],
      culturalFactors: ["Hispanic culture understanding"],
    },
    assessmentResults: {
      depressionScore: 8,
      anxietyScore: 10,
      stressScore: 15,
      wellbeingScore: 75,
    },
    insurance: "Aetna",
    availability: [
      {
        day: "Tuesday",
        slots: ["12:00", "13:00", "17:00"],
      },
      {
        day: "Thursday",
        slots: ["11:00", "12:00", "18:00"],
      },
      {
        day: "Saturday",
        slots: ["10:00", "11:00"],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add your own user profile for testing
  {
    userId: "user-nithin",
    name: "Sarvan Nithin",
    email: "nithin@example.com",
    age: 30,
    gender: "male",
    culturalBackground: "South Asian",
    preferredLanguages: ["English", "Tamil"],
    location: {
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
    },
    issues: ["Anxiety", "Work Stress", "Life Balance"],
    therapyGoals: ["Reduce stress", "Better work-life integration", "Improved coping mechanisms"],
    treatmentHistory: [],
    preferences: {
      therapistGender: "no-preference",
      therapistAgeRange: {
        min: 30,
        max: 50,
      },
      therapistExperience: "5+ years",
      therapyApproach: ["CBT", "Mindfulness", "Solution-Focused"],
      sessionFormat: ["video", "in-person"],
      culturalFactors: ["South Asian cultural understanding"],
    },
    assessmentResults: {
      depressionScore: 8, 
      anxietyScore: 14,
      stressScore: 18,
      wellbeingScore: 70,
    },
    insurance: "Blue Cross Blue Shield",
    availability: [
      {
        day: "Monday",
        slots: ["10:00", "11:00", "14:00", "15:00"],
      },
      {
        day: "Wednesday",
        slots: ["09:00", "10:00", "14:00", "15:00"],
      },
      {
        day: "Friday",
        slots: ["10:00", "11:00", "14:00"],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function seedPatients() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const patientsCollection = db.collection("patients");

    // Clear existing patients
    await patientsCollection.deleteMany({});
    console.log("Cleared existing patient data");

    // Insert patients into database
    const result = await patientsCollection.insertMany(patients);
    console.log(`${result.insertedCount} patients successfully inserted`);

    return patients;
  } catch (error) {
    console.error("Error seeding patients:", error);
    throw error;
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the seed function
seedPatients()
  .then(() => {
    console.log("Patient seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Patient seeding failed:", error);
    process.exit(1);
  });