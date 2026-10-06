---
title: Visual inspection assistance for a bounded component condition
description: A proposed LionLink problem and solution, with evidence limits and a falsifiable prototype.
---

## Problem

An inspector compares a component's condition before and after cleaning. Free-text descriptions such as dirty or partly blocked make later comparisons difficult, especially across inspectors. The bounded problem is to measure a visible condition consistently enough to support a human inspection decision.

## Evidence

The fictional `selected_component_observations` table contains `component`, `condenser_obstruction_before_pct`, `condenser_obstruction_after_pct`, and `observed_condition`. Observation `MH-OBS04` names a cooling condenser and records before-and-after obstruction values. [Evidence sources](/docs/applications/) describes selected maintenance observations. There are no photographs or annotated image regions in these records, and their numeric values do not establish an image model's accuracy.

## Mechanism

Capture a standardized image of the approved inspection area with a scale and capture-quality checks. A segmentation model marks the visible condenser region and the portion judged obstructed. The system computes an area ratio and returns an annotated image for the inspector to accept or correct. The corrected region becomes a labeled example after review. Low-quality or unfamiliar views produce an abstention instead of a fabricated percentage.

## Small prototype

Collect a small, consented set of staged component images under several lighting and camera positions. Have two qualified inspectors label each image independently. Compare a simple image-processing baseline with a segmentation approach on images held out by physical component. The prototype ends with an inspection annotation, not a release decision or automatic maintenance order.

## Missing data and assumptions

The project needs actual images, camera protocols, annotation rules, equipment access, and agreement on what visible obstruction means. A percentage of the visible area may not represent airflow restriction or internal damage. The records cannot establish that link. Any claim about operating effect requires separate measurements under controlled conditions, not a correlation with a subjective image label.

## Failure modes and safeguards

Lighting, reflections, and a changed camera angle can mimic condition changes. Reject unsuitable images and show the original beside the annotation. Exclude people and identifying material from the capture area where possible. Do not infer that a visually clean component is mechanically sound. Hidden damage, electrical faults, and release checks remain outside this method's scope.

## Acceptance and falsification

Require repeat captures of the same unchanged component to stay within an agreed measurement tolerance. Compare model error with inter-inspector disagreement on held-out components and report abstention rates. Include deliberately poor images to verify rejection. Falsify the proposal if capture variation is larger than meaningful condition changes, or if inspectors cannot agree on the target region and obstruction definition.

## Difference from nearby ideas

[Diagnostic questioning](/docs/explanations/opportunities/07-diagnostic-questioning/) decides which test to perform next. This proposal converts one permitted visual test into a reviewable measurement. [Component survival](/docs/explanations/opportunities/06-component-survival/) estimates future failure risk across episodes. Image segmentation measures a present condition and has a different data requirement, failure mode, and output.
