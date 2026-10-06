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
const history = "Monthly maintenance and mileage records · Oct 2024–Sep 2026"

// Only recorded dollar changes qualify here. No supplied comparison establishes
// a change in ridership or a financial consequence for the remaining nine decks.
export const impacts: Partial<Record<string, Slide>> = {
  "repair-spend": impact(
    `Annual repair spending was S$${f(h.latest.repair - h.earlier.repair)} higher.`,
    "Recorded difference for the same eight buses; this is an expense increase, not an avoidable saving.",
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
    "This is the difference between incurred repair charges for October 2025–September 2026 and October 2024–September 2025, for the same eight selected buses. It is not a forecast, a sustained trend, or a quantified saving. Distance, age, job mix and prices need separate analysis; do not extrapolate this increase to the whole fleet."
  ),
  "investment-options": impact(
    `Annual maintenance spending was S$${f(total(h.latest) - total(h.earlier))} higher.`,
    "All three maintenance categories for the same eight buses; this includes the repair increase shown in the repair deck.",
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
    "The totals are S$81,835 and S$65,045, giving a difference of S$16,790. This includes the S$11,255 repair increase rather than being additional to it. Repair-job charges overlap these totals too. The difference is recorded expenditure, not a sustained trend, price-adjusted comparison or guaranteed avoidable cost. Fuel, financing and unpriced replacement cover are outside these maintenance categories."
  ),
}
