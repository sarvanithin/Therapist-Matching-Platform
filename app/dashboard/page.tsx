"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MessageSquare,
  BarChart,
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <div className="container space-y-8 px-4 py-8 md:px-6 animate-fade-in">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 mb-2">
              Welcome Back
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name || "User"}! Here's an overview of your therapy journey.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button className="rounded-lg shadow-soft">Complete Your Profile</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto rounded-lg p-1">
            <TabsTrigger value="overview" className="rounded-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="rounded-md">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-md">
              Progress
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 shadow-soft overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25%</div>
                  <Progress
                    value={25}
                    className="mt-2 h-2"
                    indicatorClassName="bg-gradient-to-r from-primary to-primary/50"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Complete your profile to get matched with a therapist
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/onboarding" className="w-full">
                    <Button className="w-full rounded-lg shadow-soft" size="sm">
                      Continue Setup
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="border-0 shadow-soft overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  <CalendarDays className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-0 rounded-full bg-gradient-to-r from-accent to-accent/50"></div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">No upcoming sessions scheduled</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-lg" size="sm" variant="outline" disabled>
                    Schedule Session
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-0 shadow-soft overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Therapy Journey</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 days</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-0 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Your therapy journey begins after matching</p>
                </CardContent>
                <CardFooter>
                  <Link href="/onboarding" className="w-full">
                    <Button className="w-full rounded-lg" size="sm" variant="outline">
                      Start Journey
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>Complete these steps to begin your therapy journey</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-glow">
                        <span className="text-sm font-bold text-white">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Complete your profile</p>
                        <p className="text-sm text-muted-foreground">Tell us about yourself and your therapy needs</p>
                      </div>
                    </div>
                    <Link href="/onboarding">
                      <Button size="sm" className="rounded-lg shadow-soft">
                        Start
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold text-muted-foreground">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Get matched with a therapist</p>
                        <p className="text-sm text-muted-foreground">Our system will find the perfect match for you</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-lg" disabled>
                      Pending
                    </Button>
                  </div>
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold text-muted-foreground">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Schedule your first session</p>
                        <p className="text-sm text-muted-foreground">Book a time that works for you</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-lg" disabled>
                      Pending
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4 animate-fade-in">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage your therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-3 py-12">
                  <div className="rounded-full bg-secondary p-6">
                    <CalendarDays className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No appointments scheduled</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Complete your profile to get matched with a therapist and schedule your first session.
                  </p>
                  <Link href="/onboarding">
                    <Button className="mt-2 rounded-lg shadow-soft">Complete Your Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="progress" className="space-y-4 animate-fade-in">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Therapy Progress</CardTitle>
                <CardDescription>Track your therapy journey and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-3 py-12">
                  <div className="rounded-full bg-secondary p-6">
                    <BarChart className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No progress data yet</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Your progress tracking will begin after your first therapy session.
                  </p>
                  <Link href="/onboarding">
                    <Button className="mt-2 rounded-lg shadow-soft">Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Wellness Tips</CardTitle>
              <CardDescription>Daily practices to improve your mental health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Practice Mindfulness</p>
                    <p className="text-sm text-muted-foreground">
                      Take 5 minutes today to focus on your breathing and be present in the moment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Connect with Others</p>
                    <p className="text-sm text-muted-foreground">
                      Reach out to a friend or family member today for a meaningful conversation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Physical Activity</p>
                    <p className="text-sm text-muted-foreground">
                      Even a short 10-minute walk can boost your mood and reduce stress.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-lg">
                View More Tips
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Helpful materials for your mental health journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="group flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Understanding Anxiety</p>
                      <p className="text-xs text-muted-foreground">A guide to managing anxiety symptoms</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="group flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Communication Skills</p>
                      <p className="text-xs text-muted-foreground">
                        Improving relationships through better communication
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="group flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Self-Care Calendar</p>
                      <p className="text-xs text-muted-foreground">Daily activities to prioritize your wellbeing</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-lg">
                Browse Library
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
