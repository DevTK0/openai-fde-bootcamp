---
title: Stop alerts that recognize progress on the device
description: Warn a passenger near a chosen stop through local location processing with explicit uncertainty.
---

## Problem and proposed outcome

A passenger on an unfamiliar route wants a warning before the destination stop. A static route list still requires attention throughout the trip. The proposed service recognizes progress along a selected journey and issues a local alert when the passenger approaches the target.

This is a passenger-assistance hypothesis. The supplied accounts do not establish how often passengers miss stops or whether they want location-based alerts. The prototype must validate usefulness with the intended passengers rather than treat the presence of coordinates as evidence of demand.

## Evidence and missing inputs

`stops.csv.gz` includes `latitude`, `longitude`, and stop descriptions. `route_stops.csv.gz` supplies `route_id`, `stop_order`, and `source_stop_sequence`. The ordered sequence matters because a loop can revisit the same stop. `trips.csv.gz` supplies a journey identifier, but it is a historical extract rather than a live device-position feed.

The proposal needs device location samples, accuracy estimates, consent, background execution support, and an explicit selected direction. [Journey reliability](/docs/reliability-findings/) explains the limits of schedule and observed timing. [Evidence sources](/docs/applications/) prevents the historical records from being presented as live service tracking.

## Mechanism and action

Download the selected stop sequence to the device. A local state machine moves through unconfirmed journey, tracking, approaching target, alerted, and ended states. It uses recent locations, reported accuracy, and ordered progress to reject jumps to nearby stops on another leg.

Different entry and exit thresholds prevent repeated alerts when a noisy location oscillates around a boundary. Require plausible forward progress before the target alert becomes eligible. The user can correct the selected direction or end tracking. When accuracy is insufficient, show that the alert cannot be relied on and retain the route list.

The action is a device notification or accessible audio cue. Location samples need not leave the device. The prototype must still examine the behavior of the chosen platform when background execution or notification permission is unavailable. An open foreground demo cannot prove that a locked phone will alert.

## Small prototype and falsification

Replay invented position traces against one loop route. Include an approach, a pass on the wrong direction, repeated noisy boundary crossings, and a long signal gap. Demonstrate one alert for the valid approach and no alert for the wrong leg.

Acceptance requires explicit uncertainty during gaps, no repeated alert from boundary noise, and a real-device check of the supported execution mode. Reject the product if supported devices cannot warn with enough lead time under normal use, or if passengers mistake the cue for a guaranteed stop announcement.

## Tradeoffs and distinctness

Battery use, accessibility of the alert, and location permission are product constraints. Keep a manual fallback and avoid promising safety-critical navigation.

Accessible journey routing searches for a complete path through infrastructure constraints. Stop alerts recognize position along a path the passenger already selected. Their core failure concerns noisy local sensing and background execution, not graph feasibility or transfer accessibility.
