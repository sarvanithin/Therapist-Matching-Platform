"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const specialties = [
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Depression" },
  { id: "trauma", label: "Trauma" },
  { id: "ptsd", label: "PTSD" },
  { id: "relationships", label: "Relationships" },
  { id: "family", label: "Family Therapy" },
  { id: "addiction", label: "Addiction" },
  { id: "grief", label: "Grief and Loss" },
  { id: "stress", label: "Stress Management" },
  { id: "self-esteem", label: "Self-Esteem" },
]

const approaches = [
  { id: "cbt", label: "Cognitive Behavioral Therapy (CBT)" },
  { id: "psychodynamic", label: "Psychodynamic Therapy" },
  { id: "humanistic", label: "Humanistic Therapy" },
  { id: "mindfulness", label: "Mindfulness-Based Therapy" },
  { id: "solution-focused", label: "Solution-Focused Therapy" },
  { id: "emdr", label: "EMDR" },
  { id: "family-systems", label: "Family Systems Therapy" },
  { id: "narrative", label: "Narrative Therapy" },
  { id: "eclectic", label: "Eclectic/Integrative Approach" },
]

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "mandarin", label: "Mandarin" },
  { id: "cantonese", label: "Cantonese" },
  { id: "vietnamese", label: "Vietnamese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
  { id: "portuguese", label: "Portuguese" },
  { id: "german", label: "German" },
]

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  title: z.string().min(2, { message: "Title is required" }),
  licenseNumber: z.string().min(2, { message: "License number is required" }),
  education: z.string().min(2, { message: "Education information is required" }),
  yearsExperience: z.string().min(1, { message: "Years of experience is required" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  specialties: z.array(z.string()).min(1, { message: "Please select at least one specialty" }),
  approaches: z.array(z.string()).min(1, { message: "Please select at least one approach" }),
  languages: z.array(z.string()).min(1, { message: "Please select at least one language" }),
  sessionTypes: z.array(z.string()).min(1, { message: "Please select at least one session type" }),
  hourlyRate: z.string().min(1, { message: "Hourly rate is required" }),
  status: z.string().min(1, { message: "Status is required" }),
})

export default function NewTherapistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      licenseNumber: "",
      education: "",
      yearsExperience: "",
      bio: "",
      specialties: [],
      approaches: [],
      languages: [],
      sessionTypes: [],
      hourlyRate: "",
      status: "active",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Therapist profile created!",
        description: "The therapist profile has been successfully created.",
      })

      router.push("/admin/therapists")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Therapist</h1>
        <p className="text-muted-foreground">Create a new therapist profile with all the necessary information.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter the therapist's basic personal and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Enter the therapist's professional credentials and experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Licensed Clinical Psychologist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="PSY12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="Ph.D. in Clinical Psychology, Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormDescription>A brief professional biography of the therapist.</FormDescription>
                    <FormControl>
                      <Textarea placeholder="Enter therapist bio..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specializations & Expertise</CardTitle>
              <CardDescription>Select the therapist's areas of expertise and therapeutic approaches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="specialties"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Specialties</FormLabel>
                      <FormDescription>Select all areas the therapist specializes in.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {specialties.map((specialty) => (
                        <FormField
                          key={specialty.id}
                          control={form.control}
                          name="specialties"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={specialty.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(specialty.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, specialty.id])
                                        : field.onChange(field.value?.filter((value) => value !== specialty.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{specialty.label}</FormLabel>
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
                name="approaches"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Therapeutic Approaches</FormLabel>
                      <FormDescription>Select all therapeutic approaches the therapist uses.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {approaches.map((approach) => (
                        <FormField
                          key={approach.id}
                          control={form.control}
                          name="approaches"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={approach.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(approach.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, approach.id])
                                        : field.onChange(field.value?.filter((value) => value !== approach.id))
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
                name="languages"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Languages Spoken</FormLabel>
                      <FormDescription>Select all languages the therapist speaks fluently.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {languages.map((language) => (
                        <FormField
                          key={language.id}
                          control={form.control}
                          name="languages"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={language.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(language.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, language.id])
                                        : field.onChange(field.value?.filter((value) => value !== language.id))
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>Enter details about the therapist's sessions and availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="sessionTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Session Types</FormLabel>
                      <FormDescription>Select all session types the therapist offers.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sessionTypes"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("video")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "video"])
                                      : field.onChange(field.value?.filter((value) => value !== "video"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Video Sessions</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="sessionTypes"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("in-person")}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, "in-person"])
                                      : field.onChange(field.value?.filter((value) => value !== "in-person"))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">In-Person Sessions</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="150" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/therapists")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Therapist Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
