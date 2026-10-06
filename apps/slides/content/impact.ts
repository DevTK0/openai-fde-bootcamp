import type { Slide, Visual } from "./decks"
import evidence from "./evidence.json"
const f = (n: number) => n.toLocaleString("en-SG", { maximumFractionDigits: 0 })
const h = evidence.history
const total = (year: typeof h.earlier) =>
  year.repair + year.servicing + year.preventive
const impact = (
  title: string,
  caption: string,
  source: string,
  visual: Visual,
  notes: string
): Slide => ({ stage: "Impact", title, caption, source, visual, notes })
const history = "Monthly maintenance and mileage records · Oct 2024 to Sep 2026"

// Only recorded dollar changes qualify here. No supplied comparison establishes
// a change in ridership or a financial consequence for the remaining nine decks.
export const impacts: Partial<Record<string, Slide>> = {
  "repair-spend": impact(
    `Annual repair costs rose by S$${f(h.latest.repair - h.earlier.repair)}.`,
    "The increase covers eight buses. It is not a measure of possible savings.",
    history,
    {
      kind: "calculation",
      operator: "−",
      terms: [
        { value: f(h.latest.repair), lines: ["Later year"] },
        { value: f(h.earlier.repair), lines: ["Earlier year"] },
        {
          value: f(h.latest.repair - h.earlier.repair),
          lines: ["Extra repair spend"],
        },
      ],
      unit: "Singapore dollars · two equal twelve-month periods",
    },
    "This is the difference between incurred repair charges for October 2025 to September 2026 and October 2024 to September 2025, for the same eight selected buses. It is not a forecast, a sustained trend, or a quantified saving. Distance, age, job mix and prices need separate analysis; do not extrapolate this increase to the whole fleet."
  ),
  "investment-options": impact(
    `Annual maintenance costs rose by S$${f(total(h.latest) - total(h.earlier))}.`,
    `This covers eight buses and includes the S$${f(h.latest.repair - h.earlier.repair)} repair increase. It is not a measure of possible savings.`,
    history,
    {
      kind: "calculation",
      operator: "−",
      terms: [
        { value: f(total(h.latest)), lines: ["Later year"] },
        { value: f(total(h.earlier)), lines: ["Earlier year"] },
        {
          value: f(total(h.latest) - total(h.earlier)),
          lines: ["Extra maintenance spend"],
        },
      ],
      unit: "Singapore dollars · servicing + extra checks + repairs",
    },
    `The totals are S$${f(total(h.latest))} and S$${f(total(h.earlier))}, giving a difference of S$${f(total(h.latest) - total(h.earlier))}. This includes the S$${f(h.latest.repair - h.earlier.repair)} repair increase rather than being additional to it. Repair-job charges overlap these totals too. The difference is recorded expenditure, not a sustained trend, price-adjusted comparison or guaranteed avoidable cost. Fuel, financing and unpriced replacement cover are outside these maintenance categories.`
  ),
}
