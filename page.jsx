import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    (<div
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-300 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700 animate-gradient bg-[length:200%_200%]" />
      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="space-y-4">
          <h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Studyfy
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Your personal study companion. Join us to enhance your learning journey.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sign-in">
            <Button variant="default" size="lg" className="min-w-[140px]">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary" size="lg" className="min-w-[140px]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>)
  );
}

