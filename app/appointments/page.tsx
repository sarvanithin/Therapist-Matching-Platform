"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useSession } from "next-auth/react"
import { ProtectedRoute } from "@/components/protected-route"

interface Appointment {
  id: string
  therapistId: string
  therapistName: string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled"
  sessionType: "video" | "in-person" | "phone"
  location?: string
  notes?: string
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments")

        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }

        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        setError("Failed to load appointments. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchAppointments()
    }
  }, [session])

  // For demo purposes, let's create some mock appointments
  useEffect(() => {
    if (!isLoading && appointments.length === 0 && !error) {
      // Create mock appointments for demo
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          therapistId: "therapist1",
          therapistName: "Dr. Sarah Johnson",
          startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Tomorrow + 1 hour
          status: "scheduled",
          sessionType: "video",
          notes: "Initial consultation",
        },
        {
          id: "2",
          therapistId: "therapist2",
          therapistName: "Dr. Michael Chen",
          startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Day after tomorrow + 1 hour
          status: "scheduled",
          sessionType: "in-person",
          location: "123 Therapy Lane, Suite 101",
        },
      ]

      setAppointments(mockAppointments)
    }
  }, [isLoading, appointments.length, error])

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled" && new Date(appointment.startTime) > new Date(),
  )

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "completed" || new Date(appointment.startTime) <= new Date(),
  )

  return (
    <ProtectedRoute>
      <div className="container space-y-8 px-4 py-8 md:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Appointments</h1>
          <p className="text-muted-foreground">Manage your therapy sessions and appointments</p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="border-l-4 border-primary h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{appointment.therapistName}</CardTitle>
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {appointment.status === "scheduled" ? "Upcoming" : appointment.status}
                          </div>
                        </div>
                        <CardDescription>
                          {appointment.sessionType === "video"
                            ? "Video Session"
                            : appointment.sessionType === "in-person"
                              ? "In-Person Session"
                              : "Phone Session"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(parseISO(appointment.startTime), "EEEE, MMMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(parseISO(appointment.startTime), "h:mm a")} -{" "}
                                {format(parseISO(appointment.endTime), "h:mm a")}
                              </span>
                            </div>
                            {appointment.sessionType === "video" ? (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Video link will be available 15 minutes before the session
                                </span>
                              </div>
                            ) : appointment.location ? (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.location}</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col justify-end space-y-2">
                            <Button className="w-full md:w-auto md:self-end">Join Session</Button>
                            <Button variant="outline" className="w-full md:w-auto md:self-end">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Upcoming Appointments</CardTitle>
                    <CardDescription>You don't have any upcoming therapy sessions scheduled.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button>Find a Therapist</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="border-l-4 border-muted h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{appointment.therapistName}</CardTitle>
                          <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Completed</div>
                        </div>
                        <CardDescription>
                          {appointment.sessionType === "video"
                            ? "Video Session"
                            : appointment.sessionType === "in-person"
                              ? "In-Person Session"
                              : "Phone Session"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(parseISO(appointment.startTime), "EEEE, MMMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(parseISO(appointment.startTime), "h:mm a")} -{" "}
                                {format(parseISO(appointment.endTime), "h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-end space-y-2">
                            <Button variant="outline" className="w-full md:w-auto md:self-end">
                              Book Follow-up
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Past Appointments</CardTitle>
                    <CardDescription>You don't have any past therapy sessions.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  )
}
