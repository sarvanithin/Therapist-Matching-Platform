const { MongoClient } = require('mongodb');

// MongoDB connection string with the correct cluster URL
const uri = "mongodb+srv://sarvanithin:Nithin@123@cluster1.xpsyr8e.mongodb.net/therapymatch?retryWrites=true&w=majority&appName=Cluster1";
const client = new MongoClient(uri);

// Define therapist data
const therapists = [
  {
    userId: "user-t1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
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
  // Add your custom therapist profile
  {
    userId: "user-custom",
    name: "Dr. Sarvan Nithin",
    email: "sarvanithin@gmail.com",
    profileImageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
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
      "Dr. Sarvan Nithin is a licensed clinical psychologist with 8 years of experience helping individuals overcome anxiety, depression, and stress.",
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
    reviews: [],
    averageRating: 5.0,
    verificationStatus: "verified",
    googleCalendarId: "sarvanithin@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedTherapists() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const therapistsCollection = db.collection("therapists");

    // Clear existing therapists
    await therapistsCollection.deleteMany({});
    console.log("Cleared existing therapist data");

    // Insert therapists into database
    const result = await therapistsCollection.insertMany(therapists);
    console.log(`${result.insertedCount} therapists successfully inserted`);

    return therapists;
  } catch (error) {
    console.error("Error seeding therapists:", error);
    throw error;
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the seed function
seedTherapists()
  .then(() => {
    console.log("Therapist seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Therapist seeding failed:", error);
    process.exit(1);
  });