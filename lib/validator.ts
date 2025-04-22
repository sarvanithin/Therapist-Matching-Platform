import { z } from "zod";

// Define Zod schema for therapist data validation
const therapistSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]).optional(),
  age: z.number().min(18).max(100).optional(),
  profileImageUrl: z.string().url().optional(),
  culturalBackground: z.string().optional(),
  
  languages: z.array(z.string()).min(1, { message: "At least one language is required" }),
  
  credentials: z.object({
    degree: z.string().min(2),
    licenseType: z.string().min(2),
    licenseNumber: z.string().min(2),
    licenseState: z.string().min(1),
    yearsOfExperience: z.number().min(0),
  }),
  
  specializations: z.array(z.string()).min(1, { message: "At least one specialization is required" }),
  approaches: z.array(z.string()).min(1, { message: "At least one therapeutic approach is required" }),
  
  biography: z.string().min(10),
  practiceDescription: z.string().optional(),
  
  sessionTypes: z.array(z.enum(["video", "in-person", "phone"])).min(1, { 
    message: "At least one session type is required" 
  }),
  
  sessionFees: z.object({
    initial: z.number().min(0),
    ongoing: z.number().min(0),
  }),
  
  acceptedInsurance: z.array(z.string()).optional(),
  
  location: z.object({
    address: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }).optional(),
  
  availability: z.array(z.object({
    day: z.enum([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ]),
    slots: z.array(z.string())
  })).optional(),
  
  personalityTraits: z.array(z.string()).optional(),
  googleCalendarId: z.string().optional(),
});

export function validateTherapistData(data: any) {
  try {
    // Parse and validate against schema
    therapistSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod validation errors
      const errorMessages = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return { success: false, errors: errorMessages };
    }
    
    // Handle unexpected errors
    return { 
      success: false, 
      errors: [{ path: "unknown", message: "Validation failed with unexpected error" }] 
    };
  }
}

// Additional schemas as needed for other entities (patients, appointments, etc.)