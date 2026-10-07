# Vehicle maintenance context

Open **Fleet > Vehicle register** and select a vehicle, readiness band, hold,
or planned trip. The vehicle panel includes recorded faults, inspection findings,
repair actions, workshop updates, release evidence, and affected planned trips.

The panel reads the supplied exercise records. Work orders opened after the
selected date are excluded. Undated orders remain visible because their date is
unknown. Findings and updates are source snapshots and can postdate the selected
day. This is not a reconstruction of what an operator knew at a decision time.

Estimated completion never ends a maintenance hold. A confirmed release ends the
hold at its recorded timestamp. Missing work orders, missing readiness, and gaps
in hold coverage do not establish vehicle availability. Affected trips are
scheduled assignments on the selected date across all services, not live departures.

## Data and ownership

`getVehiclePlanning(date)` reads trips, readiness, holds, and work orders in one
SQLite snapshot. It normalizes workshop orders and the selected repair handout
into `VehiclePlanningData.workOrders`. The Zod schema validates database results
and API responses.

`vehicleRows(data, start, end)` selects each vehicle's work orders and attaches
`maintenanceHolds` to its assignments. Both timeline conflict warnings and the
maintenance panel use those same hold references. `VehicleMaintenance` renders
the selected row and sends trip selections back to the existing vehicle panel.
There are no database writes, new endpoints, background workers, or AI calls.

A separate per-vehicle maintenance endpoint was considered. It would reduce the
initial response for a much larger collection but require another request
lifecycle and coordination between two snapshots. The existing date payload and
Sheet keep selection, refresh, and error handling in one place.

## Verification

Run `pnpm --filter web exec vitest run __tests__/vehicle-planning.test.ts __tests__/vehicle-maintenance.test.tsx`
for source queries, vehicle/date isolation, release boundaries, missing evidence,
and affected-trip selection. Run `pnpm check` for the repository checks.

In the app preview, inspect NW-W001 for an open door-mechanism order with an
estimated completion and no confirmed release. Inspect NW-V020 for reported
symptoms, findings, and repair actions. Change the date to 7 October and confirm
that NW-MWO003, opened on 12 October, is absent. NW-V001 demonstrates missing
work-order details. Check the panel on a narrow viewport and after refresh.
