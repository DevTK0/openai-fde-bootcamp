---
title: Distinct problems and solution mechanisms
description: Proposed LionLink projects distinguished by their decisions, inputs, and implementation mechanisms.
---

These 20 proposals extend the fictional LionLink exercise into possible projects.
They are hypotheses to test, not validated customer needs or promised savings.
The [evidence sources](/docs/applications/) describe the supplied records and their limits.

Each article explains a concrete decision, a mechanism that produces an action,
and a small experiment that can reject the idea. Sharing fleet data does not make
solutions identical. Reusing the same mechanism with a different report title does.
No proposal depends on a new graph or document-search interface as its main result.

## Problems and mechanisms

| Problem                                                                                                                    | Distinct mechanism                     | Decision or output                        |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------- |
| [Workshop scheduling with service-cover constraints](/docs/explanations/opportunities/01-workshop-scheduling/)             | Constraint scheduling                  | Feasible bookings and cover assignments   |
| [Headway control through bounded departure feedback](/docs/explanations/opportunities/02-headway-control/)                 | Feedback control                       | Bounded departure holds                   |
| [Dispatch instructions with replayable command history](/docs/explanations/opportunities/03-dispatch-ledger/)              | Event sourcing and concurrency control | Authoritative accepted commands           |
| [Crew-duty rules as executable assignment checks](/docs/explanations/opportunities/04-crew-duty-checking/)                 | Executable temporal rules              | Assignment violations or unknown coverage |
| [Festival contingency plans through queue simulation](/docs/explanations/opportunities/05-festival-simulation/)            | Discrete-event simulation              | Contingency queue consequences            |
| [Component risk estimates with incomplete failure histories](/docs/explanations/opportunities/06-component-survival/)      | Censored survival estimation           | Uncertain component risk                  |
| [Mechanic questioning based on information gained](/docs/explanations/opportunities/07-diagnostic-questioning/)            | Sequential information gain            | Next diagnostic test                      |
| [Spare-part replenishment under uncertain lead times](/docs/explanations/opportunities/08-spare-parts/)                    | Inventory control                      | Reorder thresholds and quantities         |
| [Visual inspection assistance for a bounded component condition](/docs/explanations/opportunities/09-visual-inspection/)   | Image segmentation                     | Reviewed obstruction measurement          |
| [Repair charges reconciled against orders and receipts](/docs/explanations/opportunities/10-invoice-reconciliation/)       | Document reconciliation                | Matched charges and exceptions            |
| [Accessible journeys with verified transfer paths](/docs/explanations/opportunities/11-accessible-journeys/)               | Constraint-based graph search          | Verified journey or unresolved transfer   |
| [A controlled experiment for additional preventive care](/docs/explanations/opportunities/12-preventive-care-experiment/)  | Randomized controlled experiment       | Evidence for expanding optional care      |
| [Defect reports that survive a lost connection](/docs/explanations/opportunities/13-offline-defect-capture/)               | Durable offline synchronization        | Saved observations and explicit conflicts |
| [Consistent disruption notices across languages](/docs/explanations/opportunities/14-disruption-notice-compiler/)          | Typed notice compilation               | Consistent approved passenger notices     |
| [Incident rehearsal with branching decisions](/docs/explanations/opportunities/15-incident-rehearsal/)                     | Branching procedural rehearsal         | Decision replay and training debrief      |
| [Synthetic case generation without copying passenger records](/docs/explanations/opportunities/16-synthetic-case-factory/) | Seeded case generation                 | Reproducible synthetic fixture pack       |
| [Source contracts that quarantine incompatible refreshes](/docs/explanations/opportunities/17-source-contracts/)           | Versioned data contracts               | Accepted dataset or quarantined refresh   |
| [Stop alerts that recognize progress on the device](/docs/explanations/opportunities/18-local-stop-alerts/)                | Local progress state estimation        | Destination alert with uncertainty        |
| [A reverse auction for comparable workshop work](/docs/explanations/opportunities/19-supplier-auction/)                    | Qualified reverse auction              | Ranked compliant bids for review          |
| [Verifiable Engineering release certificates](/docs/explanations/opportunities/20-signed-release-certificates/)            | Public-key signature verification      | Scoped release-authenticity receipt       |

## What counts as a separate project

Scheduling selects a feasible plan. Rule checking judges a proposed plan.
Simulation estimates consequences under uncertain inputs. Inventory control sets
repeated stock decisions. These can share constraints, but their inputs, outputs,
and failure tests differ. The individual articles explain the closest boundaries.

Several pairs share data but answer different questions. Forecasting estimates
component risk, while randomized assignment tests whether extra care causes a
change. Queue simulation estimates operational consequences, while rehearsal
scores a learner against an authored procedure. Journey routing selects a path,
while stop alerts recognize progress along a selected path.

The dispatch ledger orders accepted commands. Offline capture preserves delayed
writes and resolves conflicts. Signed certificates establish the issuer and
integrity of a read-only statement. None supplies the other two guarantees.

The current fixtures support some prototypes directly and only motivate others.
Images, invoices, part ledgers, complete component histories, and live telemetry
need new data. A proposal that needs those inputs says so explicitly.
