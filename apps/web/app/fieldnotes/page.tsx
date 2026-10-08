import type { Metadata } from "next"
import { FieldnotesApp } from "@/components/fieldnotes/fieldnotes-app"

export const metadata: Metadata = {
  title: "Fieldnotes | Presentation to specification",
  description:
    "Capture a presentation, clarify the details, and create a feature specification with GPT-Live.",
}
export default function FieldnotesPage() {
  return <FieldnotesApp />
}
