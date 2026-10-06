---
name: principle-test-behavior-not-implementation
description: "Apply when you write, change, or keep a test. Call the code the way its users do and assert the result they observe against a literal expected value. Use mutations to check coverage, accounting for observable effects and absence contracts."
---

# Test Behavior, Not Implementation

A test calls the code the way its users do and asserts the result they observe against a literal expected value. A test that asserts which calls the code made, or restates a constant the code contains, does neither.

The check: before you keep a test, ask whether it would still pass if every function it imports returned `undefined`. If yes, inspect whether it observes a meaningful effect or failure mode. The return-value mutation alone does not prove that a side-effect or absence test is useless. Strengthen tests that cannot detect the behavior they claim to cover.

**Why:** A test that cannot fail for a defect costs CI time and review attention and catches nothing. A constant pin also fails when someone edits the constant or the prompt it restates, so it prevents that edit.

**Patterns to inspect, not automatic reasons to delete a test:**

- **No assertion.** Confirm the subject has an observable contract the test checks; merely calling it may miss incorrect results.
- **Absence or call count only.** `not.toThrow`, `toBeUndefined`, or `toHaveBeenCalled` can survive a return-value mutation. Check the intended contract, arguments, state, or a contrasting input before deciding coverage is missing.
- **Self-referential.** `expect(f(a)).toBe(f(a))` can pass when both calls return `undefined`. Prefer an independently known expected result.
- **Constant pin.** A literal assertion over a constant may enforce a real compatibility contract. Otherwise test the consumer's behavior instead of duplicating the implementation.
- **Fixture asserts fixture.** Check that an assertion observes the subject's output or effect, rather than only data the test constructed.

`toBeDefined`, `toBeTruthy`, `toBeInstanceOf`, `toBeGreaterThan(0)`, `toEqual([])`, and `toHaveLength(0)` fail for `undefined`. They can provide valid smoke or empty-result coverage. Judge whether they prove the intended contract, not whether the matcher appears on a list.

**The fix:** call the subject inside the test body with one concrete input and assert the literal output or the observable effect, `expect(slugify("Hello, World!")).toBe("hello-world")`. For an absence, assert the presence on the other input in the same test. For a constant, test the mechanism that reads it with one input instead of restating the value. For a mock, assert the payload it received or the state after the call, not that it was called. When no such assertion exists, delete the test.

**Keep** a test of a relation across a table's rows (a key present in two tables, a parent that exists), and a compile-time check in a `*.test-d.ts` file.
