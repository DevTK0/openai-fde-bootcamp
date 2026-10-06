import type { Metadata } from "next"
import "@workspace/ui/globals.css"
export const metadata: Metadata = {
  title: "LionLink Software Factory",
  description: "Turn employee conversations into reviewable software changes.",
}
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground antialiased [--font-sans:Arial,Helvetica,sans-serif]">
        {children}
      </body>
    </html>
  )
}
