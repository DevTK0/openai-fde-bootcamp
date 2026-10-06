---
title: Distinct problems and solution mechanisms
description: Proposed LionLink projects distinguished by their decisions, inputs, and implementation mechanisms.
sidebar:
  order: 0
---

These proposals extend the fictional LionLink exercise into possible projects.
They are hypotheses to test, not validated customer needs or promised savings.
The [evidence sources](/docs/applications/) describe the supplied records and their limits.

Each article explains a concrete decision, a mechanism that produces an action,
and a small experiment that can reject the idea. Sharing fleet data does not make
solutions identical. Reusing the same mechanism with a different report title does.
No proposal depends on a new graph or document-search interface as its main result.

## Problems and mechanisms

| Problem                                                                                                                  | Distinct mechanism                     | Decision or output                        |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ----------------------------------------- |
| [Workshop scheduling with service-cover constraints](/docs/explanations/opportunities/01-workshop-scheduling/)           | Constraint scheduling                  | Feasible bookings and cover assignments   |
| [Headway control through bounded departure feedback](/docs/explanations/opportunities/02-headway-control/)               | Feedback control                       | Bounded departure holds                   |
| [Dispatch instructions with replayable command history](/docs/explanations/opportunities/03-dispatch-ledger/)            | Event sourcing and concurrency control | Authoritative accepted commands           |
| [Crew-duty rules as executable assignment checks](/docs/explanations/opportunities/04-crew-duty-checking/)               | Executable temporal rules              | Assignment violations or unknown coverage |
| [Festival contingency plans through queue simulation](/docs/explanations/opportunities/05-festival-simulation/)          | Discrete-event simulation              | Contingency queue consequences            |
| [Component risk estimates with incomplete failure histories](/docs/explanations/opportunities/06-component-survival/)    | Censored survival estimation           | Uncertain component risk                  |
| [Mechanic questioning based on information gained](/docs/explanations/opportunities/07-diagnostic-questioning/)          | Sequential information gain            | Next diagnostic test                      |
| [Spare-part replenishment under uncertain lead times](/docs/explanations/opportunities/08-spare-parts/)                  | Inventory control                      | Reorder thresholds and quantities         |
| [Visual inspection assistance for a bounded component condition](/docs/explanations/opportunities/09-visual-inspection/) | Image segmentation                     | Reviewed obstruction measurement          |
| [Repair charges reconciled against orders and receipts](/docs/explanations/opportunities/10-invoice-reconciliation/)     | Document reconciliation                | Matched charges and exceptions            |

## What counts as a separate project

Scheduling selects a feasible plan. Rule checking judges a proposed plan.
Simulation estimates consequences under uncertain inputs. Inventory control sets
repeated stock decisions. These can share constraints, but their inputs, outputs,
and failure tests differ. The individual articles explain the closest boundaries.

The current fixtures support some prototypes directly and only motivate others.
Images, invoices, part ledgers, complete component histories, and live telemetry
need new data. A proposal that needs those inputs says so explicitly.
