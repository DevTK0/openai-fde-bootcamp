import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Some passengers cannot board" }
export const notes = [
  "A bus can run and still leave people behind.\n\nA bus's capacity is the maximum number of people it can carry, including standing places. Stop-level queues reveal where demand and available places do not line up. A queue alone does not prove that a bus was full; the detailed boarding example below does.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Queues remained after about 9 in 100 stop visits.\n\nThe exact share is 8.8%. Each dot represents one percentage point of stop visits, not a person. One passenger might remain in a queue through several buses, so this is not a unique count of people denied boarding.\n\nInterpretation: Queue observations can count the same person repeatedly; a queue alone does not prove a full bus.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "The same morning bus left people waiting on eight days.\n\nEight departures were full and left queues, ranging from 24 to 39 people. The other two left no queue. This covers all ten supplied dates for this selected departure, not only the day that generated a complaint.\n\nInterpretation: One departure over ten weekdays does not establish the pattern across routes or seasons.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "One passenger waited for the next bus.\n\nThe account reports that the additional wait disrupted their morning. The matching origin record has 115 waiting, 85 boarding and 30 remaining. The passenger says they travelled later, so this case cannot be presented as a lost customer or lost fare.\n\nInterpretation: This passenger boarded later; the account does not demonstrate a lost sale.\n\nSource: Passenger account and origin boarding record · 6 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Two weeks do not show typical crowding.\n\nTwo weeks do not show typical crowding. Share earlier boarding records, including weekends, to check whether queues persist.\n\nQueue observations can count the same person repeatedly; a queue alone does not prove a full bus.\n\nThe supplied operating data already covers 6,900 trips across 24 routes, with detailed stop records for other and following departures. The one-departure comparison was an analytical selection, not missing data. Request earlier months and weekends of the same boarding and queue records to test whether the ten-weekday pattern persists. Do not request other trips already supplied, passenger identities or abandonment research. The current extract covers morning departures with downstream calls retained; additional history is a coverage request, not evidence of corrupt or erroneous records.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
]

const PageNumber = () => {
  const { current, total } = useSlidePageNumber()
  return (
    <>
      {current} / {total}
    </>
  )
}

const Page1: Page = () => (
  <section
    aria-label="Some passengers cannot board. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Some passengers cannot board"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A bus can run and still leave people behind."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Passengers need space when the bus reaches their stop."}
    </p>
    <figure
      aria-label="A bus can run and still leave people behind."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A bus can run and still leave people behind. Passengers need space when the bus reaches their stop."
        className="relative h-full w-full"
      >
        <div className="absolute top-[256.389px] left-[319.969px] h-[16px] w-[426.82px] text-muted-foreground">
          <svg
            viewBox="307.1327993148442 252.1327993148442 419.7344013703116 15.734401370311593"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M315 260 H719"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[244.186px] left-[726.721px] h-[40.406px] w-[36.338px] text-muted-foreground">
          <svg
            viewBox="707.1327993148442 240.1327993148442 35.734401370311595 39.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M715 248 L735 260 L715 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[256.389px] left-[980.941px] h-[16px] w-[426.82px] text-muted-foreground">
          <svg
            viewBox="957.1327993148442 252.1327993148442 419.7344013703116 15.734401370311593"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M965 260 H1369"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[244.186px] left-[1387.693px] h-[40.406px] w-[36.338px] text-muted-foreground">
          <svg
            viewBox="1357.1327993148443 240.1327993148442 35.734401370311595 39.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1365 248 L1385 260 L1365 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[199.189px] left-[139.473px] h-[130.398px] w-[143.11px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 1.7412478903750725 22.517504219249854 20.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M18 21a8 8 0 0 0-16 0"></path>
            <circle cx="10" cy="8" r="5"></circle>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
          </svg>
        </div>
        <p className="absolute top-[387.726px] left-[83.325px] m-0 h-[35.387px] w-[255.406px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Waiting passengers"}
        </p>
        <div className="absolute top-[199.189px] left-[800.445px] h-[130.398px] w-[143.11px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 1.7412478903750725 22.517504219249854 20.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <p className="absolute top-[387.726px] left-[777.547px] m-0 h-[35.387px] w-[188.906px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Limited places"}
        </p>
        <div className="absolute top-[192.834px] left-[1461.417px] h-[143.109px] w-[143.11px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 0.7412478903750725 22.517504219249854 22.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <p className="absolute top-[387.726px] left-[1419.863px] m-0 h-[35.387px] w-[226.219px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Some still waiting"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Journey and passenger queue records · 5 to 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Ten supplied weekdays · not a complete month"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page2: Page = () => (
  <section
    aria-label="Some passengers cannot board. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Some passengers cannot board"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Queues remained after about 9 in 100 stop visits."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"22,210 of 252,380 stop visits. The picture rounds this share."}
    </p>
    <figure
      aria-label="Queues remained after about 9 in 100 stop visits."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Queues remained after about 9 in 100 stop visits. 22,210 of 252,380 stop visits. The picture rounds this share."
        className="relative h-full w-full"
      >
        <div className="absolute top-[133.346px] left-[156.251px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="146.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="170"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[205.062px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="194.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="218"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[253.872px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="242.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="266"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[302.682px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="290.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="314"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[351.492px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="338.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="362"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[400.303px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="386.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="410"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[449.113px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="434.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="458"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[497.923px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="482.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="506"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[546.733px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="530.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="554"
              cy="155"
              r="16"
              fill="oklch(0.704 0.191 22.216)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-destructive"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[595.544px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="578.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="602"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[644.354px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="626.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="650"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[693.164px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="674.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="698"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[741.974px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="722.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="746"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[790.785px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="770.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="794"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[839.595px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="818.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="842"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[888.405px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="866.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="890"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[937.215px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="914.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="938"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[986.026px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="962.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="986"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[1034.836px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1010.1327993148442 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1034"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[133.346px] left-[1083.646px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1058.1327993148443 131.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1082"
              cy="155"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[156.251px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="146.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="170"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[205.062px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="194.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="218"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[253.872px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="242.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="266"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[302.682px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="290.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="314"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[351.492px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="338.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="362"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[400.303px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="386.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="410"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[449.113px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="434.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="458"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[497.923px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="482.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="506"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[546.733px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="530.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="554"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[595.544px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="578.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="602"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[644.354px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="626.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="650"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[693.164px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="674.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="698"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[741.974px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="722.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="746"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[790.785px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="770.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="794"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[839.595px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="818.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="842"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[888.405px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="866.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="890"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[937.215px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="914.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="938"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[986.026px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="962.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="986"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[1034.836px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="1010.1327993148442 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1034"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[192.326px] left-[1083.646px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="1058.1327993148443 189.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1082"
              cy="213"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[156.251px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="146.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="170"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[205.062px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="194.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="218"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[253.872px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="242.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="266"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[302.682px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="290.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="314"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[351.492px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="338.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="362"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[400.303px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="386.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="410"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[449.113px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="434.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="458"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[497.923px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="482.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="506"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[546.733px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="530.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="554"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[595.544px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="578.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="602"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[644.354px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="626.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="650"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[693.164px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="674.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="698"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[741.974px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="722.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="746"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[790.785px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="770.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="794"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[839.595px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="818.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="842"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[888.405px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="866.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="890"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[937.215px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="914.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="938"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[986.026px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="962.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="986"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[1034.836px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="1010.1327993148442 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1034"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[251.305px] left-[1083.646px] h-[48.539px] w-[48.54px] text-foreground">
          <svg
            viewBox="1058.1327993148443 247.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1082"
              cy="271"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[156.251px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="146.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="170"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[205.062px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="194.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="218"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[253.872px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="242.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="266"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[302.682px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="290.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="314"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[351.492px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="338.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="362"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[400.303px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="386.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="410"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[449.113px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="434.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="458"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[497.923px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="482.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="506"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[546.733px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="530.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="554"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[595.544px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="578.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="602"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[644.354px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="626.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="650"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[693.164px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="674.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="698"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[741.974px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="722.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="746"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[790.785px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="770.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="794"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[839.595px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="818.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="842"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[888.405px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="866.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="890"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[937.215px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="914.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="938"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[986.026px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="962.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="986"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[1034.836px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1010.1327993148442 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1034"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[310.283px] left-[1083.646px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1058.1327993148443 305.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1082"
              cy="329"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[156.251px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="146.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="170"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[205.062px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="194.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="218"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[253.872px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="242.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="266"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[302.682px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="290.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="314"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[351.492px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="338.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="362"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[400.303px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="386.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="410"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[449.113px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="434.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="458"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[497.923px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="482.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="506"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[546.733px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="530.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="554"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[595.544px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="578.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="602"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[644.354px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="626.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="650"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[693.164px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="674.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="698"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[741.974px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="722.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="746"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[790.785px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="770.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="794"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[839.595px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="818.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="842"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[888.405px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="866.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="890"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[937.215px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="914.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="938"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[986.026px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="962.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="986"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[1034.836px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1010.1327993148442 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1034"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <div className="absolute top-[369.262px] left-[1083.646px] h-[48.541px] w-[48.54px] text-foreground">
          <svg
            viewBox="1058.1327993148443 363.1327993148442 47.734401370311595 47.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle
              cx="1082"
              cy="387"
              r="16"
              fill="oklab(0.922 0 0 / 0.2)"
              stroke="none"
              strokeWidth="1px"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="fill-primary/20"
            ></circle>
          </svg>
        </div>
        <p className="absolute top-[494.5px] left-[430.524px] m-0 h-[35.387px] w-[415.188px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Each dot = 1% of recorded stops"}
        </p>
        <div className="absolute top-[128.008px] left-[1349.56px] h-[130.398px] w-[143.11px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 1.7412478903750725 22.517504219249854 20.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[307.232px] left-[1341.934px] h-[16px] w-[223.443px] text-muted-foreground">
          <svg
            viewBox="1312.1327993148443 302.1327993148442 219.7344013703116 15.734401370311593"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1320 310 H1524"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[295.031px] left-[1545.31px] h-[40.404px] w-[36.338px] text-muted-foreground">
          <svg
            viewBox="1512.1327993148443 290.1327993148442 35.734401370311595 39.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1520 298 L1540 310 L1520 322"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[318.672px] left-[1212.281px] h-[84.641px] w-[92.266px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.09792018270821234 0.9020798172917877 24.195840365416423 22.195840365416423"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M18 21a8 8 0 0 0-16 0"></path>
            <circle cx="10" cy="8" r="5"></circle>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
          </svg>
        </div>
        <p className="absolute top-[409.81px] left-[1310.521px] m-0 h-[58.572px] w-[221.188px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"About 9%"}
        </p>
        <p className="absolute top-[484.332px] left-[1331.396px] m-0 h-[35.387px] w-[179.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"leave a queue"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Journey and passenger queue records · 5 to 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Ten supplied weekdays · not a complete month"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page3: Page = () => (
  <section
    aria-label="Some passengers cannot board. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Some passengers cannot board"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The same morning bus left people waiting on eight days."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Queues after the 07:15 departure across ten weekdays."}
    </p>
    <figure
      aria-label="The same morning bus left people waiting on eight days."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The same morning bus left people waiting on eight days. Queues after the 07:15 departure across ten weekdays."
        className="relative h-full w-full"
      >
        <div className="absolute top-[380.223px] left-[228.725px] h-[16px] w-[1286.549px] text-foreground">
          <svg
            viewBox="120.93305463624223 430.9330546362422 1458.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="130"
              x2="1570"
              y1="440"
              y2="440"
              strokeWidth="3px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[371.694px] left-[195.844px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <div className="absolute top-[127.361px] left-[264.607px] h-[260.861px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[86.128px] left-[285.044px] m-0 h-[30.705px] w-[35.359px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"39"}
        </p>
        <p className="absolute top-[411.399px] left-[285.028px] m-0 h-[30.705px] w-[35.391px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"05"}
        </p>
        <div className="absolute top-[187.561px] left-[391.662px] h-[200.662px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[146.327px] left-[411.997px] m-0 h-[30.705px] w-[35.563px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"30"}
        </p>
        <p className="absolute top-[411.399px] left-[411.895px] m-0 h-[30.705px] w-[35.766px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"06"}
        </p>
        <div className="absolute top-[200.938px] left-[518.717px] h-[187.285px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[159.704px] left-[539.458px] m-0 h-[30.705px] w-[34.75px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"28"}
        </p>
        <p className="absolute top-[411.399px] left-[539.888px] m-0 h-[30.705px] w-[33.891px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"07"}
        </p>
        <div className="absolute top-[227.693px] left-[645.772px] h-[160.529px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[186.458px] left-[666.755px] m-0 h-[30.705px] w-[34.266px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"24"}
        </p>
        <p className="absolute top-[411.399px] left-[665.974px] m-0 h-[30.705px] w-[35.828px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"08"}
        </p>
        <div className="absolute top-[388.223px] left-[772.827px] h-[0px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[346.989px] left-[800.943px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"0"}
        </p>
        <p className="absolute top-[411.399px] left-[793.045px] m-0 h-[30.705px] w-[35.797px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"09"}
        </p>
        <div className="absolute top-[194.25px] left-[899.881px] h-[193.973px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[153.015px] left-[920.639px] m-0 h-[30.705px] w-[34.719px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"29"}
        </p>
        <p className="absolute top-[411.399px] left-[922.654px] m-0 h-[30.705px] w-[30.688px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"12"}
        </p>
        <div className="absolute top-[167.494px] left-[1026.936px] h-[220.729px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[126.261px] left-[1047.475px] m-0 h-[30.705px] w-[35.156px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"33"}
        </p>
        <p className="absolute top-[411.399px] left-[1049.381px] m-0 h-[30.705px] w-[31.344px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"13"}
        </p>
        <div className="absolute top-[180.871px] left-[1153.991px] h-[207.352px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[139.638px] left-[1176.436px] m-0 h-[30.705px] w-[31.344px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"31"}
        </p>
        <p className="absolute top-[411.399px] left-[1176.264px] m-0 h-[30.705px] w-[31.687px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"14"}
        </p>
        <div className="absolute top-[194.25px] left-[1281.046px] h-[193.973px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[153.015px] left-[1301.803px] m-0 h-[30.705px] w-[34.719px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"29"}
        </p>
        <p className="absolute top-[411.399px] left-[1303.569px] m-0 h-[30.705px] w-[31.188px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"15"}
        </p>
        <div className="absolute top-[388.223px] left-[1408.101px] h-[0px] w-[76.233px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[346.989px] left-[1436.218px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"0"}
        </p>
        <p className="absolute top-[411.399px] left-[1430.452px] m-0 h-[30.705px] w-[31.531px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"16"}
        </p>
        <p className="absolute top-[481.985px] left-[682.313px] m-0 h-[30.705px] w-[379.375px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"People still waiting after departure"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026"
        }
        <br />
        {
          "Fictional exercise data · Ten supplied weekdays · not a complete month"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page4: Page = () => (
  <section
    aria-label="Some passengers cannot board. Passenger evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Some passengers cannot board"}</span>
      <span>{"Passenger evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"One passenger waited for the next bus."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The 6 October account matches a departure that left 30 people waiting."}
    </p>
    <figure
      aria-label="One passenger waited for the next bus."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One passenger waited for the next bus. The 6 October account matches a departure that left 30 people waiting."
        className="relative h-full w-full"
      >
        <div className="absolute top-[161.691px] left-[262.346px] h-[134.213px] w-[121.078px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.7818527971371667 1.781852797137167 18.436294405725665 20.436294405725665"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
          </svg>
        </div>
        <div className="absolute top-[394.092px] left-[274.633px] h-[96.502px] w-[96.503px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.012496669013272399 0.012496669013272399 23.975006661973456 23.975006661973456"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6h4"></path>
          </svg>
        </div>
        <p className="absolute top-[161.885px] left-[605.611px] m-0 h-[75.656px] w-[330.563px] text-center text-[length:63.047px] leading-[1.2] font-[500] whitespace-pre text-foreground">
          {'"I got on the'}
        </p>
        <p className="absolute top-[258.488px] left-[605.611px] m-0 h-[75.656px] w-[642.547px] text-center text-[length:63.047px] leading-[1.2] font-[500] whitespace-pre text-foreground">
          {'next bus around 07:30"'}
        </p>
        <p className="absolute top-[428.402px] left-[844.547px] m-0 h-[35.387px] w-[522.672px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Passenger unable to board the 07:15 bus"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Passenger account and origin boarding record · 6 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Ten supplied weekdays · not a complete month"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page5: Page = () => (
  <section
    aria-label="Some passengers cannot board. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Some passengers cannot board"}
    </header>
    <div className="flex flex-1 items-center justify-between gap-24">
      <div className="max-w-[1200px]">
        <div className="mb-12 h-2 w-32 bg-destructive"></div>
        <h1 className="text-[120px] leading-[1.05] font-semibold tracking-[-0.035em]">
          {"Caveats"}
        </h1>
        <p className="mt-12 text-[36px] leading-snug text-muted-foreground">
          {"What the data does not tell us."}
        </p>
      </div>
      <div
        aria-label="Diagram"
        className="lucide lucide-search relative size-[260px] shrink-0 text-muted-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none h-full w-full"
        >
          <path d="m21 21-4.34-4.34"></path>
          <circle cx="11" cy="11" r="8"></circle>
        </svg>
      </div>
    </div>
    <footer className="flex justify-between border-t border-border pt-5 text-[23px] text-muted-foreground">
      <span>{"Stakeholder discussion"}</span>
      <span className="tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page6: Page = () => (
  <section
    aria-label="Some passengers cannot board. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Some passengers cannot board"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two weeks do not show typical crowding."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier boarding records, including weekends, to check whether queues persist."
      }
    </p>
    <figure
      aria-label="Two weeks do not show typical crowding."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two weeks do not show typical crowding. Share earlier boarding records, including weekends, to check whether queues persist."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.969px] left-[399.522px] m-0 h-[42.352px] w-[442.031px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier months and weekends"}
        </p>
        <p className="absolute top-[61.586px] left-[1172.167px] m-0 h-[38.116px] w-[211.406px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"5 to 16 Oct 2026"}
        </p>
        <div className="absolute top-[247.875px] left-[246.372px] h-[16px] w-[801.27px] text-muted-foreground">
          <svg
            viewBox="140.93305463624225 280.9330546362422 908.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M150 290H1040"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[186.111px] left-[1066.935px] h-[135.115px] w-[421.87px] text-foreground">
          <svg
            viewBox="1070.9330546362423 210.93305463624225 478.1338907275155 153.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1080 220V355 M1540 220V355"
              strokeWidth="5px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(0.922 0 0)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-primary"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[216.17px] left-[1074.935px] h-[79.41px] w-[405.87px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[227.698px] left-[1158.87px] m-0 h-[50.822px] w-[238px] text-center text-[length:42.352px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"10 weekdays"}
        </p>
        <p className="absolute top-[129.759px] left-[593.381px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[343.136px] left-[466.287px] m-0 h-[33.881px] w-[308.5px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"No earlier records"}
        </p>
        <p className="absolute top-[378.428px] left-[551.998px] m-0 h-[33.881px] w-[137.078px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"were provided."}
        </p>
        <p className="absolute top-[343.136px] left-[1172.815px] m-0 h-[33.881px] w-[210.109px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Dates provided"}
        </p>
        <p className="absolute top-[470.309px] left-[568.57px] m-0 h-[40.234px] w-[606.859px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Crowding on other dates is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026"
        }
        <br />
        {
          "Fictional exercise data · Ten supplied weekdays · not a complete month"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

export default [Page1, Page2, Page3, Page4, Page5, Page6] satisfies Page[]
