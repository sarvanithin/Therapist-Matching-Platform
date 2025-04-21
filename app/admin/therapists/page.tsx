import { Suspense } from "react"
import { TherapistsContent } from "@/components/therapists-content"

export default function TherapistsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Therapists</h1>
        <p className="text-muted-foreground">Manage therapist profiles and information.</p>
      </div>

      <Suspense fallback={<p>Loading therapists...</p>}>
        <TherapistsContent />
      </Suspense>
    </div>
  )
}
