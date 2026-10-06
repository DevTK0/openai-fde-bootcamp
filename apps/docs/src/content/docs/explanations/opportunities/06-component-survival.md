---
title: Component risk estimates with incomplete failure histories
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

An engineer wants to decide which component deserves an earlier inspection. Ranking buses by recorded repair count treats a component observed for a short period like one observed for years. It also treats a component with no recorded failure as if its full lifetime were known. The decision needs an explicit time-at-risk model and an honest uncertainty estimate.

## Evidence

The fictional `selected_component_observations` table includes observation `MH-OBS04`, `component`, `observed_on`, `previous_component_attention_on`, `km_since_component_attention`, and `observed_condition`. `monthly_vehicle_history` supplies `recorded_km` and `repair_count`. The selected work-order table `01_maintenance_and_repairs/Repairs/8` includes `Fault family` and `Opened at`. [Evidence sources](/docs/applications/) warns that selected jobs cannot establish absence of faults between records.

## Mechanism

Construct component episodes that begin at a verified installation or repair and end at a verified failure or observation cutoff. A censored survival model estimates the probability of failure before a proposed future exposure, while retaining episodes that end without an observed failure. Distinguish unknown episode starts from known starts. Calibrate risk on held-out vehicles, then suggest an inspection window only when uncertainty is narrow enough for the agreed decision.

## Small prototype

Start with a synthetic episode set whose true failure process is known, using fixture fields to demonstrate the intended joins. Compare a basic age-based baseline with one simple survival estimator. Display the episode definition and uncertainty behind each proposed inspection. The existing selected observations can demonstrate data gaps, but they are not sufficient to establish a useful predictive model.

## Missing data and assumptions

The project needs component identifiers, installation dates, complete failure capture, replacements, usage exposure, and reasons observation stopped. A preventive replacement may depend on suspected deterioration, so treating every replacement as harmless censoring can bias risk. The eight-vehicle historical selection cannot support a fleet-wide accuracy claim. More rows alone do not repair a biased observation process.

## Failure modes and safeguards

False reassurance can postpone necessary inspection. Keep mandatory service and reported defects outside the model's discretion. Use risk estimates to prioritize additional inspection, never to release a held vehicle. Report abstention for incomplete episodes and assess calibration separately by component family. Avoid treating several observations of one component as independent vehicles.

## Acceptance and falsification

A future pilot needs better calibrated risk than an agreed age-only baseline on unseen vehicles, with uncertainty intervals that cover observed outcomes at their declared rate. Record missed failures and unnecessary inspections as separate costs. Falsify the proposal if episode reconstruction is unreliable, event counts are inadequate, or the apparent improvement disappears when evaluation separates vehicles rather than individual rows.

## Difference from nearby ideas

[Diagnostic questioning](/docs/explanations/opportunities/07-diagnostic-questioning/) chooses the next test after a symptom appears. This proposal estimates future risk before a fault is confirmed. [Visual inspection](/docs/explanations/opportunities/09-visual-inspection/) measures a present visible condition. None of these methods can replace the others' inputs or justify Engineering release by itself.
