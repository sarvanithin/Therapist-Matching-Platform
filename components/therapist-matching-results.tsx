"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { MatchResult } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Calendar, MessageSquare, Star, Clock, Briefcase, GraduationCap, Heart } from "lucide-react"

interface TherapistMatchingResultsProps {
  matches: MatchResult[]
  onScheduleSession: (therapistId: string) => void
  onViewProfile: (therapistId: string) => void
  onRequestNewMatches: () => void
}

export function TherapistMatchingResults({
  matches,
  onScheduleSession,
  onViewProfile,
  onRequestNewMatches,
}: TherapistMatchingResultsProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const router = useRouter()

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-secondary p-6">
          <Info className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">No matches found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          We couldn't find suitable therapist matches based on your preferences. Try adjusting your preferences or
          expanding your criteria.
        </p>
        <Button onClick={onRequestNewMatches} className="rounded-lg shadow-soft">
          Update Preferences
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <Card
            key={match.therapist.id}
            className={`overflow-hidden transition-all hover:shadow-medium card-hover ${
              selectedMatch?.therapist.id === match.therapist.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedMatch(match)}
          >
            <div className="relative h-48 bg-muted">
              {match.therapist.profileImageUrl ? (
                <Image
                  src={match.therapist.profileImageUrl || "/placeholder.svg"}
                  alt={match.therapist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary/10">
                  <GraduationCap className="h-16 w-16 text-primary/40" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-sm font-medium backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span>{match.therapist.averageRating || "New"}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <h3 className="line-clamp-1 text-lg font-bold">{match.therapist.name}</h3>
                <p className="line-clamp-1 text-sm">
                  {match.therapist.credentials.licenseType} • {match.therapist.credentials.yearsOfExperience} yrs exp
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-sm font-bold text-primary">{match.scores.overallMatchScore}%</span>
                </div>
                <Progress
                  value={match.scores.overallMatchScore}
                  className="h-2 rounded-full"
                  indicatorClassName="bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <span className="truncate">Clinical: {match.scores.clinicalMatch}%</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">How well the therapist's specializations match your needs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-accent" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <span className="truncate">Personal: {match.scores.personalCompatibility}%</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Likelihood of a good personal connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-1 text-sm font-medium">Specializes in:</h4>
                <div className="flex flex-wrap gap-1">
                  {match.therapist.specializations.slice(0, 3).map((specialization) => (
                    <span key={specialization} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {specialization}
                    </span>
                  ))}
                  {match.therapist.specializations.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      +{match.therapist.specializations.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t p-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewProfile(match.therapist.id)
                }}
              >
                View Profile
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-lg shadow-soft"
                onClick={(e) => {
                  e.stopPropagation()
                  onScheduleSession(match.therapist.id)
                }}
              >
                Schedule
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedMatch && (
        <Card className="overflow-hidden border-0 shadow-medium animate-scale-in">
          <CardHeader>
            <CardTitle>Why We Matched You</CardTitle>
            <CardDescription>Details about your match with {selectedMatch.therapist.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-secondary">
              <h3 className="mb-2 text-sm font-medium">Match Rationale</h3>
              <p className="text-sm text-muted-foreground">{selectedMatch.rationale}</p>
            </div>

            {selectedMatch.specialConsiderations && selectedMatch.specialConsiderations.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Special Considerations</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {selectedMatch.specialConsiderations.map((consideration, index) => (
                    <li key={index}>{consideration}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-medium">Approach & Style</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedMatch.therapist.approaches.map((approach) => (
                  <span
                    key={approach}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                  >
                    {approach}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Session Information</h3>
                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Initial Session</span>
                    <span className="font-medium">${selectedMatch.therapist.sessionFees.initial}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span>Ongoing Sessions</span>
                    <span className="font-medium">${selectedMatch.therapist.sessionFees.ongoing}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedMatch.therapist.acceptedInsurance.length > 0 ? (
                      <p>Accepts {selectedMatch.therapist.acceptedInsurance.join(", ")}</p>
                    ) : (
                      <p>Does not accept insurance (out-of-pocket only)</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Session Types</h3>
                <div className="rounded-md border p-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.therapist.sessionTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {type === "in-person" && <Clock className="h-3.5 w-3.5" />}
                        {type === "video" && <MessageSquare className="h-3.5 w-3.5" />}
                        {type === "phone" && <Calendar className="h-3.5 w-3.5" />}
                        {type}
                      </div>
                    ))}
                  </div>
                  {selectedMatch.therapist.location && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Located in {selectedMatch.therapist.location.city}, {selectedMatch.therapist.location.state}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t p-4">
            <Button variant="outline" className="rounded-lg" onClick={() => onViewProfile(selectedMatch.therapist.id)}>
              View Full Profile
            </Button>
            <Button className="rounded-lg shadow-soft" onClick={() => onScheduleSession(selectedMatch.therapist.id)}>
              Schedule Session
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
