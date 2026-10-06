---
title: Accessible journeys with verified transfer paths
description: Route passengers through a graph that distinguishes accessible, inaccessible, and unknown connections.
---

## Problem and proposed outcome

A passenger who needs step-free access cannot choose a journey from stop coordinates alone. A geographically short transfer might include stairs, an unavailable lift, or an unverified crossing. The proposed product answers a bounded question at departure time. Which complete journeys satisfy this passenger's access requirements, and which connections still need confirmation?

This is a hypothesis about a useful passenger service. The supplied fictional records establish network structure, not the frequency of failed accessible journeys. [Passenger accounts](/docs/passenger-findings/) explains why selected reports cannot establish that frequency.

## Evidence and missing inputs

The operation CSV collections include `stops.latitude`, `stops.longitude`, and `route_stops.stop_order`. `rail_links` supplies station connections, but its `geometry_kind` describes schematic connections. `vehicles.wheelchair_spaces` describes vehicle capacity. None of these fields proves that a pedestrian transfer is accessible.

The prototype needs a surveyed transfer dataset with entrances, gradients, crossing requirements, lift status, verification time, and an owner responsible for updates. It also needs passenger-selected limits, such as maximum walking distance. These are new inputs. A straight line between a bus stop and a station must never become a verified walking connection through inference alone. [Evidence sources](/docs/applications/) defines the existing extract's limited coverage.

## Mechanism and action

Represent boarding points, entrances, and platforms as graph nodes. Directed edges describe walking, riding, and transferring. Each edge carries an access status and evidence expiry. A routing search first excludes edges incompatible with the selected requirements. It then ranks the remaining complete paths by travel time and transfers.

Unknown access stays a separate state. If no fully verified path exists, the result identifies the unresolved connection and an assistance option. It does not silently relax the passenger's requirements. A selected journey produces ordered travel instructions with the verification time for each transfer. Updated lift status invalidates affected paths and triggers a new search.

## Small prototype and falsification

Use two bus routes and one rail interchange. Add manually authored transfer edges marked as prototype fixtures. Demonstrate a short path through an unavailable lift and a longer verified alternative. The system must select the alternative. Remove its access evidence and the system must report that no verified journey exists.

Acceptance requires every proposed path to meet every declared access constraint, including after a closure update. A user walkthrough should establish whether the result supports a travel decision. Reject this direction if the operator cannot maintain transfer evidence or passengers cannot distinguish verified access from unknown access.

## Tradeoffs and distinctness

Access requirements can reveal sensitive needs. Store them locally where practical, and avoid accounts for a basic journey search. Route quality depends on maintained infrastructure evidence, so a broad but stale graph is a poor first release.

The closest idea is accessible-space reservation. Routing chooses a feasible sequence of connections. Reservation allocates a scarce place on a particular departure through concurrent holds. Neither establishes the other's guarantee. Stop alerts, meanwhile, recognize progress along an already chosen journey rather than choose that journey.
