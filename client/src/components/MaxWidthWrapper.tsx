import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export default function MaxWidthWrapper({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn("mx-auto w-full max-w-screen-lg px-6 sm:px-8 py-4 sm:py-8", className)}>{children}</div>
}
