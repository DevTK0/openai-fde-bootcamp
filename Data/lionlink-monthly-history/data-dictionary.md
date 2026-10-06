# Monthly fleet history: coverage and definitions

All records are fictional LionLink exercise data. The files cover **eight selected buses**, not the complete 172-vehicle operating fleet. Currency is SGD excluding tax. Dates use Singapore local time.

The monthly history covers **1 October 2024 to 30 September 2026**. It contains one complete monthly summary for each of these eight vehicles: 192 rows. The financial comparison contains the same repair totals grouped into two equal twelve-month periods. It is a summary of the monthly file, not additional spending.

The earlier period is supplied as monthly summaries and twelve selected component observations. October 2026 remains available through the existing, more detailed job and operating extracts. This is a difference in the extracts supplied for the exercise; it does not imply that LionLink changed its recording systems.

## Repair spending by vehicle

`repair_spend_by_vehicle.csv` has sixteen rows. Its key is `period_start`, `period_end`, `vehicle_id`.

| Field | Meaning |
| --- | --- |
| `period_start`, `period_end` | Inclusive dates of each complete twelve-month period: October–September. These are not calendar-year totals. |
| `vehicle_id` | Bus identifier shared with Engineering and Operations. |
| `repair_count` | Completed corrective repair jobs in the period; the sum of monthly repair counts. |
| `repair_cost_sgd` | Recorded parts and labour charges for those jobs; the sum of monthly repair charges. Scheduled services, additional preventive work and proposed quotes are excluded. |

## Monthly vehicle history

`monthly_vehicle_history.csv` has 192 rows. Its key is `month`, `vehicle_id`. Numeric fields are complete for the supplied monthly ledger: **zero means none recorded in that month**, not missing data. There are no missing monthly numeric values.

| Field | Meaning |
| --- | --- |
| `month` | Calendar month in `YYYY-MM` form. |
| `vehicle_id` | Shared vehicle identifier. Vehicle type, capacity and in-service year remain in the existing vehicle register. |
| `recorded_km` | Total running distance in this monthly ledger, including positioning. It is a matched-period measure of use. It does not identify individual routes, trips or route difficulty. |
| `recorded_operating_hours` | Time running, including positioning; excludes stationary waiting, workshop time and crew breaks. |
| `month_end_exercise_odometer_km` | Fictional exercise odometer after the month's recorded movement. Consecutive month-end differences equal the later month's `recorded_km`. The first month's opening reading can be obtained by subtraction. |
| `repair_count` | Completed corrective repair jobs. A repair can follow a fault found between duties; this is **not a count of roadside breakdowns or cancelled trips**. Separate visits are separate jobs even when symptoms sound similar. |
| `repair_cost_sgd` | Incurred parts and labour charges for those repairs. Quotes and other maintenance categories are excluded. |
| `scheduled_service_count` | Completed required routine services. The supplied fictional requirements remain 600 recorded km or 14 calendar days, whichever comes first. |
| `scheduled_service_cost_sgd` | Charges for the routine services, including their ordinary visual checks. |
| `additional_preventive_visits` | Planned component checks or cleaning outside the required routine-service scope. These visits may concern different components. A count alone does not identify the work or its effectiveness. |
| `additional_preventive_cost_sgd` | Charges for that additional work; excluded from routine-service and repair charges. |
| `repair_unavailable_hours` | Elapsed time the vehicle was unavailable under corrective repair holds. Includes checks before release. It is not passenger delay or lost service time. |
| `scheduled_maintenance_unavailable_hours` | Elapsed vehicle unavailability for required routine service and additional preventive work, excluding any time already counted as a repair hold. |

The two unavailable-hour fields do not overlap in these monthly records. Add them to obtain the recorded maintenance unavailability. They do not show whether cover ran, which departures were affected or whether passengers waited longer. The monthly file contains no historical route assignments, complaint totals, cancellations or driver records.

## Selected component observations

`selected_component_observations.csv` has twelve selected visits, not the complete repair or inspection ledger. Its key is `observation_id`. Absence of a visit from this selected extract does not mean no other work happened.

| Fields | Meaning |
| --- | --- |
| `observation_id`, `observed_on`, `vehicle_id`, `component` | Visit reference, date, vehicle and component examined. |
| `exercise_odometer_km` | Fictional reading at the recorded check, consistent with the monthly totals. |
| `previous_component_attention_on`, `previous_component_attention_odometer_km` | Date and reading recorded for the previous cleaning or corrective attention to this component. Routine visual checks may take place in between; they do not reset this measure. These references can precede the selected visit extract. |
| `previous_observation_id` | Earlier visit in this extract, where included. Blank means that previous visit is referenced but not supplied as a separate observation row. |
| `km_since_component_attention` | Current reading minus the previous component-attention reading. It is not distance since the last required routine service. |
| `condenser_obstruction_before_pct`, `condenser_obstruction_after_pct` | Technician's visual estimate of the condenser face obstructed by debris, to the nearest five percentage points, before and after the recorded work. Blank means not applicable to the door component. This is not a general vehicle condition score. |
| `observed_condition`, `action_taken` | Workshop finding and recorded action. Different findings can occur when a vehicle returns with a similar symptom. |
| `work_category` | `repair` or `additional_preventive`; identifies the corresponding monthly cost/count category. |
| `charge_sgd`, `unavailable_hours` | Included parts/labour charge and vehicle hold for this visit. Both are already included in the corresponding monthly figures; do not add them again. |

For the initial prior-attention references, NW-V020's 5 December 2025 condenser clean, NW-V009's 13 January 2026 condenser clean and NW-V002's 12 December 2025 condenser clean were additional preventive visits. NW-V005's 10 December 2025 door-runner cleaning was included in its required routine service. Subsequent referenced actions can be followed directly through `previous_observation_id`. Additional preventive visits to other components do not reset a component's attention interval.

## Connecting to the existing detailed records

- Join by vehicle and the matching month or dates. Use the existing October Operations assignments when matching the October passenger cases. An October assigned service is not evidence of a bus's route throughout the preceding two years.
- September's monthly repair totals already include the **SGD450** NW-V020 hose repair on 28 September and the **SGD55** NW-V039 lighting repair on 30 September. These existing detailed jobs are included subsets, not extra charges.
- September month-end odometers precede the existing 4 October baseline service. The differences represent 1–4 October distance, outside this monthly table: NW-V001 60 km; NW-V002 40 km; NW-V005 80 km; NW-V009 100 km; NW-V020 50 km; NW-V039 60 km; NW-V050 30 km; NW-V140 20 km. Do not add these differences to September totals or to the 5–16 October usage extract.
- The October usage extract covers ten supplied weekday mornings and their downstream journeys, not a complete month. Do not compare its raw totals with complete-month totals, or divide two years of repairs by October-only mileage.
- The existing October Engineering extract is selected history. Its missing rows cannot be interpreted as zero repairs for a whole October month. Its jobs and service costs are outside the two complete twelve-month periods above.
- Historical summaries do not replace Engineering's current release decision. They do not establish a mechanical cause for October delays, driver-cover decisions, boarding queues or the separate evening incident.

The vehicle sample is small and selected. Comparisons can identify questions and proposed changes to test; they do not establish a whole-company cost forecast or a measured saving from an intervention.
