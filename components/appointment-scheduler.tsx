"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO, addDays } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface AppointmentSlot {
  start: string
  end: string
  therapistId: string
}

interface AppointmentSchedulerProps {
  therapistId: string
  therapistName: string
}

export function AppointmentScheduler({ therapistId, therapistName }: AppointmentSchedulerProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  // Fetch available slots when the date changes
  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date)
    }
  }, [date, therapistId])

  // Function to fetch available slots from the API
  const fetchAvailableSlots = async (selectedDate: Date) => {
    setIsLoading(true)
    setSelectedSlot(null)

    try {
      const startDate = selectedDate
      const endDate = addDays(selectedDate, 6) // Get a week of availability

      const response = await fetch(
        `/api/therapists/${therapistId}/availability?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch availability")
      }

      const data = await response.json()
      setAvailableSlots(data.availableSlots)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available appointment slots. Please try again.",
      })
      setAvailableSlots([])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to book an appointment
  const bookAppointment = async () => {
    if (!selectedSlot) return

    setIsBooking(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          therapistId,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book appointment")
      }

      const data = await response.json()

      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with ${therapistName} has been scheduled successfully.`,
      })

      // Redirect to appointments page
      router.push("/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book the appointment. Please try again.",
      })
    } finally {
      setIsBooking(false)
    }
  }

  // Group available slots by date
  const slotsByDate = availableSlots.reduce(
    (acc, slot) => {
      const slotDate = format(parseISO(slot.start), "yyyy-MM-dd")

      if (!acc[slotDate]) {
        acc[slotDate] = []
      }

      acc[slotDate].push(slot)
      return acc
    },
    {} as Record<string, AppointmentSlot[]>,
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>Select a date and time to schedule your appointment with {therapistName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Select a date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Available times</label>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(slotsByDate).length > 0 ? (
                  Object.entries(slotsByDate).map(([dateStr, slots]) => (
                    <div key={dateStr} className="space-y-2">
                      <h4 className="text-sm font-medium">{format(parseISO(dateStr), "EEEE, MMMM d")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot.start}
                            variant={selectedSlot?.start === slot.start ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {format(parseISO(slot.start), "h:mm a")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No available slots for the selected date.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedSlot && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes for the therapist (optional)</label>
            <Textarea
              placeholder="Add any notes or questions for your therapist..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!selectedSlot || isBooking} onClick={bookAppointment}>
          {isBooking ? <Spinner size="sm" className="mr-2" /> : null}
          {isBooking ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
