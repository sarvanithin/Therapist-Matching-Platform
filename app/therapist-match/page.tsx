"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  ThumbsUp,
  User,
  Video,
  Award,
  BookOpen,
  GraduationCap,
  Languages,
} from "lucide-react"
import Link from "next/link"

export default function TherapistMatchPage() {
  const router = useRouter()
  const [matchScore] = useState(92)

  // In a real application, you would fetch this data from your API
  const therapist = {
    id: "th-123456",
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    matchScore: matchScore,
    yearsExperience: 8,
    specialties: ["Anxiety", "Depression", "Stress Management", "Self-Esteem"],
    approaches: ["Cognitive Behavioral Therapy", "Mindfulness", "Solution-Focused"],
    education: "Ph.D. in Clinical Psychology, Stanford University",
    languages: ["English", "Spanish"],
    location: "New York, NY",
    sessionTypes: ["Video", "In-person"],
    bio: "I'm a licensed clinical psychologist with 8 years of experience helping individuals overcome anxiety, depression, and stress. My approach is collaborative, empathetic, and evidence-based. I believe in creating a safe space where you can explore your thoughts and feelings without judgment. Together, we'll develop practical strategies to help you achieve your goals and improve your well-being.",
    availability: {
      nextAvailable: "Tomorrow",
      slots: [
        { day: "Tuesday", date: "May 10", times: ["10:00 AM", "2:00 PM", "4:30 PM"] },
        { day: "Wednesday", date: "May 11", times: ["9:00 AM", "1:00 PM", "5:30 PM"] },
        { day: "Friday", date: "May 13", times: ["11:00 AM", "3:00 PM"] },
      ],
    },
    reviews: [
      {
        id: 1,
        author: "Alex M.",
        rating: 5,
        content:
          "Dr. Johnson has been incredibly helpful in my journey with anxiety. Her approach is both professional and compassionate.",
      },
      {
        id: 2,
        author: "Jamie L.",
        rating: 5,
        content:
          "I've seen several therapists over the years, and Dr. Johnson is by far the best. She really listens and provides practical strategies.",
      },
      {
        id: 3,
        author: "Taylor R.",
        rating: 4,
        content:
          "Dr. Johnson has helped me develop effective coping mechanisms for stress. I appreciate her direct yet supportive approach.",
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:py-12 animate-fade-in">
      <div className="mb-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 mb-2">
              Perfect Match Found!
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Your Therapist Match</h1>
            <p className="text-muted-foreground">
              Based on your profile, we've found a therapist who's a great fit for your needs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-0 shadow-medium">
            <div className="bg-gradient-to-r from-primary to-accent h-24 flex items-end justify-center">
              <div className="bg-white rounded-full p-1 mb-[-3rem] shadow-medium">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
            <CardHeader className="text-center pt-16">
              <CardTitle>{therapist.name}</CardTitle>
              <CardDescription>{therapist.title}</CardDescription>
              <div className="mt-2 flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 px-3 py-1"
                >
                  <Star className="h-3 w-3 fill-primary" />
                  <span className="font-semibold">{therapist.matchScore}% Match</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{therapist.yearsExperience} years experience</p>
                    <p className="text-xs text-muted-foreground">Professional expertise</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{therapist.location}</p>
                    <p className="text-xs text-muted-foreground">Practice location</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Video className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{therapist.sessionTypes.join(", ")} sessions</p>
                    <p className="text-xs text-muted-foreground">Available formats</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Next available: {therapist.availability.nextAvailable}</p>
                    <p className="text-xs text-muted-foreground">Quick availability</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-lg shadow-soft">Schedule a Session</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg p-1">
              <TabsTrigger value="about" className="rounded-md">
                About
              </TabsTrigger>
              <TabsTrigger value="availability" className="rounded-md">
                Availability
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-md">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4 animate-fade-in">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle>About {therapist.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-secondary/30 border border-secondary">
                    <h3 className="mb-2 font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" /> Bio
                    </h3>
                    <p className="text-muted-foreground">{therapist.bio}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" /> Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="px-3 py-1 rounded-full">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 font-medium flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-primary" /> Therapy Approaches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {therapist.approaches.map((approach) => (
                        <Badge key={approach} variant="outline" className="px-3 py-1 rounded-full">
                          {approach}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-secondary">
                      <h3 className="mb-2 font-medium flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" /> Education
                      </h3>
                      <p className="text-sm text-muted-foreground">{therapist.education}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-secondary">
                      <h3 className="mb-2 font-medium flex items-center gap-2">
                        <Languages className="h-4 w-4 text-primary" /> Languages
                      </h3>
                      <p className="text-sm text-muted-foreground">{therapist.languages.join(", ")}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-lg shadow-soft">Schedule a Session</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="availability" className="mt-4 animate-fade-in">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle>Upcoming Availability</CardTitle>
                  <CardDescription>Select a time slot to schedule your session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {therapist.availability.slots.map((slot) => (
                      <div key={slot.date} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">
                            {slot.day}, {slot.date}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {slot.times.map((time) => (
                            <Button
                              key={time}
                              variant="outline"
                              className="w-full rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <div className="bg-secondary/30 p-3 rounded-lg w-full mb-4 border border-secondary">
                    <p className="text-sm font-medium">Session Information</p>
                    <p className="text-xs text-muted-foreground">
                      All sessions are 50 minutes. You can reschedule up to 24 hours before your appointment.
                    </p>
                  </div>
                  <Button className="w-full rounded-lg shadow-soft">Confirm Selection</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 animate-fade-in">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">5.0</span>
                    <span className="text-sm text-muted-foreground">({therapist.reviews.length} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {therapist.reviews.map((review) => (
                      <div key={review.id} className="space-y-2 rounded-lg border p-4 transition-all hover:shadow-soft">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {review.author.split(" ")[0][0]}
                                {review.author.split(" ")[1][0]}
                              </span>
                            </div>
                            <div className="font-medium">{review.author}</div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full rounded-lg">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message {therapist.name.split(" ")[0]}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
