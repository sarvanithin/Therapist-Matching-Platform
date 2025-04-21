import { Brain } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  href?: string
  showText?: boolean
  className?: string
  asLink?: boolean
}

export function Logo({ href = "/", showText = true, className = "", asLink = true }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent p-1.5 shadow-glow">
        <Brain className="h-5 w-5 text-white" />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          <span className="text-primary">Therapy</span>
          <span className="text-accent">Match</span>
        </span>
      )}
    </div>
  )

  if (asLink && href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
