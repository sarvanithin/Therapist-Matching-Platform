"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Shield, Star, Check, Heart, Users, Sparkles } from "lucide-react"
import { Logo } from "@/components/logo"
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Logo href="/" />
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="rounded-full shadow-soft">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 w-fit">
                  <Sparkles className="mr-1 h-3 w-3" /> New way to find your perfect therapist
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Find Your <span className="gradient-heading">Perfect Therapist</span> Match
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our intelligent matching system connects you with therapists who understand your unique needs and
                    goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gap-1.5 rounded-full shadow-glow">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="rounded-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/20"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/40"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/60"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">500+</span> therapists available
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-full max-w-[550px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-1 shadow-2xl animate-scale-in">
                    <div className="aspect-video w-full rounded-xl bg-white flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                          <Heart className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Your Mental Health Journey</h3>
                        <p className="text-muted-foreground">Find the perfect therapist match in minutes</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary p-2 shadow-xl">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">95%</div>
                        <div className="text-xs">Match Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                Features
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need for Your <span className="gradient-heading">Therapy Journey</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Designed with care to support your mental health needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-soft card-hover">
                <div className="rounded-full bg-primary p-3 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Personalized Matching</h3>
                <p className="text-center text-muted-foreground">
                  Our algorithm finds therapists who match your specific needs and preferences.
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Personality compatibility
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Specialization matching
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Experience-based pairing
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-soft card-hover">
                <div className="rounded-full bg-accent p-3 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Easy Scheduling</h3>
                <p className="text-center text-muted-foreground">
                  Book appointments with your therapist directly through our platform.
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-accent" /> Real-time availability
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-accent" /> Automated reminders
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-accent" /> Flexible rescheduling
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-soft card-hover">
                <div className="rounded-full bg-primary p-3 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure & Confidential</h3>
                <p className="text-center text-muted-foreground">
                  Your privacy is our priority with end-to-end encryption and strict data policies.
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> HIPAA compliant
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Encrypted communications
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" /> Secure payment processing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                Process
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How <span className="gradient-heading">TherapyMatch</span> Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Three simple steps to connect with your ideal therapist
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent hidden md:block -z-10"></div>
              <div className="flex flex-col items-center space-y-4 rounded-xl p-6 relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground shadow-glow z-10">
                  1
                </div>
                <h3 className="text-xl font-bold">Complete Your Profile</h3>
                <p className="text-center text-muted-foreground">
                  Tell us about yourself and what you're looking for in therapy.
                </p>
                <div className="mt-4 rounded-xl border p-4 w-full bg-white shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Personal Profile</p>
                      <p className="text-muted-foreground">Share your therapy goals</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl p-6 relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-xl font-bold text-primary-foreground shadow-glow z-10">
                  2
                </div>
                <h3 className="text-xl font-bold">Get Matched</h3>
                <p className="text-center text-muted-foreground">
                  Our system finds therapists who match your unique needs and preferences.
                </p>
                <div className="mt-4 rounded-xl border p-4 w-full bg-white shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">AI Matching</p>
                      <p className="text-muted-foreground">95% satisfaction rate</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-xl p-6 relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground shadow-glow z-10">
                  3
                </div>
                <h3 className="text-xl font-bold">Schedule a Session</h3>
                <p className="text-center text-muted-foreground">
                  Book your first appointment and begin your therapy journey.
                </p>
                <div className="mt-4 rounded-xl border p-4 w-full bg-white shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Easy Scheduling</p>
                      <p className="text-muted-foreground">Book in just a few clicks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                Testimonials
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Hear from <span className="gradient-heading">Our Community</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real stories from people who found their perfect therapist match
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border p-6 shadow-soft card-hover">
                <div className="space-y-2">
                  <div className="flex gap-1 text-primary">
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    "TherapyMatch connected me with a therapist who truly understands my needs. The matching process was
                    spot on!"
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">SJ</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Sarah J.</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border p-6 shadow-soft card-hover">
                <div className="space-y-2">
                  <div className="flex gap-1 text-accent">
                    <Star className="h-5 w-5 fill-accent" />
                    <Star className="h-5 w-5 fill-accent" />
                    <Star className="h-5 w-5 fill-accent" />
                    <Star className="h-5 w-5 fill-accent" />
                    <Star className="h-5 w-5 fill-accent" />
                  </div>
                  <p className="text-muted-foreground">
                    "I was skeptical at first, but the therapist I was matched with has been perfect for my journey.
                    Highly recommend!"
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">MT</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Michael T.</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl border p-6 shadow-soft card-hover">
                <div className="space-y-2">
                  <div className="flex gap-1 text-primary">
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5 fill-primary" />
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="text-muted-foreground">
                    "The onboarding process was thorough and thoughtful. I felt understood from the very beginning."
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">ER</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Elena R.</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Your <span className="gradient-heading">Therapy Journey</span>?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Begin your path to better mental health today
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-1.5 rounded-full shadow-glow">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">500+ Therapists</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="text-sm">95% Match Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <nav className="flex gap-4 md:gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2025 TherapyMatch. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
