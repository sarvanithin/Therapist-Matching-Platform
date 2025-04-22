"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, parseISO, isSameDay, isAfter, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  ArrowRight,
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Define types for time slots
interface TimeSlot {
  start: string;
  end: string;
  therapistId: string;
}

// Define types for therapist
interface Therapist {
  id: string;
  name: string;
  email: string;
  sessionTypes: string[];
  sessionFees: {
    initial: number;
    ongoing: number;
  };
  location?: {
    address?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  googleCalendarId?: string;
}

// Component props
interface CalendarAppointmentSchedulerProps {
  therapist: Therapist;
  returnUrl?: string;
}

export function CalendarAppointmentScheduler({
  therapist,
  returnUrl = "/appointments",
}: CalendarAppointmentSchedulerProps) {
  const router = useRouter();
  const { toast } = useToast();

  // State variables
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: addDays(new Date(), 14), // Show 2 weeks by default
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, TimeSlot[]>>({});
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [appointmentType, setAppointmentType] = useState<string>(
    therapist.sessionTypes.includes("video") ? "video" : 
    therapist.sessionTypes.includes("in-person") ? "in-person" : 
    "phone"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isCalendarEnabled, setIsCalendarEnabled] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Fetch available slots when date or therapist changes
  useEffect(() => {
    if (date) {
      fetchAvailableSlots();
    }
  }, [date, therapist.id]);

  // Function to fetch available slots from the API
  const fetchAvailableSlots = async () => {
    setIsLoading(true);
    setCalendarError(null);

    try {
      // Calculate date range (1 week starting from selected date)
      const startDate = date || new Date();
      const endDate = addDays(startDate, 14);
      setDateRange({ start: startDate, end: endDate });

      // Fetch available slots from API
      const response = await fetch(
        `/api/appointments/availability?therapistId=${therapist.id}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch availability");
      }

      const data = await response.json();
      
      // If no slots available
      if (!data.availableSlots || data.availableSlots.length === 0) {
        setAvailableSlots([]);
        setSlotsByDate({});
        setCalendarError("No available appointment slots found for the selected dates. Please try a different date range.");
        return;
      }

      setAvailableSlots(data.availableSlots);

      // Group slots by date for easier rendering
      const groupedSlots = data.availableSlots.reduce(
        (acc: Record<string, TimeSlot[]>, slot: TimeSlot) => {
          const slotDate = format(parseISO(slot.start), "yyyy-MM-dd");

          if (!acc[slotDate]) {
            acc[slotDate] = [];
          }

          acc[slotDate].push(slot);
          return acc;
        },
        {}
      );

      setSlotsByDate(groupedSlots);
      
      // Reset selected slot if it's not in the new date range
      if (selectedSlot) {
        const selectedSlotDate = parseISO(selectedSlot.start);
        if (
          isBefore(selectedSlotDate, startDate) ||
          isAfter(selectedSlotDate, endDate)
        ) {
          setSelectedSlot(null);
        }
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setCalendarError("Failed to load available appointment slots. Please try again later.");
      setAvailableSlots([]);
      setSlotsByDate({});
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(null);
  };

  // Function to navigate to previous/next week
  const navigateWeek = (direction: "prev" | "next") => {
    if (!date) return;
    
    const newDate = direction === "prev" 
      ? addDays(date, -7) 
      : addDays(date, 7);
    
    setDate(newDate);
  };

  // Function to book an appointment
  const bookAppointment = async () => {
    if (!selectedSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a time slot.",
      });
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      // Prepare appointment data
      const appointmentData = {
        therapistId: therapist.id,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        appointmentType,
        notes,
        location: appointmentType === "in-person" ? getFormattedAddress() : undefined,
      };

      // Create appointment via API
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      const data = await response.json();

      // Show success message
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with ${therapist.name} has been scheduled successfully.`,
      });

      // Set booking success state
      setBookingSuccess(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingError(String(error));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: String(error) || "Failed to book the appointment. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Function to get formatted address
  const getFormattedAddress = () => {
    if (!therapist.location) return "";
    
    const { address, city, state, zipCode } = therapist.location;
    return `${address || ""}, ${city}, ${state} ${zipCode}`.trim();
  };

  // Handle view change after successful booking
  const handlePostBooking = () => {
    router.push(returnUrl);
  };

  // Render the booking success screen
  const renderBookingSuccess = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <div className="rounded-full bg-green-100 p-6">
        <Check className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-xl font-medium">Appointment Scheduled</h3>
      <p className="max-w-md text-muted-foreground">
        Your appointment with {therapist.name} has been scheduled successfully.
        {isCalendarEnabled && " A calendar invitation has been sent to your email."}
      </p>
      <div className="grid w-full max-w-sm gap-2">
        <Button onClick={handlePostBooking} className="mt-4">
          View My Appointments
        </Button>
        <Button variant="outline" onClick={() => setBookingSuccess(false)}>
          Schedule Another Appointment
        </Button>
      </div>
    </div>
  );

  // Render the slot selection UI
  const renderSlotSelection = () => (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="calendar">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendar View
        </TabsTrigger>
        <TabsTrigger value="list">
          <Clock className="mr-2 h-4 w-4" />
          List View
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("prev")}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>

          <div className="text-sm font-medium">
            {dateRange.start && dateRange.end
              ? `${format(dateRange.start, "MMM d")} - ${format(
                  dateRange.end,
                  "MMM d, yyyy"
                )}`
              : "Select a date"}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("next")}
            disabled={isLoading}
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Available Times</h3>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : calendarError ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                <Info className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{calendarError}</p>
              </div>
            ) : (
              <>
                {date && slotsByDate[format(date, "yyyy-MM-dd")] ? (
                  <div className="h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {slotsByDate[format(date, "yyyy-MM-dd")].map((slot) => (
                        <Button
                          key={slot.start}
                          variant={
                            selectedSlot?.start === slot.start
                              ? "default"
                              : "outline"
                          }
                          className="justify-start"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {format(parseISO(slot.start), "h:mm a")}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center">
                    <Info className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {date
                        ? "No available slots for the selected date."
                        : "Please select a date to view available time slots."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="list" className="space-y-4">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : calendarError ? (
          <div className="flex h-[300px] flex-col items-center justify-center text-center">
            <Info className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{calendarError}</p>
          </div>
        ) : (
          <div className="h-[300px] space-y-4 overflow-y-auto">
            {Object.keys(slotsByDate)
              .sort()
              .map((dateStr) => (
                <div key={dateStr} className="space-y-2">
                  <h4 className="font-medium">
                    {format(parseISO(dateStr), "EEEE, MMMM d")}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {slotsByDate[dateStr].map((slot) => (
                      <Button
                        key={slot.start}
                        variant={
                          selectedSlot?.start === slot.start
                            ? "default"
                            : "outline"
                        }
                        className="justify-start"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {format(parseISO(slot.start), "h:mm a")}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

            {Object.keys(slotsByDate).length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Info className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No available slots found in the selected date range.
                </p>
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  // Render the appointment details section
  const renderAppointmentDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Session Type</h3>
        <RadioGroup
          value={appointmentType}
          onValueChange={setAppointmentType}
          className="grid grid-cols-1 gap-2 md:grid-cols-3"
        >
          {therapist.sessionTypes.includes("video") && (
            <div>
              <RadioGroupItem
                value="video"
                id="video"
                className="peer sr-only"
              />
              <Label
                htmlFor="video"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Video className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Video Session</span>
              </Label>
            </div>
          )}

          {therapist.sessionTypes.includes("in-person") && (
            <div>
              <RadioGroupItem
                value="in-person"
                id="in-person"
                className="peer sr-only"
              />
              <Label
                htmlFor="in-person"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <MapPin className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">In-Person</span>
              </Label>
            </div>
          )}

          {therapist.sessionTypes.includes("phone") && (
            <div>
              <RadioGroupItem
                value="phone"
                id="phone"
                className="peer sr-only"
              />
              <Label
                htmlFor="phone"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Phone className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Phone Session</span>
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>

      {appointmentType === "in-person" && therapist.location && (
        <div>
          <h3 className="mb-2 font-medium">Location</h3>
          <div className="rounded-md border p-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                {therapist.location.address && (
                  <p>{therapist.location.address}</p>
                )}
                <p>
                  {therapist.location.city}, {therapist.location.state}{" "}
                  {therapist.location.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-medium">Notes (Optional)</h3>
        <Textarea
          placeholder="Add any notes or questions for your therapist..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {therapist.googleCalendarId && (
        <div className="flex items-center justify-between">
          <div className="grid gap-1.5">
            <Label htmlFor="calendar-sync">Add to Google Calendar</Label>
            <p className="text-sm text-muted-foreground">
              Sync this appointment with your Google Calendar
            </p>
          </div>
          <Switch
            id="calendar-sync"
            checked={isCalendarEnabled}
            onCheckedChange={setIsCalendarEnabled}
          />
        </div>
      )}

      {bookingError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <p>Error: {bookingError}</p>
        </div>
      )}
    </div>
  );

  return (
    <Card className="border-0 shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schedule an Appointment</CardTitle>
            <CardDescription>
              Select a date and time to schedule your session with {therapist.name}
            </CardDescription>
          </div>
          <Badge>
            ${therapist.sessionFees.initial} / session
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {bookingSuccess ? (
          renderBookingSuccess()
        ) : (
          <div className="space-y-6">
            {renderSlotSelection()}
            <Separator />
            {selectedSlot && renderAppointmentDetails()}
          </div>
        )}
      </CardContent>
      {!bookingSuccess && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(returnUrl)}
            disabled={isBooking}
          >
            Cancel
          </Button>
          <Button
            onClick={bookAppointment}
            disabled={!selectedSlot || isBooking}
            className="min-w-[120px]"
          >
            {isBooking ? <Spinner size="sm" className="mr-2" /> : null}
            {isBooking ? "Scheduling..." : "Schedule"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}