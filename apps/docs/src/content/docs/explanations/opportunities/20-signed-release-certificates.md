---
title: Verifiable Engineering release certificates
description: Verify the issuer and integrity of a scoped release record while making revocation limits explicit.
---

## Problem and proposed outcome

A controller receives a release record while the source system is temporarily unreachable. A screenshot or copied message does not prove who issued it or whether someone changed its vehicle identifier. The proposal lets a device verify a signed certificate against a trusted Engineering issuer.

This is an authenticity hypothesis, not evidence of current forgery. The desired answer is narrow. Did an authorized key sign these exact release facts, and does the certificate satisfy the verifier's validity policy? A signature does not establish present roadworthiness or permission to dispatch.

## Evidence and missing inputs

`workshop_work_orders.csv.gz` includes `work_order_id`, `vehicle_id`, `confirmed_release_at`, and `release_status`. `vehicle_readiness.csv.gz` includes `issued_at`, `available_from`, `available_until`, and `release_state`. [Workshop capacity](/docs/workshop-findings/) explains why expected completion cannot substitute for a confirmed Engineering release.

These fictional records are unsigned. The proposal needs an authorized signing service, protected private keys, public-key distribution, key rotation, certificate identifiers, a revocation source, and a freshness policy. [Evidence sources](/docs/applications/) defines the supplied records' scope. No existing column proves a trust relationship with an issuer.

## Mechanism and action

After Engineering records a release, the signing service creates a canonical payload containing the issuer, certificate identifier, vehicle, work order, release scope, issue time, and expiry. A digital signature binds that payload to the issuer's signing key. A device receives the certificate as a file or scannable code.

The verifier checks the signature with a cached trusted public key. It then checks the exact vehicle and work order, scope, validity interval, and revocation information. The result separates signature validity from policy acceptance. If revocation information exceeds the allowed age, the device reports that it cannot confirm current acceptance offline.

The output is an authenticity receipt for the release record. Dispatch still requires the current operational checks and authority. A newly reported defect can invalidate the usefulness of an authentic historical release without changing its signature.

## Small prototype and falsification

Use disposable test keys and a fixture certificate. Demonstrate acceptance of the original, rejection after a vehicle field changes, rejection on the wrong vehicle, and rejection after expiry. Revoke the certificate and show that an updated cache rejects it. With an older cache, display the precise freshness limitation instead of claiming knowledge of the revocation.

Acceptance requires independent verification of the encoded payload, enforced scope, bounded cache age, and explicit failure when a trustworthy clock or key is unavailable. Reject the proposal if operations need immediate revocation knowledge during disconnection. Offline signatures cannot meet that requirement.

## Tradeoffs and distinctness

Key compromise requires rotation and revocation procedures. Short validity reduces stale acceptance but increases renewal dependence. Choose those limits with Engineering rather than treating cryptographic validity as an operational safety decision.

The dispatch ledger orders authorized commands. Offline defect capture preserves and reconciles disconnected writes. This proposal verifies the authenticity of a read-only statement using public-key signatures. It adds a different trust mechanism and does not merge reports, schedule resources, or authorize movement.
