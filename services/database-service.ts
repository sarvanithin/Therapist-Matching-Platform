import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import type { Patient, Therapist, Match, MatchResult } from "@/types/database";
import { mockTherapists, mockPatients, mockMatches, generateMockMatchResults } from "@/lib/mock-data";
import "@/lib/server-only"; // Mark this as server-only

// IMPORTANT: Set this to false to use real MongoDB data instead of mock data
const USE_MOCK_DATA = false;

export class DatabaseService {
  // DATABASE INITIALIZATION
  private static async getCollection(collectionName: string) {
    if (USE_MOCK_DATA) {
      return null;
    }
    try {
      const client = await clientPromise;
      const db = client.db();
      return db.collection(collectionName);
    } catch (error) {
      console.error(`MongoDB connection error for collection ${collectionName}:`, error);
      // Return null to indicate connection failure
      return null;
    }
  }

  // PATIENT METHODS
  static async createPatient(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
    const collection = await this.getCollection("patients");

    if (!collection) {
      console.log("Using mock data for createPatient");
      // Create a mock patient with an ID
      const mockPatient = {
        id: `patient-${Date.now()}`,
        ...patient,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPatients.push(mockPatient as any);
      return mockPatient as Patient;
    }

    const newPatient = {
      ...patient,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newPatient);

    return {
      id: result.insertedId.toString(),
      ...newPatient,
    } as Patient;
  }

  static async getPatientById(id: string): Promise<Patient | null> {
    const collection = await this.getCollection("patients");

    if (!collection) {
      console.log("Using mock data for getPatientById");
      const patient = mockPatients.find((p) => p.id === id);
      return patient || null;
    }

    try {
      let patient;
      
      // Check if id is a valid ObjectId
      if (ObjectId.isValid(id)) {
        patient = await collection.findOne({ _id: new ObjectId(id) });
      }
      
      // If not found by ObjectId, try finding by id field
      if (!patient) {
        patient = await collection.findOne({ id });
      }

      if (!patient) return null;

      return {
        id: patient._id.toString(),
        ...patient,
      } as unknown as Patient;
    } catch (e) {
      console.error("Error getting patient:", e);
      return null;
    }
  }

  static async getPatientByUserId(userId: string): Promise<Patient | null> {
    const collection = await this.getCollection("patients");

    if (!collection) {
      console.log("Using mock data for getPatientByUserId");
      const patient = mockPatients.find((p) => p.userId === userId);
      if (!patient) {
        // Create a mock patient for demo purposes
        const mockPatient = {
          id: `patient-${Date.now()}`,
          userId,
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
        };
        mockPatients.push(mockPatient as any);
        return mockPatient as Patient;
      }
      return patient;
    }

    try {
      const patient = await collection.findOne({ userId });

      if (!patient) return null;

      return {
        id: patient._id.toString(),
        ...patient,
      } as unknown as Patient;
    } catch (e) {
      console.error("Error getting patient by userId:", e);
      return null;
    }
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const collection = await this.getCollection("patients");

    if (!collection) {
      console.log("Using mock data for updatePatient");
      const index = mockPatients.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockPatients[index] = {
          ...mockPatients[index],
          ...updates,
          updatedAt: new Date(),
        };
        return mockPatients[index];
      }
      return null;
    }

    try {
      const updatedPatient = {
        ...updates,
        updatedAt: new Date(),
      };

      delete updatedPatient.id; // Remove id as it's stored as _id in MongoDB

      // Check if id is a valid ObjectId
      let filter = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { id };
      }

      await collection.updateOne(filter, { $set: updatedPatient });

      return this.getPatientById(id);
    } catch (e) {
      console.error("Error updating patient:", e);
      return null;
    }
  }

  // THERAPIST METHODS
  static async createTherapist(therapist: Omit<Therapist, "id" | "createdAt" | "updatedAt">): Promise<Therapist> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for createTherapist");
      const mockTherapist = {
        id: `therapist-${Date.now()}`,
        ...therapist,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTherapists.push(mockTherapist as any);
      return mockTherapist as Therapist;
    }

    const newTherapist = {
      ...therapist,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newTherapist);

    return {
      id: result.insertedId.toString(),
      ...newTherapist,
    } as Therapist;
  }

  static async getTherapistById(id: string): Promise<Therapist | null> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getTherapistById");
      const therapist = mockTherapists.find((t) => t.id === id);
      return (therapist as unknown as Therapist) || null;
    }

    try {
      let therapist;
      
      // Check if id is a valid ObjectId
      if (ObjectId.isValid(id)) {
        therapist = await collection.findOne({ _id: new ObjectId(id) });
      }
      
      // If not found by ObjectId, try finding by id field
      if (!therapist) {
        therapist = await collection.findOne({ id });
      }

      if (!therapist) return null;

      return {
        id: therapist._id.toString(),
        ...therapist,
      } as unknown as Therapist;
    } catch (e) {
      console.error("Error getting therapist:", e);
      return null;
    }
  }

  static async getAllTherapists(): Promise<Therapist[]> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getAllTherapists");
      return mockTherapists as unknown as Therapist[];
    }

    try {
      const therapists = await collection.find({}).toArray();

      return therapists.map((therapist) => ({
        id: therapist._id.toString(),
        ...therapist,
      })) as unknown as Therapist[];
    } catch (e) {
      console.error("Error getting all therapists:", e);
      return [];
    }
  }

  static async getAvailableTherapists(): Promise<Therapist[]> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getAvailableTherapists");
      return mockTherapists as unknown as Therapist[];
    }

    try {
      const therapists = await collection
        .find({
          verificationStatus: "verified",
        })
        .toArray();

      return therapists.map((therapist) => ({
        id: therapist._id.toString(),
        ...therapist,
      })) as unknown as Therapist[];
    } catch (e) {
      console.error("Error getting available therapists:", e);
      return [];
    }
  }

  static async updateTherapist(id: string, updates: Partial<Therapist>): Promise<Therapist | null> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for updateTherapist");
      const index = mockTherapists.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockTherapists[index] = {
          ...mockTherapists[index],
          ...updates,
          updatedAt: new Date(),
        };
        return mockTherapists[index] as unknown as Therapist;
      }
      return null;
    }

    try {
      const updatedTherapist = {
        ...updates,
        updatedAt: new Date(),
      };

      delete updatedTherapist.id; // Remove id as it's stored as _id in MongoDB

      // Check if id is a valid ObjectId
      let filter = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { id };
      }

      await collection.updateOne(filter, { $set: updatedTherapist });

      return this.getTherapistById(id);
    } catch (e) {
      console.error("Error updating therapist:", e);
      return null;
    }
  }

  static async deleteTherapist(id: string): Promise<boolean> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for deleteTherapist");
      const index = mockTherapists.findIndex((t) => t.id === id);
      if (index !== -1) {
        mockTherapists.splice(index, 1);
        return true;
      }
      return false;
    }

    try {
      // Check if id is a valid ObjectId
      let filter = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { id };
      }
      
      const result = await collection.deleteOne(filter);
      return result.deletedCount === 1;
    } catch (e) {
      console.error("Error deleting therapist:", e);
      return false;
    }
  }

  static async getTherapistByEmail(email: string): Promise<Therapist | null> {
    const collection = await this.getCollection("therapists");

    if (!collection) {
      console.log("Using mock data for getTherapistByEmail");
      const therapist = mockTherapists.find((t) => t.email === email);
      return (therapist as unknown as Therapist) || null;
    }

    try {
      const therapist = await collection.findOne({ email });

      if (!therapist) return null;

      return {
        id: therapist._id.toString(),
        ...therapist,
      } as unknown as Therapist;
    } catch (e) {
      console.error("Error getting therapist by email:", e);
      return null;
    }
  }

  // MATCH METHODS
  static async createMatch(match: Omit<Match, "id" | "createdAt" | "updatedAt">): Promise<Match> {
    const collection = await this.getCollection("matches");

    if (!collection) {
      console.log("Using mock data for createMatch");
      const mockMatch = {
        id: `match-${Date.now()}`,
        ...match,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMatches.push(mockMatch as any);
      return mockMatch as Match;
    }

    const newMatch = {
      ...match,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newMatch);

    return {
      id: result.insertedId.toString(),
      ...newMatch,
    } as Match;
  }

  static async getMatchById(id: string): Promise<Match | null> {
    const collection = await this.getCollection("matches");

    if (!collection) {
      console.log("Using mock data for getMatchById");
      const match = mockMatches.find((m) => m.id === id);
      return match || null;
    }

    try {
      let match;
      
      // Check if id is a valid ObjectId
      if (ObjectId.isValid(id)) {
        match = await collection.findOne({ _id: new ObjectId(id) });
      }
      
      // If not found by ObjectId, try finding by id field
      if (!match) {
        match = await collection.findOne({ id });
      }

      if (!match) return null;

      return {
        id: match._id.toString(),
        ...match,
      } as unknown as Match;
    } catch (e) {
      console.error("Error getting match:", e);
      return null;
    }
  }

  static async getMatchesByPatientId(patientId: string): Promise<Match[]> {
    const collection = await this.getCollection("matches");

    if (!collection) {
      console.log("Using mock data for getMatchesByPatientId");
      return mockMatches.filter((m) => m.patientId === patientId);
    }

    try {
      const matches = await collection.find({ patientId }).toArray();

      return matches.map((match) => ({
        id: match._id.toString(),
        ...match,
      })) as unknown as Match[];
    } catch (e) {
      console.error("Error getting matches by patientId:", e);
      return [];
    }
  }

  static async updateMatch(id: string, updates: Partial<Match>): Promise<Match | null> {
    const collection = await this.getCollection("matches");

    if (!collection) {
      console.log("Using mock data for updateMatch");
      const index = mockMatches.findIndex((m) => m.id === id);
      if (index !== -1) {
        mockMatches[index] = {
          ...mockMatches[index],
          ...updates,
          updatedAt: new Date(),
        };
        return mockMatches[index];
      }
      return null;
    }

    try {
      const updatedMatch = {
        ...updates,
        updatedAt: new Date(),
      };

      delete updatedMatch.id; // Remove id as it's stored as _id in MongoDB

      // Check if id is a valid ObjectId
      let filter = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { id };
      }

      await collection.updateOne(filter, { $set: updatedMatch });

      return this.getMatchById(id);
    } catch (e) {
      console.error("Error updating match:", e);
      return null;
    }
  }

  static async getMatchResults(patientId: string): Promise<MatchResult[]> {
    const collection = await this.getCollection("matches");

    if (!collection) {
      console.log("Using mock data for getMatchResults");
      return generateMockMatchResults(patientId);
    }

    // Get the therapists collection
    const therapistCollection = await this.getCollection("therapists");
    if (!therapistCollection) {
      return generateMockMatchResults(patientId);
    }

    try {
      const matches = await collection
        .find({
          patientId,
          status: { $in: ["pending", "accepted"] },
        })
        .toArray();

      if (!matches.length) return generateMockMatchResults(patientId);

      const matchResults: MatchResult[] = [];

      for (const match of matches) {
        let therapist;
        
        // Check if therapistId is a valid ObjectId
        if (ObjectId.isValid(match.therapistId)) {
          therapist = await therapistCollection.findOne({ _id: new ObjectId(match.therapistId) });
        }
        
        // If not found by ObjectId, try finding by id field
        if (!therapist) {
          therapist = await therapistCollection.findOne({ id: match.therapistId });
        }

        if (therapist) {
          matchResults.push({
            therapist: {
              id: therapist._id.toString(),
              ...therapist,
            } as unknown as Therapist,
            scores: match.scores,
            rationale: match.rationale,
            specialConsiderations: match.specialConsiderations,
          });
        }
      }

      // If no matches were found with therapists, generate mock matches
      if (matchResults.length === 0) {
        return generateMockMatchResults(patientId);
      }

      return matchResults;
    } catch (e) {
      console.error("Error getting match results:", e);
      return generateMockMatchResults(patientId);
    }
  }
  
  // APPOINTMENT METHODS
  static async createAppointment(appointment: any): Promise<any> {
    const collection = await this.getCollection("appointments");

    if (!collection) {
      console.log("Using mock data for createAppointment");
      return { id: `appointment-${Date.now()}`, ...appointment, createdAt: new Date() };
    }

    const newAppointment = {
      ...appointment,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newAppointment);

    return {
      id: result.insertedId.toString(),
      ...newAppointment,
    };
  }

  static async getAppointmentsByPatientId(patientId: string): Promise<any[]> {
    const collection = await this.getCollection("appointments");

    if (!collection) {
      console.log("Using mock data for getAppointmentsByPatientId");
      return [];
    }

    try {
      const appointments = await collection.find({ patientId }).toArray();

      return appointments.map((appointment) => ({
        id: appointment._id.toString(),
        ...appointment,
      }));
    } catch (e) {
      console.error("Error getting appointments by patientId:", e);
      return [];
    }
  }

  static async getAppointmentsByTherapistId(therapistId: string): Promise<any[]> {
    const collection = await this.getCollection("appointments");

    if (!collection) {
      console.log("Using mock data for getAppointmentsByTherapistId");
      return [];
    }

    try {
      const appointments = await collection.find({ therapistId }).toArray();

      return appointments.map((appointment) => ({
        id: appointment._id.toString(),
        ...appointment,
      }));
    } catch (e) {
      console.error("Error getting appointments by therapistId:", e);
      return [];
    }
  }

  static async updateAppointment(id: string, updates: any): Promise<any | null> {
    const collection = await this.getCollection("appointments");

    if (!collection) {
      console.log("Using mock data for updateAppointment");
      return { ...updates, id, updatedAt: new Date() };
    }

    try {
      const updatedAppointment = {
        ...updates,
        updatedAt: new Date(),
      };

      // Check if id is a valid ObjectId
      let filter = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { id };
      }

      await collection.updateOne(filter, { $set: updatedAppointment });

      const result = await collection.findOne(filter);
      
      if (!result) return null;
      
      return {
        id: result._id.toString(),
        ...result,
      };
    } catch (e) {
      console.error("Error updating appointment:", e);
      return null;
    }
  }
}