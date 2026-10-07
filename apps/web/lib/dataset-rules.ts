export const datasetRules: Record<
  string,
  { keys: string[]; required?: string[] }
> = {
  "01_maintenance_and_repairs/Fleet/10": {
    keys: ["Vehicle ID"],
    required: ["Vehicle type"],
  },
  monthly_vehicle_history: {
    keys: ["month", "vehicle_id"],
  },
  vehicles: {
    keys: ["vehicle_id"],
    required: ["vehicle_type"],
  },
  "01_maintenance_and_repairs/Repairs/8": {
    keys: ["Work order ID"],
    required: ["Vehicle ID", "Opened at"],
  },
  "01_maintenance_and_repairs/Servicing/8": {
    keys: ["Service ID"],
    required: ["Vehicle ID", "Started at"],
  },
  "01_maintenance_and_repairs/Inspections/8": {
    keys: ["Inspection ID"],
    required: ["Vehicle ID", "Inspected at", "Component"],
  },
  "01_maintenance_and_repairs/Selected observations/9": {
    keys: ["Observation ID"],
    required: ["Vehicle ID", "Observed on", "Component"],
  },
  trips: {
    keys: ["trip_id"],
    required: [
      "route_id",
      "actual_vehicle_id",
      "service_no",
      "service_date",
      "scheduled_departure_at",
      "scheduled_arrival_at",
      "actual_departure_at",
      "actual_arrival_at",
    ],
  },
  stop_calls: {
    keys: ["call_id"],
    required: ["trip_id", "stop_id"],
  },
  control_actions: {
    keys: ["action_id"],
  },
  resource_updates: {
    keys: ["update_id"],
  },
  vehicle_readiness: {
    keys: ["readiness_id"],
  },
  crew_duties: {
    keys: ["duty_id"],
  },
  origin_arrivals: {
    keys: ["arrival_record_id"],
  },
  queue_windows: {
    keys: ["queue_window_id"],
  },
  terminal_movements: {
    keys: ["movement_id"],
    required: ["actual_start_at", "actual_end_at"],
  },
  routes: {
    keys: ["route_id"],
  },
  route_stops: {
    keys: ["route_id", "stop_order"],
  },
  stops: {
    keys: ["stop_id"],
  },
  service_calendar: {
    keys: ["service_date"],
  },
  service_patterns: {
    keys: ["route_id", "version_id"],
  },
  timetable_records: {
    keys: ["version_id"],
  },
  rail_stations: {
    keys: ["station_id"],
  },
  rail_links: {
    keys: ["edge_id"],
  },
  "03_workshop_and_fleet/Maintenance planning/9": {
    keys: ["Maintenance request ID"],
    required: ["Vehicle ID", "Proposed start", "Proposed end"],
  },
  workshop_work_orders: {
    keys: ["work_order_id"],
    required: ["vehicle_id", "opened_at"],
  },
  workshop_vehicles: {
    keys: ["vehicle_id"],
  },
  "03_workshop_and_fleet/Festival allocation/16": {
    keys: ["Allocation ID"],
    required: ["Vehicle ID", "Event ID"],
  },
  planning_constraints: {
    keys: ["constraint_id"],
  },
  "04_passenger_reports/Passenger reports/8": {
    keys: ["Case ID"],
    required: [
      "Reported at",
      "Passenger report",
      "Channel",
      "Journey window start",
      "Journey window end",
    ],
  },
  "06_cost_options/Cost options/9": {
    keys: ["Option ID"],
    required: ["Vehicle ID", "Option", "Scope"],
  },
}
