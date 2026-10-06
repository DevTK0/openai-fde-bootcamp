import Link from "next/link"
import { FleetDashboard } from "@/components/fleet-dashboard"

export default function Page() {
  return (
    <>
      <div className="border-b bg-muted px-5 py-2 text-sm">
        Historical fixture reports. Uploaded revisions are analysed in the{" "}
        <Link className="underline" href="/workspace">
          decision workspace
        </Link>
        .
      </div>
      <FleetDashboard />
    </>
  )
}
