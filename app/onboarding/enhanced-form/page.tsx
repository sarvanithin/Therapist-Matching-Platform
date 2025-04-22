"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ProtectedRoute } from "@/components/protected-route";

// Define form schema for enhanced patient information
const formSchema = z.object({
  // Personal Information
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  age: z.string().min(1, { message: "Age range is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  culturalBackground: z.string().optional(),
  preferredLanguages: z.array(z.string()).min(1, { message: "At least one language is required" }),
  
  // Location Information
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "ZIP code is required" }),
  
  // Therapy Needs
  issues: z.array(z.string()).min(1, { message: "Select at least one issue" }),
  therapyGoals: z.array(z.string()).min(1, { message: "Select at least one goal" }),
  goalDescription: z.string().min(10, { message: "Please provide a brief description of your goals" }),
  
  // Previous Treatment
  previousTherapy: z.boolean().default(false),
  previousDuration: z.string().optional(),
  previousApproaches: z.array(z.string()).optional(),
  endReason: z.string().optional(),
  
  // Preferences
  therapistGender: z.string(),
  therapistMinAge: z.string().optional(),
  therapistMaxAge: z.string().optional(),
  therapistExperience: z.string(),
  approachPreferences: z.array(z.string()).min(1, { message: "Select at least one approach" }),
  sessionFormat: z.array(z.string()).min(1, { message: "Select at least one format" }),
  culturalFactors: z.array(z.string()).optional(),
  
  // Scheduling
  availableDays: z.array(z.string()).min(1, { message: "Select at least one day" }),
  preferredTimeOfDay: z.string().min(1, { message: "Select preferred time" }),
  sessionFrequency: z.string().min(1, { message: "Select session frequency" }),
  
  // Insurance
  insurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

const mentalHealthIssues = [
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Depression" },
  { id: "stress", label: "Stress" },
  { id: "trauma", label: "Trauma" },
  { id: "ptsd", label: "PTSD" },
  { id: "grief", label: "Grief & Loss" },
  { id: "relationships", label: "Relationship Issues" },
  { id: "self-esteem", label: "Self-Esteem" },
  { id: "life-transitions", label: "Life Transitions" },
  { id: "burnout", label: "Burnout" },
  { id: "identity", label: "Identity Issues" },
  { id: "addiction", label: "Addiction" },
  { id: "ocd", label: "OCD" },
  { id: "eating-disorders", label: "Eating Disorders" },
  { id: "anger", label: "Anger Management" },
  { id: "bipolar", label: "Bipolar Disorder" },
  { id: "schizophrenia", label: "Schizophrenia" },
  { id: "adhd", label: "ADHD" },
  { id: "autism", label: "Autism" },
  { id: "other", label: "Other" },
];

const therapyGoals = [
  { id: "coping-skills", label: "Develop Coping Skills" },
  { id: "reduce-anxiety", label: "Reduce Anxiety" },
  { id: "reduce-depression", label: "Reduce Depression" },
  { id: "process-trauma", label: "Process Trauma" },
  { id: "improve-relationships", label: "Improve Relationships" },
  { id: "boost-confidence", label: "Boost Self-Confidence" },
  { id: "career-goals", label: "Achieve Career Goals" },
  { id: "work-life-balance", label: "Improve Work-Life Balance" },
  { id: "grief-processing", label: "Process Grief" },
  { id: "personal-growth", label: "Personal Growth" },
  { id: "parenting-skills", label: "Improve Parenting Skills" },
  { id: "communication", label: "Enhance Communication" },
  { id: "stress-management", label: "Stress Management" },
  { id: "decision-making", label: "Improve Decision Making" },
  { id: "emotional-regulation", label: "Emotional Regulation" },
];

const therapeuticApproaches = [
  { id: "cbt", label: "Cognitive Behavioral Therapy (CBT)" },
  { id: "dbt", label: "Dialectical Behavior Therapy (DBT)" },
  { id: "psychodynamic", label: "Psychodynamic Therapy" },
  { id: "humanistic", label: "Humanistic Therapy" },
  { id: "mindfulness", label: "Mindfulness-Based Therapy" },
  { id: "emdr", label: "EMDR Therapy" },
  { id: "solution-focused", label: "Solution-Focused Therapy" },
  { id: "narrative", label: "Narrative Therapy" },
  { id: "family-systems", label: "Family Systems Therapy" },
  { id: "acceptance", label: "Acceptance & Commitment Therapy (ACT)" },
  { id: "psychoanalytic", label: "Psychoanalytic Therapy" },
  { id: "integrative", label: "Integrative Approach" },
  { id: "no-preference", label: "No Preference" },
];

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "mandarin", label: "Mandarin" },
  { id: "cantonese", label: "Cantonese" },
  { id: "vietnamese", label: "Vietnamese" },
  { id: "tagalog", label: "Tagalog" },
  { id: "korean", label: "Korean" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
  { id: "german", label: "German" },
  { id: "hindi", label: "Hindi" },
  { id: "bengali", label: "Bengali" },
  { id: "portuguese", label: "Portuguese" },
  { id: "japanese", label: "Japanese" },
  { id: "other", label: "Other" },
];

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const sessionFormats = [
  { id: "video", label: "Video Sessions" },
  { id: "in-person", label: "In-Person Sessions" },
  { id: "phone", label: "Phone Sessions" },
];

const culturalFactors = [
  { id: "lgbtq", label: "LGBTQ+ Affirmative" },
  { id: "religious", label: "Religious/Spiritual Understanding" },
  { id: "racial", label: "Racial/Ethnic Understanding" },
  { id: "disability", label: "Disability Competence" },
  { id: "immigration", label: "Immigration Experience" },
  { id: "military", label: "Military/Veteran Experience" },
];

// Helper function to generate time slots based on time of day preference
function getTimeSlots(timeOfDay: string): string[] {
  switch (timeOfDay) {
    case "morning":
      return ["08:00", "09:00", "10:00", "11:00"];
    case "afternoon":
      return ["12:00", "13:00", "14:00", "15:00", "16:00"];
    case "evening":
      return ["17:00", "18:00", "19:00", "20:00"];
    case "flexible":
      return ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    default:
      return ["09:00", "13:00", "17:00"]; // Default to one morning, afternoon, and evening slot
  }
}

export default function EnhancedPatientForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate progress percentage based on current step
  const progressPercentage = Math.round((currentStep / 6) * 100);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      culturalBackground: "",
      preferredLanguages: ["english"],
      city: "",
      state: "",
      zipCode: "",
      issues: [],
      therapyGoals: [],
      goalDescription: "",
      previousTherapy: false,
      previousDuration: "",
      previousApproaches: [],
      endReason: "",
      therapistGender: "no-preference",
      therapistMinAge: "",
      therapistMaxAge: "",
      therapistExperience: "no-preference",
      approachPreferences: [],
      sessionFormat: [],
      culturalFactors: [],
      availableDays: [],
      preferredTimeOfDay: "",
      sessionFrequency: "",
      insurance: "",
      insuranceNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Format the data for the API
      const formattedData = {
        userId: "user-123", // In production, get from session
        name: values.name,
        email: values.email,
        age: parseInt(values.age.split("-")[0]) || 18,
        gender: values.gender,
        culturalBackground: values.culturalBackground,
        preferredLanguages: values.preferredLanguages,
        location: {
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        issues: values.issues,
        therapyGoals: values.therapyGoals,
        therapyGoalDescription: values.goalDescription,
        treatmentHistory: [{
          previousTherapy: values.previousTherapy,
          duration: values.previousDuration,
          approaches: values.previousApproaches,
          reason: values.endReason,
        }],
        preferences: {
          therapistGender: values.therapistGender,
          therapistAgeRange: {
            min: values.therapistMinAge ? parseInt(values.therapistMinAge) : undefined,
            max: values.therapistMaxAge ? parseInt(values.therapistMaxAge) : undefined,
          },
          therapistExperience: values.therapistExperience,
          therapyApproach: values.approachPreferences,
          sessionFormat: values.sessionFormat,
          culturalFactors: values.culturalFactors,
        },
        availability: values.availableDays.map(day => ({
          day: day.charAt(0).toUpperCase() + day.slice(1),
          slots: getTimeSlots(values.preferredTimeOfDay),
        })),
        sessionFrequency: values.sessionFrequency,
        insurance: values.insurance,
        insuranceNumber: values.insuranceNumber,
      };
      
      // Make API request
      const response = await fetch("/api/patient/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      
      // Show success toast
      toast({
        title: "Profile saved successfully!",
        description: "Your profile has been saved and we're finding therapist matches for you.",
      });
      
      // Redirect to matching page
      router.push("/matching");
    } catch (error) {
      console.error("Error saving profile:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "There was an error saving your profile. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to go to next step
  const nextStep = () => {
    // Validate the current step's fields before proceeding
    if (currentStep === 1) {
      const personalInfoFields = ["name", "email", "phone", "age", "gender", "preferredLanguages", "city", "state", "zipCode"];
      const isValid = personalInfoFields.every(field => form.getFieldState(field as any).isDirty && !form.getFieldState(field as any).error);
      
      if (!isValid) {
        form.trigger(personalInfoFields as any);
        return;
      }
    } else if (currentStep === 2) {
      const therapyNeedsFields = ["issues", "therapyGoals", "goalDescription"];
      const isValid = therapyNeedsFields.every(field => form.getFieldState(field as any).isDirty && !form.getFieldState(field as any).error);
      
      if (!isValid) {
        form.trigger(therapyNeedsFields as any);
        return;
      }
    } else if (currentStep === 3 && form.getValues("previousTherapy")) {
      const treatmentHistoryFields = ["previousDuration", "endReason"];
      const isValid = treatmentHistoryFields.every(field => form.getFieldState(field as any).isDirty && !form.getFieldState(field as any).error);
      
      if (!isValid) {
        form.trigger(treatmentHistoryFields as any);
        return;
      }
    } else if (currentStep === 4) {
      const preferencesFields = ["therapistGender", "therapistExperience", "approachPreferences", "sessionFormat"];
      const isValid = preferencesFields.every(field => form.getFieldState(field as any).isDirty && !form.getFieldState(field as any).error);
      
      if (!isValid) {
        form.trigger(preferencesFields as any);
        return;
      }
    } else if (currentStep === 5) {
      const schedulingFields = ["availableDays", "preferredTimeOfDay", "sessionFrequency"];
      const isValid = schedulingFields.every(field => form.getFieldState(field as any).isDirty && !form.getFieldState(field as any).error);
      
      if (!isValid) {
        form.trigger(schedulingFields as any);
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  // Function to go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Complete Your Therapy Profile</h1>
          <p className="text-muted-foreground mt-2">Help us match you with the perfect therapist for your needs</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-primary to-accent"
          />
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Therapy Needs"}
                  {currentStep === 3 && "Previous Treatment"}
                  {currentStep === 4 && "Therapist Preferences"}
                  {currentStep === 5 && "Scheduling"}
                  {currentStep === 6 && "Review & Submit"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about yourself so we can get to know you better"}
                  {currentStep === 2 && "What brings you to therapy and what you hope to achieve"}
                  {currentStep === 3 && "Your experience with therapy in the past"}
                  {currentStep === 4 && "Your ideal therapist and approach to therapy"}
                  {currentStep === 5 && "When you're available for therapy sessions"}
                  {currentStep === 6 && "Review your information before submitting"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25-34">25-34</SelectItem>
                                <SelectItem value="35-44">35-44</SelectItem>
                                <SelectItem value="45-54">45-54</SelectItem>
                                <SelectItem value="55-64">55-64</SelectItem>
                                <SelectItem value="65+">65+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="culturalBackground"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cultural Background (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Hispanic, Asian American, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            This helps us find therapists who understand your cultural context
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredLanguages"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Preferred Languages</FormLabel>
                            <FormDescription>
                              Select all languages you're comfortable speaking in therapy
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {languages.map((language) => (
                              <FormField
                                key={language.id}
                                control={form.control}
                                name="preferredLanguages"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={language.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(language.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, language.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== language.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{language.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    <h3 className="text-lg font-medium">Location Information</h3>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Therapy Needs */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="issues"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>What issues would you like to address in therapy?</FormLabel>
                            <FormDescription>
                              Select all that apply to your current situation
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {mentalHealthIssues.map((issue) => (
                              <FormField
                                key={issue.id}
                                control={form.control}
                                name="issues"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={issue.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(issue.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, issue.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== issue.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{issue.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="therapyGoals"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>What are your therapy goals?</FormLabel>
                            <FormDescription>
                              Select all goals you'd like to work on
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {therapyGoals.map((goal) => (
                              <FormField
                                key={goal.id}
                                control={form.control}
                                name="therapyGoals"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={goal.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(goal.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, goal.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== goal.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{goal.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goalDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe your therapy goals in your own words</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about what you hope to achieve in therapy..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This helps us better understand your unique situation and goals
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 3: Previous Treatment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="previousTherapy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Have you been in therapy before?</FormLabel>
                            <FormDescription>
                              This helps us understand your experience with therapy
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("previousTherapy") && (
                      <>
                        <FormField
                          control={form.control}
                          name="previousDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How long were you in therapy?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="less-than-1-month">Less than 1 month</SelectItem>
                                  <SelectItem value="1-3-months">1-3 months</SelectItem>
                                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                                  <SelectItem value="6-12-months">6-12 months</SelectItem>
                                  <SelectItem value="1-2-years">1-2 years</SelectItem>
                                  <SelectItem value="more-than-2-years">More than 2 years</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="previousApproaches"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>What therapeutic approaches were used? (Optional)</FormLabel>
                                <FormDescription>
                                  Select all that you know were used in your previous therapy
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {therapeuticApproaches.slice(0, 8).map((approach) => (
                                  <FormField
                                    key={approach.id}
                                    control={form.control}
                                    name="previousApproaches"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={approach.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(approach.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, approach.id])
                                                  : field.onChange(
                                                      field.value?.filter((value) => value !== approach.id)
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{approach.label}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why did your previous therapy end?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="completed">Completed treatment goals</SelectItem>
                                  <SelectItem value="financial">Financial reasons</SelectItem>
                                  <SelectItem value="moved">Relocated/moved</SelectItem>
                                  <SelectItem value="therapist-fit">Wasn't a good fit with therapist</SelectItem>
                                  <SelectItem value="approach-fit">Didn't find the approach helpful</SelectItem>
                                  <SelectItem value="life-changes">Life circumstances changed</SelectItem>
                                  <SelectItem value="ongoing">Still in therapy</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    {!form.watch("previousTherapy") && (
                      <div className="rounded-lg border border-muted bg-muted/20 p-4">
                        <p className="text-sm text-muted-foreground">
                          That's okay! Many people are trying therapy for the first time. 
                          We'll make sure to match you with a therapist who can guide you 
                          through the process and make you feel comfortable.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Step 4: Therapist Preferences */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="therapistGender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Therapist Gender Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="no-preference">No preference</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="therapistMinAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Therapist Minimum Age (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="No minimum" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">No minimum</SelectItem>
                                <SelectItem value="25">25+</SelectItem>
                                <SelectItem value="30">30+</SelectItem>
                                <SelectItem value="40">40+</SelectItem>
                                <SelectItem value="50">50+</SelectItem>
                                <SelectItem value="60">60+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="therapistMaxAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Therapist Maximum Age (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="No maximum" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">No maximum</SelectItem>
                                <SelectItem value="30">Under 30</SelectItem>
                                <SelectItem value="40">Under 40</SelectItem>
                                <SelectItem value="50">Under 50</SelectItem>
                                <SelectItem value="60">Under 60</SelectItem>
                                <SelectItem value="70">Under 70</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="therapistExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Therapist Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no-preference">No preference</SelectItem>
                              <SelectItem value="early-career">Early-career (0-3 years)</SelectItem>
                              <SelectItem value="mid-career">Mid-career (4-9 years)</SelectItem>
                              <SelectItem value="experienced">Experienced (10+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Experience level can affect approach and cost
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="approachPreferences"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Preferred Therapeutic Approaches</FormLabel>
                            <FormDescription>
                              Select approaches you're interested in trying
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {therapeuticApproaches.map((approach) => (
                              <FormField
                                key={approach.id}
                                control={form.control}
                                name="approachPreferences"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={approach.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(approach.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, approach.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== approach.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{approach.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sessionFormat"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Preferred Session Format</FormLabel>
                            <FormDescription>
                              Select all formats you're comfortable with
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {sessionFormats.map((format) => (
                              <FormField
                                key={format.id}
                                control={form.control}
                                name="sessionFormat"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={format.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(format.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, format.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== format.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{format.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="culturalFactors"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Cultural Considerations (Optional)</FormLabel>
                            <FormDescription>
                              Select if any of these factors are important to you
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {culturalFactors.map((factor) => (
                              <FormField
                                key={factor.id}
                                control={form.control}
                                name="culturalFactors"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={factor.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(factor.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, factor.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== factor.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{factor.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 5: Scheduling */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="availableDays"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>What days are you available for sessions?</FormLabel>
                            <FormDescription>
                              Select all days when you could potentially schedule therapy
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {daysOfWeek.map((day) => (
                              <FormField
                                key={day.id}
                                control={form.control}
                                name="availableDays"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={day.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(day.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, day.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== day.id)
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{day.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredTimeOfDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time of Day</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                              <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                              <SelectItem value="flexible">Flexible / No preference</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sessionFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How often would you like to have sessions?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="variable">Variable / As needed</SelectItem>
                              <SelectItem value="undecided">Undecided / Need recommendations</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your therapist can help determine the optimal frequency
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    <h3 className="text-lg font-medium">Insurance Information (Optional)</h3>
                    
                    <FormField
                      control={form.control}
                      name="insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select insurance" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">No insurance / Self-pay</SelectItem>
                              <SelectItem value="bluecross">Blue Cross Blue Shield</SelectItem>
                              <SelectItem value="aetna">Aetna</SelectItem>
                              <SelectItem value="cigna">Cigna</SelectItem>
                              <SelectItem value="unitedhealthcare">UnitedHealthcare</SelectItem>
                              <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
                              <SelectItem value="medicare">Medicare</SelectItem>
                              <SelectItem value="medicaid">Medicaid</SelectItem>
                              <SelectItem value="humana">Humana</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            We'll match you with therapists who accept your insurance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("insurance") && form.watch("insurance") !== "" && (
                      <FormField
                        control={form.control}
                        name="insuranceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Member ID / Policy Number</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXXX-XXXXX" {...field} />
                            </FormControl>
                            <FormDescription>
                              This helps verify coverage with therapists
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
                
                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="rounded-lg border border-muted bg-muted/20 p-4">
                      <h3 className="mb-2 font-medium">Personal Information</h3>
                      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                          <dd className="text-sm">{form.watch("name")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                          <dd className="text-sm">{form.watch("email")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Age Range</dt>
                          <dd className="text-sm">{form.watch("age")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                          <dd className="text-sm">{form.watch("gender")}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="rounded-lg border border-muted bg-muted/20 p-4">
                      <h3 className="mb-2 font-medium">Therapy Needs</h3>
                      <dl className="grid grid-cols-1 gap-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Issues</dt>
                          <dd className="text-sm">
                            {form.watch("issues").map(id => 
                              mentalHealthIssues.find(item => item.id === id)?.label
                            ).join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Goals</dt>
                          <dd className="text-sm">
                            {form.watch("therapyGoals").map(id => 
                              therapyGoals.find(item => item.id === id)?.label
                            ).join(", ")}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="rounded-lg border border-muted bg-muted/20 p-4">
                      <h3 className="mb-2 font-medium">Preferences</h3>
                      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Therapist Gender</dt>
                          <dd className="text-sm capitalize">{form.watch("therapistGender")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Session Format</dt>
                          <dd className="text-sm capitalize">
                            {form.watch("sessionFormat").map(format => 
                              sessionFormats.find(item => item.id === format)?.label
                            ).join(", ")}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="rounded-lg border border-muted bg-muted/20 p-4">
                      <h3 className="mb-2 font-medium">Scheduling</h3>
                      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Available Days</dt>
                          <dd className="text-sm capitalize">
                            {form.watch("availableDays").map(day => 
                              daysOfWeek.find(item => item.id === day)?.label
                            ).join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Preferred Time</dt>
                          <dd className="text-sm capitalize">{form.watch("preferredTimeOfDay")}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>
                        By submitting this form, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        . Your information will be kept confidential and secure.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 6 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </ProtectedRoute>
  );
}