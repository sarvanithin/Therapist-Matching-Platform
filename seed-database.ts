// Create this file at project root as seed-database.ts
import { MongoClient } from "mongodb";
import { mockTherapists, mockPatients } from "./lib/mock-data";

// Uses the environment variable for MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/therapymatch";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    
    // Seed therapists
    const therapistsCollection = db.collection("therapists");
    await therapistsCollection.deleteMany({});
    console.log("Cleared existing therapist data");
    
    // Add IDs to the mock therapists
    const therapistsWithIds = mockTherapists.map(therapist => ({
      ...therapist,
      _id: new ObjectId(), // MongoDB will generate this automatically if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const therapistResult = await therapistsCollection.insertMany(therapistsWithIds);
    console.log(`${therapistResult.insertedCount} therapists successfully inserted`);

    // Seed patients
    const patientsCollection = db.collection("patients");
    await patientsCollection.deleteMany({});
    console.log("Cleared existing patient data");
    
    // Add IDs to the mock patients
    const patientsWithIds = mockPatients.map(patient => ({
      ...patient,
      _id: new ObjectId(), // MongoDB will generate this automatically if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const patientResult = await patientsCollection.insertMany(patientsWithIds);
    console.log(`${patientResult.insertedCount} patients successfully inserted`);

    console.log("Database seeding completed successfully");
    return { therapists: therapistResult.insertedCount, patients: patientResult.insertedCount };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Add import for ObjectId
import { ObjectId } from "mongodb";

// Execute the seed function
seedDatabase()
  .then((result) => {
    console.log(`Seeding completed: ${result.therapists} therapists and ${result.patients} patients inserted`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });