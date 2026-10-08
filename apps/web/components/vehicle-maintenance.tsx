import { RepairInvestigation } from "./repairs/repair-investigation"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { crewClock } from "@/lib/crew-planning"
import { vehicleRecordTime, type VehicleRow } from "@/lib/vehicle-planning"

export function VehicleMaintenance({
  row,
  date,
  onSelectTrip,
}: {
  row: VehicleRow
  date: string
  onSelectTrip: (tripId: string) => void
}) {
  const affected = row.assignments.filter((a) => a.maintenanceHolds.length)
  const latest = row.workOrders
    .filter((o) => o.updated !== null)
    .sort((a, b) => (b.updated ?? 0) - (a.updated ?? 0))[0]
  return (
    <section aria-label="Vehicle maintenance context" className="space-y-4">
      <div>
        <h3 className="font-semibold">Maintenance context</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Supplied record snapshots for work opened by {date}. Updates and
          findings can be later than this date. This is not a live clearance
          view.
        </p>
      </div>
      {row.vehicle && (
        <RepairInvestigation
          key={`${row.vehicle}/${date}`}
          vehicle={row.vehicle}
          date={date}
          onSelectTrip={onSelectTrip}
        />
      )}
      {latest ? (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <h4 className="font-medium">Latest supplied workshop update</h4>
          <p>
            {vehicleRecordTime(latest.updated)} SGT · {latest.id}
          </p>
          <p className="mt-1">{latest.note ?? "No update note supplied."}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No dated workshop update supplied for this vehicle.
        </p>
      )}
      <div className="space-y-3">
        <h4 className="font-medium">Work orders and reported faults</h4>
        {row.workOrders.length ? (
          row.workOrders.map((order) => (
            <article
              key={`${order.source}/${order.id}`}
              aria-label={`Work order ${order.id}`}
              className="space-y-3 rounded-lg border p-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{order.id}</span>
                <Badge variant="outline">
                  {order.status ?? "Work status unknown"}
                </Badge>
              </div>
              <p className="font-medium">
                {order.fault ?? "No reported fault supplied."}
              </p>
              <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-2">
                <dt className="text-muted-foreground">Opened</dt>
                <dd>{vehicleRecordTime(order.opened)}</dd>
                {order.finding && (
                  <>
                    <dt className="text-muted-foreground">Inspection</dt>
                    <dd>{order.finding}</dd>
                  </>
                )}
                {order.action && (
                  <>
                    <dt className="text-muted-foreground">Repair action</dt>
                    <dd>{order.action}</dd>
                  </>
                )}
                {order.facility && (
                  <>
                    <dt className="text-muted-foreground">Facility</dt>
                    <dd>{order.facility}</dd>
                  </>
                )}
                <dt className="text-muted-foreground">Estimated completion</dt>
                <dd>
                  {order.expected === null
                    ? "Not supplied"
                    : `${vehicleRecordTime(order.expected)} · estimate only`}
                </dd>
                <dt className="text-muted-foreground">
                  Recorded release status
                </dt>
                <dd>{order.releaseStatus ?? "Unknown"}</dd>
                <dt className="text-muted-foreground">Confirmed release</dt>
                <dd>
                  {order.released === null
                    ? "Not recorded; release unconfirmed"
                    : vehicleRecordTime(order.released)}
                </dd>
              </dl>
              {order.note && (
                <p className="text-muted-foreground">{order.note}</p>
              )}
              <p className="text-xs break-words text-muted-foreground">
                Source: {order.source} ·{" "}
                {order.updated === null
                  ? "Update time not supplied"
                  : `Updated ${vehicleRecordTime(order.updated)} SGT`}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No work-order details supplied for this vehicle by the selected
            date. Missing records do not confirm release.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Affected planned trips</h4>
        <p className="text-xs text-muted-foreground">
          Scheduled trips on {date} that overlap recorded maintenance holds,
          across all services. Estimates do not end a hold.
        </p>
        {affected.length ? (
          affected.map(({ trip, maintenanceHolds }) => (
            <div
              key={trip.id}
              className="rounded-lg border border-destructive/40 p-3 text-sm"
            >
              <Button
                variant="link"
                className="h-auto max-w-full justify-start p-0 text-left whitespace-normal"
                onClick={() => onSelectTrip(trip.id)}
              >
                Service {trip.service} · {crewClock(trip.departure)} to{" "}
                {crewClock(trip.arrival)}
              </Button>
              <p className="text-xs break-all text-muted-foreground">
                {trip.id}
              </p>
              {maintenanceHolds.map((h) => (
                <p
                  key={`${h.source}/${h.id}`}
                  className="mt-1 text-xs break-words"
                >
                  Hold {h.id} · {h.source}
                </p>
              ))}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            {row.assignments.length
              ? "No scheduled trip overlaps a timed hold in the supplied records. This does not confirm availability."
              : "No planned trips supplied for this vehicle on this date."}
          </p>
        )}
        {(row.holds.some(
          (h) => h.start === null || (h.end !== null && h.end <= h.start)
        ) ||
          row.assignments.some(
            (a) =>
              a.trip.departure === null ||
              a.trip.arrival === null ||
              a.trip.arrival <= a.trip.departure
          )) && (
          <p className="text-sm text-muted-foreground">
            Incomplete timing evidence prevents a full impact check.
          </p>
        )}
      </div>
    </section>
  )
}
