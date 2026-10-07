---
title: Twenty LionLink projects and the case for building them
description: Read the operational case, proposed workflow, implementation needs, and investment decision for twenty different LionLink projects.
---

Each article below makes the case for one possible LionLink project. It follows
an operational problem through a proposed solution, explains how a first version
would work, and identifies what the organization would need to make it useful.
The aim is to support a decision about what to investigate or implement.

The articles use the repository's fictional transport records as a starting
point. Those records can demonstrate a conflict or explain a design, but they
cannot establish real customer demand or financial returns. Each proposal
therefore distinguishes the available evidence from illustrative scenarios and
information that LionLink would still need to collect.

The first implementation differs by project. Some ideas can begin with a bounded
working tool. Others require a survey, a data-quality study, or an agreed
operating process before a substantial software investment makes sense. The
articles explain those decisions alongside simpler alternatives, practical
ownership, failure handling, and ways to judge whether the work is worthwhile.

| Article                                                                                                                                   | Proposed first implementation                                          | Main dependency                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Scheduling workshop repairs without cancelling protected services](/docs/explanations/opportunities/01-workshop-scheduling/)             | A repair schedule with workable bus and crew cover                     | Complete workshop bookings and service commitments               |
| [Keeping buses evenly spaced when service starts to bunch](/docs/explanations/opportunities/02-headway-control/)                          | Supervised recommendations for short departure holds                   | Timely vehicle observations and agreed passenger-delay limits    |
| [Preventing conflicting dispatch instructions for the same bus or driver](/docs/explanations/opportunities/03-dispatch-ledger/)           | One authoritative record of accepted dispatch instructions             | Agreed command authority and acknowledgement rules               |
| [Checking whether a relief driver can complete the whole assignment](/docs/explanations/opportunities/04-crew-duty-checking/)             | Checks that explain why a proposed crew assignment is invalid          | Complete duties and explicitly agreed operating rules            |
| [Testing whether festival shuttles can clear the crowd before closing](/docs/explanations/opportunities/05-festival-simulation/)          | A replay of festival arrivals, departures, and remaining queues        | Credible demand assumptions and boarding times                   |
| [Deciding which components deserve an earlier inspection](/docs/explanations/opportunities/06-component-survival/)                        | A study of whether component history supports useful failure estimates | Reliable component lifetimes and failure records                 |
| [Choosing the next useful test when a bus fault has several possible causes](/docs/explanations/opportunities/07-diagnostic-questioning/) | A guided choice of the next approved diagnostic test                   | Engineer-approved tests and defensible outcome assumptions       |
| [Ordering spare parts before a repair has to wait for delivery](/docs/explanations/opportunities/08-spare-parts/)                         | Part-by-part replenishment recommendations                             | A trustworthy stock ledger and supplier lead times               |
| [Making before-and-after condenser inspections comparable](/docs/explanations/opportunities/09-visual-inspection/)                        | Inspector-reviewed measurements of a visible component condition       | Representative photographs and agreed inspection labels          |
| [Checking that repair invoices match approved and completed work](/docs/explanations/opportunities/10-invoice-reconciliation/)            | A review queue for charges that do not match authorized work           | Itemized invoices, orders, and receipt records                   |
| [Helping passengers avoid inaccessible transfers](/docs/explanations/opportunities/11-accessible-journeys/)                               | A journey planner for surveyed accessible transfers                    | An owner who keeps physical access information current           |
| [Finding out whether extra preventive maintenance is worth funding](/docs/explanations/opportunities/12-preventive-care-experiment/)      | A controlled trial of additional preventive care                       | An approved intervention and sufficient follow-up evidence       |
| [Keeping defect reports when workshop devices lose their connection](/docs/explanations/opportunities/13-offline-defect-capture/)         | Defect reporting that preserves work through connection loss           | Device identity and ownership of conflicting reports             |
| [Giving passengers consistent instructions during a disruption](/docs/explanations/opportunities/14-disruption-notice-compiler/)          | Consistent notices generated from approved incident facts              | Maintained language templates and publication authority          |
| [Letting controllers practise difficult decisions before a live incident](/docs/explanations/opportunities/15-incident-rehearsal/)        | A rehearsal in which staff practice incident decisions                 | Reviewed scenarios and a defensible teaching rubric              |
| [Testing unusual passenger reports without copying passenger stories](/docs/explanations/opportunities/16-synthetic-case-factory/)        | Repeatable fictional cases for testing software                        | An agreed test specification and independently authored examples |
| [Stopping a data refresh from silently changing a report's meaning](/docs/explanations/opportunities/17-source-contracts/)                | A check that accepts or quarantines a new dataset version              | Named owners for data meaning, coverage, and change rules        |
| [Warning passengers before they miss an unfamiliar stop](/docs/explanations/opportunities/18-local-stop-alerts/)                          | Stop reminders that recognize journey progress on a phone              | Usable location permissions and realistic journey trials         |
| [Getting comparable workshop prices before choosing a supplier](/docs/explanations/opportunities/19-supplier-auction/)                    | A bidding trial for a tightly specified category of work               | Comparable scope and genuinely competing qualified suppliers     |
| [Checking that an Engineering release record is genuine](/docs/explanations/opportunities/20-signed-release-certificates/)                | Local verification of a signed Engineering release record              | Managed signing keys and an acceptable revocation policy         |
