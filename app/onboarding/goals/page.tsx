"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const therapyGoals = [
  {
    id: "anxiety",
    label: "Anxiety Management",
  },
  {
    id: "depression",
    label: "Depression",
  },
  {
    id: "stress",
    label: "Stress Management",
  },
  {
    id: "relationships",
    label: "Relationship Issues",
  },
  {
    id: "trauma",
    label: "Trauma Processing",
  },
  {
    id: "self-esteem",
    label: "Self-Esteem",
  },
  {
    id: "grief",
    label: "Grief and Loss",
  },
  {
    id: "career",
    label: "Career Challenges",
  },
  {
    id: "life-transitions",
    label: "Life Transitions",
  },
  {
    id: "addiction",
    label: "Addiction Recovery",
  },
]

const formSchema = z.object({
  goals: z.array(z.string()).min(1, {
    message: "Please select at least one therapy goal",
  }),
  description: z.string().min(10, {
    message: "Please provide more details about your therapy goals",
  }),
})

export default function TherapyGoalsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: [],
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the next step
      router.push("/onboarding/preferences")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Therapy Goals</h1>
        <p className="text-muted-foreground">Tell us what you're looking to achieve with therapy.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>
            Select the areas you'd like to focus on in therapy. This helps us match you with a therapist who specializes
            in your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="goals"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>What would you like to work on?</FormLabel>
                      <FormDescription>Select all that apply to your current situation.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {therapyGoals.map((goal) => (
                        <FormField
                          key={goal.id}
                          control={form.control}
                          name="goals"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={goal.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(goal.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, goal.id])
                                        : field.onChange(field.value?.filter((value) => value !== goal.id))
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us more about your goals</FormLabel>
                    <FormDescription>
                      Provide any additional details that might help us understand your needs better.
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="I'm looking for help with..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="flex justify-between px-0 pb-0">
                <Button variant="outline" type="button" onClick={() => router.push("/onboarding")}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Next"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
