// services/database-service-appointments.ts

import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
import type { Appointment } from "@/types/database";

const USE_MOCK_DATA = process.env.NODE_ENV === "development" && !process.env.USE_REAL_DB;
const mockAppointments: Appointment[] = [];

const getCollection = async (name: string) => {
  try {
    const client = await clientPromise;
    const db = client.db();
    return db.collection(name);
  } catch (e) {
    console.error("MongoDB connection failed:", e);
    return null;
  }
};

export class AppointmentService {
  static async createAppointment(appointmentData: Omit<Appointment, "id">): Promise<Appointment> {
    const collection = await getCollection("appointments");
    if (!collection) {
      const mockAppointment = { id: `mock-${Date.now()}`, ...appointmentData };
      mockAppointments.push(mockAppointment);
      return mockAppointment;
    }
    const result = await collection.insertOne(appointmentData);
    return { id: result.insertedId.toString(), ...appointmentData };
  }

  static async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    const collection = await getCollection("appointments");
    if (!collection) {
      return mockAppointments.filter(app => app.patientId === userId);
    }
    const appointments = await collection.find({ patientId: userId }).toArray();
    return appointments.map(app => ({ id: app._id.toString(), ...app }));
  }

  static async getAppointmentsByTherapistId(therapistId: string): Promise<Appointment[]> {
    const collection = await getCollection("appointments");
    if (!collection) {
      return mockAppointments.filter(app => app.therapistId === therapistId);
    }
    const appointments = await collection.find({ therapistId }).toArray();
    return appointments.map(app => ({ id: app._id.toString(), ...app }));
  }

  static async getAppointmentById(id: string): Promise<Appointment | null> {
    const collection = await getCollection("appointments");
    if (!collection) return mockAppointments.find(app => app.id === id) || null;
    let objectId;
    try { objectId = new ObjectId(id); } catch { return null; }
    const appointment = await collection.findOne({ _id: objectId });
    return appointment ? { id: appointment._id.toString(), ...appointment } : null;
  }

  static async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const collection = await getCollection("appointments");
    if (!collection) {
      const index = mockAppointments.findIndex(app => app.id === id);
      if (index !== -1) {
        mockAppointments[index] = { ...mockAppointments[index], ...updates };
        return mockAppointments[index];
      }
      return null;
    }
    let objectId;
    try { objectId = new ObjectId(id); } catch { return null; }
    const { id: _, ...updateData } = updates;
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result?.value ? { id: result.value._id.toString(), ...result.value } : null;
  }

  static async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    const collection = await getCollection("appointments");
    if (!collection) {
      const index = mockAppointments.findIndex(app => app.id === id);
      if (index !== -1) {
        mockAppointments[index].status = "cancelled";
        if (reason) mockAppointments[index].cancellationReason = reason;
        return true;
      }
      return false;
    }
    let objectId;
    try { objectId = new ObjectId(id); } catch { return false; }
    const updateData = { status: "cancelled", ...(reason && { cancellationReason: reason }) };
    const result = await collection.updateOne({ _id: objectId }, { $set: updateData });
    return result.modifiedCount === 1;
  }

  static async getUpcomingAppointments(userId: string, isTherapist = false): Promise<Appointment[]> {
    const collection = await getCollection("appointments");
    const now = new Date();
    if (!collection) {
      return mockAppointments.filter(app => {
        const userMatch = isTherapist ? app.therapistId === userId : app.patientId === userId;
        return userMatch && new Date(app.startTime) > now && app.status === "scheduled";
      });
    }
    const filter = {
      [isTherapist ? "therapistId" : "patientId"]: userId,
      startTime: { $gt: now.toISOString() },
      status: "scheduled",
    };
    const appointments = await collection.find(filter).sort({ startTime: 1 }).toArray();
    return appointments.map(app => ({ id: app._id.toString(), ...app }));
  }

  static async getPastAppointments(userId: string, isTherapist = false): Promise<Appointment[]> {
    const collection = await getCollection("appointments");
    const now = new Date();
    if (!collection) {
      return mockAppointments.filter(app => {
        const userMatch = isTherapist ? app.therapistId === userId : app.patientId === userId;
        return userMatch && new Date(app.startTime) <= now && app.status !== "cancelled";
      });
    }
    const filter = {
      [isTherapist ? "therapistId" : "patientId"]: userId,
      startTime: { $lte: now.toISOString() },
      status: { $ne: "cancelled" },
    };
    const appointments = await collection.find(filter).sort({ startTime: -1 }).toArray();
    return appointments.map(app => ({ id: app._id.toString(), ...app }));
  }
}
