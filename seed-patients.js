const { MongoClient } = require('mongodb');

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
    preferences: {
      therapistGender: "no-preference",
      therapyApproach: ["CBT", "Mindfulness"],
      sessionFormat: ["video", "in-person"],
    },
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
    preferences: {
      therapistGender: "no-preference",
      therapyApproach: ["CBT", "Mindfulness", "Solution-Focused"],
      sessionFormat: ["video", "in-person"],
    },
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