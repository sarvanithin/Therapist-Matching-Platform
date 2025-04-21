import { Brain } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container flex min-h-[400px] flex-col items-center justify-center py-12 animate-fade-in">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-secondary animate-pulse-slow"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-glow">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
              </div>
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Finding Your Perfect Match</h1>
        <p className="mb-8 text-muted-foreground">
          Our AI is analyzing your profile and preferences to find the best therapists for you.
        </p>

        <Card className="mb-8 border-0 shadow-medium overflow-hidden">
          <CardContent className="pt-6">
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Matching in progress...</span>
                <span className="font-bold text-primary">45%</span>
              </div>
              <Progress
                value={45}
                className="h-3 rounded-full"
                indicatorClassName="bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              This process typically takes less than a minute. Please don't close this page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
