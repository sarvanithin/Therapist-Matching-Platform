import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/therapymatch";
const client = new MongoClient(uri);

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
];

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
];

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
];

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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "user-t2",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: "user-t3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    profileImageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
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