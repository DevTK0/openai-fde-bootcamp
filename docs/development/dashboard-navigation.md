# Dashboard navigation

The dashboard sidebar groups report pages by workspace. Workspace buttons expand or collapse their child links. Each child link selects one page through the `view` query parameter. The current page supplies the heading, breadcrumb, and active link. Browser Back and reload restore the page.

## Workspace ownership

| Workspace   | Pages                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Fleet       | Fleet overview, Vehicle register                                                                       |
| Operations  | Day schedule, Service reliability, Passenger queues, Usage & service                                   |
| Maintenance | Maintenance history                                                                                    |
| Planning    | Crew planning, Service optimisation                                                                    |
| Data        | Operations data, Supplied datasets, Control log, Network records, Workshop register, Passenger reports |
| Finance     | Cost options                                                                                           |

The menu reference is `lionlink-operations-source/ops-console/index.html`, with behavior inspected in `ops-console/app.js`. Its Day schedule, Vehicle register, Workshop register, Control log, and Resource records menus informed the new destinations. The app renders existing SQLite records through the shared dataset table. It does not import the reference console's generated state or implement its as-of-time simulation.

| Reference menu    | App destination          | Source records                                                                                                              |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Day schedule      | Data / Operations data   | Trips, timetable records, stop calls, service calendar                                                                      |
| Vehicle register  | Data / Operations data   | Vehicles                                                                                                                    |
| Workshop register | Data / Workshop register | Workshop work orders, workshop vehicles, vehicle readiness                                                                  |
| Control log       | Data / Control log       | Control actions                                                                                                             |
| Resource records  | Data / Operations data   | Crew duties, resource updates, terminal movements, planning constraints, origin arrivals, queue windows                     |
| Network map       | Deferred                 | Routes, stops, service patterns, and rail records remain accessible through Data / Network records. This page is not a map. |

## Implementation

`apps/web/lib/dashboard-navigation.ts` owns the workspace tree and derives the allowed page IDs. `DashboardReport` exhaustively renders those IDs. `DashboardSidebar` composes the shared shadcn sidebar and collapsible components. Its links retain unrelated query parameters, including the planner's selected service, date, and assumptions. Mobile selection closes the navigation drawer. Back navigation reveals the restored page's workspace.

Two designs were considered. Sidebar links that drove existing nested tabs would duplicate navigation state across components. The chosen page tree removes the workspace tab layers and uses one URL selection for the sidebar and report. Contextual tabs remain for service investigation and chart comparisons. `DatasetPicker` replaces long dataset tab strips with a labeled select while preserving search, filtering, exports, and existing record actions.

Historical vehicle and period controls appear only on Fleet overview and Maintenance history. They do not imply that workshop or operating records use monthly-history filters.

## Verification

Run `pnpm check`. The dashboard tests open every workspace report, switch workshop datasets, check historical-filter scope, exercise browser Back, and preserve planning assumptions. The service-planning investigation still checks thresholds, candidate evidence, and replay observations.

In the running app, open `/dashboard?view=workshop-register`. Confirm Data is expanded and Workshop register is selected. Change the Dataset selector to workshop vehicles. Open Planning / Service optimisation, change an assumption, visit another workspace, and return. Confirm the assumption remains. Reload the URL and use browser Back to verify page selection. At a mobile viewport, open the sidebar, expand Data, and select Control log. Confirm the drawer closes and the page has no horizontal overflow outside its table.

Fleet overview owns recorded distance, operating hours and the all-service history map. Maintenance history owns maintenance costs, repair counts, repair cost per kilometre, spending comparisons and maintenance hold charts, with detailed monthly vehicle history in Data / Supplied datasets. Engineering readiness records are under Data / Workshop register; Data / Operations data contains vehicle identity records. Historical filters apply to usage metrics in Fleet and maintenance metrics in Maintenance, not to the independently dated service replay.

Planning / Crew planning shows a read-only timeline of planned trip assignments and supplied crew-duty records. Date and service filters, crew-ID search, and 25-row pagination keep the view navigable. Service filtering retains other assignments for matching crews in muted colors, so cross-service conflicts stay visible. Overlapping trips use separate tracks; red outlines mark trip overlaps and protected-break conflicts. Half-open time intervals allow a trip to end exactly when another starts or a break begins. Missing duty, qualification, location, timing or break evidence remains unverified. Gaps are not availability claims. Click a trip, duty band or break to inspect source IDs and location evidence. Crew names are not present in the source, so rows use crew IDs.

The read-only `/api/crew-planning?date=YYYY-MM-DD` endpoint reads planned assignments and dated crew duties from SQLite. This view does not approve assignments or calculate transfer feasibility and continuous-duty compliance. Test conflict boundaries and incomplete evidence with `crew-planning.test.ts`; in the browser verify service/date filtering, crew search, pagination, assignment details and break details.

Fleet / Vehicle register shows a planned vehicle timeline. It shares the timeline renderer with Crew planning, with service-colored trips labeled by crew, recorded readiness windows, and maintenance holds. Date/service filters, vehicle-ID search, pagination and selection details work on the planning timeline. The separately held workshop cohort remains labeled. Click a vehicle ID to inspect evidence even without a planned trip.

The read-only `/api/vehicle-planning` endpoint reads planned assignments, vehicle rosters, dated readiness and the same maintenance sources used by Service optimisation. Missing confirmed releases keep holds open; estimated completion is not a release. Exact release/end boundaries do not conflict. Overlapping planned trips or maintenance holds produce red outlines. Missing readiness, location or timing evidence remains unverified. Readiness alone does not establish turnaround, positioning or crew feasibility. Known event times set the visible time axis; longer open holds are clipped to that displayed window, with full timestamps in details.

Vehicle tests cover open holds, confirmed-release boundaries, cross-service overlaps, missing evidence, planned assignments and the separate workshop cohort. Browser checks cover search, filters, hold/trip details, and Crew planning after the shared renderer change.

## Raw data workspace

Data owns raw table browsing, search, filtering, export and record actions. Operations data lists every table in the operations manifest, and Supplied datasets lists every imported dataset. Control log, Network records, Workshop register and Passenger reports retain their existing page URLs under Data. The empty Passengers workspace is removed.

Analysis tables stay in their reports, including service comparisons, queue hotspots, planning watchlists, candidate evidence and departure timelines. Raw dataset pickers no longer appear below fleet, schedule, maintenance, workshop, festival, incident or cost views. The navigation test checks this separation and preserves direct links and browser history.

Resource overview has been removed. Crew, readiness, movement and operating requirement source tables remain in Data / Operations data. Passenger queues replaces its queue-hotspots table with the interactive queue-observation dot field. The operating date selects one day. The page service filter controls summary metrics; Queue observations has independent Service and Direction selectors. Service optimisation links to this visual with its selected service, date and assumptions. Its supporting evidence and excluded vehicle reviews open on demand; only the service watchlist and supported candidate comparison remain as tables.

Incident response, Festival allocation and Workshop planning report pages have been removed. Their supplied datasets remain under Data. Service planning is now labeled Service optimisation; the existing `view=service-planning` URL stays valid.
