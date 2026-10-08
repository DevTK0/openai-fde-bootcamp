# Operations planning evaluation

Both final combined pipelines had zero observed errors on the frozen corpus. This does not establish that either model is mistake-proof or intrinsically better.

| Measurement | Decisions | Astra |
| --- | ---: | ---: |
| Network workflows | 876 | 876 |
| Additional tournament and policy workflows | 60 | 60 |
| Model eligibility assessments | 1,080 | 1,080 |
| Model comparison calls | 160 | 160 |
| Imported-source assessments | 24 | 24 |
| Physically unavailable proposals excluded before model calls | 4,603 | 4,603 |
| Observed errors or failed workflows | 0 | 0 |

The 876 network cases contain 5,263 proposals. Physical checks exclude 4,603; Decisions assesses the remaining 660. Thirty additional cases run with two grouping seeds. They add 420 eligibility assessments and 160 comparisons. The four imported cases each assess six alternatives.

All 660 paired core eligibility input strings matched byte-for-byte between providers. The production engine replay also matched all 1,240 saved network eligibility and comparison requests. The committed runner verifies hashes of the actual request inputs, instructions, and choices before accepting saved answers.

Coverage accounting found all 6,900 trips, 1,720 bus-day records, and 3,272 crew-day records in projected candidate evidence. All 10 dates and 36 route directions occur. All 40 imported datasets occur in the imported-case evidence. This includes pre-model excluded candidates. It is not a claim that the model assessed every raw row or every possible combination.

The frozen database SHA-256 is `a2bc78bbe14d19589b94de411120c2ff4e55e21667e5ae3cc1947dc46ad2a1b2`.

## Earlier failures and changes

An earlier raw Decisions classifier produced 204 errors across 4,386 completed assessments, including 181 unsafe approvals. Those results are not erased by the final pass. The final gate measures candidate construction plus model assessment. Deterministic exclusions are never counted as AI successes.

Input improvements preserve the original capacity baseline, complete touched-resource schedules, per-crew duty spans, exact time differences, incident status overlays, and scenario-added policies. Choice descriptions expose changed-assignment counts and minimum capacities. Duplicating policy text into question instructions made results worse and was reverted.

The application searches the live resource catalog rather than only the small frozen candidate pools. Regression tests and live UI checks cover that integration separately. Retained commitments now include takeover time when an earlier replacement makes the driver change buses. Frozen requests remain unchanged for reproducible historical comparison.

## Evidence

- `corpus.jsonl.gz` contains the frozen network cases, gold expectations, grouping seeds, saved Decisions answers, and request hashes.
- `handouts.json.gz` contains the four actual handout requests, responses, and expected outcomes.
- `raw-classifier-failures.json` preserves the earlier failed raw-classifier audit.
- `replay-verification.json` and `ui-verification.json` record packaged replay and live UI verification.
- `benchmark-summary.json` records the paired final live results and descriptive trace metrics.
- `projected-coverage.json` records full core-record coverage in projected evidence.
- `production-parity.json` and `packaging-parity.json` record the packaging checks.

Request-file timings were collected during overlapping runs. They are descriptive, not a controlled speed benchmark. This finite corpus was used during tuning, so it is a regression gate rather than an unseen estimate of real-world accuracy. Arbitrary new policies, incidents, and resource combinations require further evaluation.
