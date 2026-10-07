# Dashboard navigation

The dashboard sidebar groups report pages by workspace. Workspace buttons expand or collapse their child links. Each child link selects one page through the `view` query parameter. The current page supplies the heading, breadcrumb, and active link. Browser Back and reload restore the page.

## Workspace ownership

| Workspace   | Pages                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Fleet       | Fleet overview, Vehicle register                                                                                     |
| Operations  | Day schedule, Service reliability, Passenger queues, Control log, Resource records, Network records, Usage & service |
| Maintenance | Maintenance history, Workshop planning, Workshop register                                                            |
| Planning    | Service planning, Festival allocation, Incident response                                                             |
| Passengers  | Passenger reports                                                                                                    |
| Finance     | Cost options                                                                                                         |

The menu reference is `lionlink-operations-source/ops-console/index.html`, with behavior inspected in `ops-console/app.js`. Its Day schedule, Vehicle register, Workshop register, Control log, and Resource records menus informed the new destinations. The app renders existing SQLite records through the shared dataset table. It does not import the reference console's generated state or implement its as-of-time simulation.

| Reference menu    | App destination                 | Source records                                                                                                                    |
| ----------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Day schedule      | Operations / Day schedule       | Trips, timetable records, stop calls, service calendar                                                                            |
| Vehicle register  | Fleet / Vehicle register        | Vehicles                                                                                                       |
| Workshop register | Maintenance / Workshop register | Workshop work orders, workshop vehicles, vehicle readiness                                                                                           |
| Control log       | Operations / Control log        | Control actions                                                                                                                   |
| Resource records  | Operations / Resource records   | Crew duties, resource updates, terminal movements, planning constraints, origin arrivals, queue windows                           |
| Network map       | Deferred                        | Routes, stops, service patterns, and rail records remain accessible through Operations / Network records. This page is not a map. |

## Implementation

`apps/web/lib/dashboard-navigation.ts` owns the workspace tree and derives the allowed page IDs. `DashboardReport` exhaustively renders those IDs. `DashboardSidebar` composes the shared shadcn sidebar and collapsible components. Its links retain unrelated query parameters, including the planner's selected service, date, and assumptions. Mobile selection closes the navigation drawer. Back navigation reveals the restored page's workspace.

Two designs were considered. Sidebar links that drove existing nested tabs would duplicate navigation state across components. The chosen page tree removes the workspace tab layers and uses one URL selection for the sidebar and report. Contextual tabs remain for service investigation and chart comparisons. `DatasetPicker` replaces long dataset tab strips with a labeled select while preserving search, filtering, exports, and existing record actions.

Historical vehicle and period controls appear only on Fleet overview and Maintenance history. They do not imply that workshop or operating records use monthly-history filters.

## Verification

Run `pnpm check`. The dashboard tests open every workspace report, switch workshop datasets, check historical-filter scope, exercise browser Back, and preserve planning assumptions. The service-planning investigation still checks thresholds, candidate evidence, and replay observations.

In the running app, open `/dashboard?view=workshop-register`. Confirm Maintenance is expanded and Workshop register is selected. Change the Dataset selector to workshop vehicles. Open Planning / Service planning, change an assumption, visit another workspace, and return. Confirm the assumption remains. Reload the URL and use browser Back to verify page selection. At a mobile viewport, open the sidebar, expand Operations, and select Control log. Confirm the drawer closes and the page has no horizontal overflow outside its table.

Fleet overview owns recorded distance, operating hours and the all-service history map. Maintenance history owns maintenance costs, repair counts, repair cost per kilometre, spending comparisons and maintenance hold charts, plus the detailed monthly vehicle history. Engineering readiness records are under Maintenance / Workshop register; Fleet / Vehicle register contains vehicle identity and service assignment records. Historical filters apply to usage metrics in Fleet and maintenance metrics in Maintenance, not to the independently dated service replay.
