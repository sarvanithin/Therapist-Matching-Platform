import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import type { Patient, Therapist, Match, MatchResult } from "@/types/database";
import { mockTherapists, mockPatients, mockMatches, generateMockMatchResults } from "@/lib/mock-data";
import "@/lib/server-only"; // Mark this as server-only

// Flag to determine if we should use mock data
const USE_MOCK_DATA = process.env.NODE_ENV === "development" && !process.env.USE_REAL_DB;

interface TherapistQueryOptions {
  page?: number;
  limit?: number;
  status?: "pending" | "verified" | "rejected";
  search?: string;
  specializations?: string[];
  sessionTypes?: string[];
  insurances?: string[];
  languages?: string[];
}

export class DatabaseService {
  // DATABASE INITIALIZATION
  private static async getCollection(collectionName: string) {
    if (USE_MOCK_DATA) {
      return null;
    }

    try {
      const client = await clientPromise;
      const db = client.db("therapymatch");
      return db.collection(collectionName);
    } catch (error) {
      console.error(`MongoDB connection error for collection ${collectionName}:`, error);
      // Return null to indicate connection failure
      return null;
    }
  }

  // THERAPIST METHODS WITH ENHANCED QUERY CAPABILITIES
  static async getAllTherapists(options: TherapistQueryOptions = {}): Promise<Therapist[]> {
    const collection = await this.getCollection("therapists");
    const { page = 1, limit = 10, status, search, specializations, sessionTypes, insurances, languages } = options;
    const skip = (page - 1) * limit;

    if (!collection) {
      console.log("Using mock data for getAllTherapists");
      let filtered = [...mockTherapists];
      
      // Apply filters to mock data
      if (status) {
        filtered = filtered.filter(t => t.verificationStatus === status);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(searchLower) || 
          t.email.toLowerCase().includes(searchLower) ||
          t.specializations.some(s => s.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply additional filters
      if (specializations?.length) {
        filtered = filtered.filter(t => 
          specializations.some(s => t.specializations.includes(s))
        );
      }
      
      if (sessionTypes?.length) {
        filtered = filtered.filter(t => 
          sessionTypes.some(s => t.sessionTypes.includes(s))
        );
      }
      
      if (insurances?.length) {
        filtered = filtered.filter(t => 
          insurances.some(i => t.acceptedInsurance.includes(i))
        );
      }
      
      if (languages?.length) {
        filtered = filtered.filter(t => 
          languages.some(l => t.languages.includes(l))
        );
      }
      
      // Paginate results
      return filtered.slice(skip, skip + limit) as unknown as Therapist[];
    }

    try {
      // Build query for MongoDB
      const query: any = {};
      
      if (status) {
        query.verificationStatus = status;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { specializations: { $elemMatch: { $regex: search, $options: 'i' } } }
        ];
      }
      
      if (specializations?.length) {
        query.specializations = { $in: specializations };
      }
      
      if (sessionTypes?.length) {
        query.sessionTypes = { $in: sessionTypes };
      }
      
      if (insurances?.length) {
        query.acceptedInsurance = { $in: insurances };
      }
      
      if (languages?.length) {
        query.languages = { $in: languages };
      }

      // Execute query with pagination
      const therapists = await collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      return therapists.map((therapist) => ({
        id: therapist._id.toString(),
        ...therapist,
      })) as unknown as Therapist[];
    } catch (e) {
      console.error("Error getting therapists:", e);
      return [];
    }
  }

  // COUNT THERAPISTS WITH FILTERS
  static async countTherapists(options: TherapistQueryOptions = {}): Promise<number> {
    const collection = await this.getCollection("therapists");
    const { status, search, specializations, sessionTypes, insurances, languages } = options;

    if (!collection) {
      console.log("Using mock data for countTherapists");
      let filtered = [...mockTherapists];
      
      // Apply filters to mock data (same as in getAllTherapists)
      if (status) {
        filtered = filtered.filter(t => t.verificationStatus === status);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(searchLower) || 
          t.email.toLowerCase().includes(searchLower) ||
          t.specializations.some(s => s.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply additional filters
      if (specializations?.length) {
        filtered = filtered.filter(t => 
          specializations.some(s => t.specializations.includes(s))
        );
      }
      
      if (sessionTypes?.length) {
        filtered = filtered.filter(t => 
          sessionTypes.some(s => t.sessionTypes.includes(s))
        );
      }
      
      if (insurances?.length) {
        filtered = filtered.filter(t => 
          insurances.some(i => t.acceptedInsurance.includes(i))
        );
      }
      
      if (languages?.length) {
        filtered = filtered.filter(t => 
          languages.some(l => t.languages.includes(l))
        );
      }
      
      return filtered.length;
    }

    try {
      // Build query for MongoDB (same as in getAllTherapists)
      const query: any = {};
      
      if (status) {
        query.verificationStatus = status;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { specializations: { $elemMatch: { $regex: search, $options: 'i' } } }
        ];
      }
      
      if (specializations?.length) {
        query.specializations = { $in: specializations };
      }
      
      if (sessionTypes?.length) {
        query.sessionTypes = { $in: sessionTypes };
      }
      
      if (insurances?.length) {
        query.acceptedInsurance = { $in: insurances };
      }
      
      if (languages?.length) {
        query.languages = { $in: languages };
      }

      // Count documents
      return await collection.countDocuments(query);
    } catch (e) {
      console.error("Error counting therapists:", e);
      return 0;
    }
  }

  // Keep existing methods...
  // Adding or overriding only the methods we need to enhance

  // Create therapist with improved error handling
  static async createTherapist(therapist: Omit<Therapist, "id" | "createdAt" | "updatedAt">): Promise<Therapist> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for createTherapist");
      // Create a mock therapist with an ID
      const mockTherapist = {
        id: `therapist-${Date.now()}`,
        ...therapist,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTherapists.push(mockTherapist as any);
      return mockTherapist as Therapist;
    }

    try {
      const newTherapist = {
        ...therapist,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newTherapist);

      if (!result.acknowledged) {
        throw new Error("Failed to insert therapist into database");
      }

      return {
        id: result.insertedId.toString(),
        ...newTherapist,
      } as Therapist;
    } catch (error) {
      console.error("Error creating therapist:", error);
      throw error; // Re-throw to allow API to handle error
    }
  }

  // Get therapist by ID with enhanced error handling
  static async getTherapistById(id: string): Promise<Therapist | null> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getTherapistById");
      const therapist = mockTherapists.find((t) => t.id === id);
      return (therapist as unknown as Therapist) || null;
    }

    try {
      // Check if id is a valid ObjectId
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        console.error("Invalid ObjectId format:", id);
        return null;
      }

      const therapist = await collection.findOne({ _id: objectId });

      if (!therapist) return null;

      return {
        id: therapist._id.toString(),
        ...therapist,
      } as unknown as Therapist;
    } catch (error) {
      console.error("Error getting therapist by ID:", error);
      return null;
    }
  }

  // Get therapist by email with better error handling
  static async getTherapistByEmail(email: string): Promise<Therapist | null> {
    if (!email) {
      return null;
    }

    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getTherapistByEmail");
      const therapist = mockTherapists.find((t) => t.email.toLowerCase() === email.toLowerCase());
      return (therapist as unknown as Therapist) || null;
    }

    try {
      const therapist = await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

      if (!therapist) return null;

      return {
        id: therapist._id.toString(),
        ...therapist,
      } as unknown as Therapist;
    } catch (error) {
      console.error("Error getting therapist by email:", error);
      return null;
    }
  }
  
  // Keep other patient, match, and remaining methods from the original DatabaseService...
}