import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = {
  title: "Repair estimates do not confirm bus availability",
}
export const notes = [
  "A repaired bus still needs safety approval.\n\nThe expected finish is an estimate. A recorded release is a confirmed approval. Missing release records create uncertainty about usable resources; they do not prove a bus remained held for every day after its estimated completion.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "None of the eight buses has a recorded safety approval.\n\nEach symbol represents one workshop bus. These eight buses are separate from the 172 buses in the operating timetable. Their absence from the available pool is not evidence of an equivalent number of cancelled services or a company-wide availability percentage.\n\nInterpretation: Missing releases in this extract do not prove the buses stayed unavailable; records may exist elsewhere.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "The buses are at different repair stages.\n\nThree buses are in repair, three await parts and two await inspection. The status categories describe the supplied records. They do not measure how long each stage lasted or how much time is recoverable.\n\nInterpretation: A status snapshot does not measure time spent waiting for parts, repair or inspection.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "An estimated finish is not a confirmed release.\n\nThe estimated dates span 6 to 16 October. No later actual release is supplied, so elapsed calendar time cannot safely be converted into actual downtime. This is a visibility limitation in the supplied data, not proof that the business has no approval process elsewhere.\n\nInterpretation: Estimated dates cannot substitute for actual release times or establish overdue downtime.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Missing approval records do not prove buses are unavailable.\n\nMissing approval records do not prove buses are unavailable. Share signed release records and completed job sheets to confirm when buses could return to service.\n\nMissing releases in this extract do not prove the buses stayed unavailable; records may exist elsewhere.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Repair status does not show time spent waiting.\n\nRepair status does not show time spent waiting. Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts.\n\nA status snapshot does not measure time spent waiting for parts, repair or inspection.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Time in repair does not show replacement costs.\n\nTime in repair does not show replacement costs. Share dated bus hire invoices and credits to check the actual charges.\n\nEstimated dates cannot substitute for actual release times or establish overdue downtime.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
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
    aria-label="Repair estimates do not confirm bus availability. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A repaired bus still needs safety approval."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"It must pass the required checks before carrying passengers again."}
    </p>
    <figure
      aria-label="A repaired bus still needs safety approval."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A repaired bus still needs safety approval. It must pass the required checks before carrying passengers again."
        className="relative h-full w-full"
      >
        <div className="absolute top-[221.406px] left-[391.956px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="305.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
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
        <div className="absolute top-[210.816px] left-[744.886px] h-[37.176px] w-[33.647px] text-muted-foreground">
          <svg
            viewBox="705.9330546362422 238.93305463624225 38.133890727515535 42.133890727515535"
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
        <div className="absolute top-[221.406px] left-[965.468px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="955.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
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
        <div className="absolute top-[210.816px] left-[1318.398px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="1355.9330546362423 238.93305463624225 38.133890727515535 42.133890727515535"
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
        <div className="absolute top-[166.238px] left-[235.34px] h-[126.316px] w-[126.314px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5488217990115871 0.5455987374500026 22.905580536422015 22.90608026176381"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[231.043px] m-0 h-[30.705px] w-[134.891px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair work"}
        </p>
        <div className="absolute top-[166.258px] left-[808.855px] h-[126.293px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 0.5492887417987575 22.901422516402484 22.901422516402484"
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
        <p className="absolute top-[336.401px] left-[784.937px] m-0 h-[30.705px] w-[174.125px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Expected finish"}
        </p>
        <div className="absolute top-[166.258px] left-[1393.396px] h-[126.309px] w-[104.233px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 0.5488395611957302 18.901422516402484 22.904771820601702"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[1357.84px] m-0 h-[30.705px] w-[175.344px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Safety approval"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page2: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"None of the eight buses has a recorded safety approval."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The workshop extract has no confirmed release records."}
    </p>
    <figure
      aria-label="None of the eight buses has a recorded safety approval."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="None of the eight buses has a recorded safety approval. The workshop extract has no confirmed release records."
        className="relative h-full w-full"
      >
        <div className="absolute top-[118.281px] left-[253.357px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[191.258px] left-[339.751px] h-[49.824px] w-[49.822px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[118.281px] left-[460.704px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[191.258px] left-[547.098px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[118.281px] left-[668.05px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[191.258px] left-[754.445px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[118.281px] left-[875.397px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[191.258px] left-[961.791px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[312.395px] left-[253.357px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[385.371px] left-[339.751px] h-[49.82px] w-[49.822px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[312.395px] left-[460.704px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[385.371px] left-[547.098px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[312.395px] left-[668.05px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[385.371px] left-[754.445px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[312.395px] left-[875.397px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
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
        <div className="absolute top-[385.371px] left-[961.791px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
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
        <div className="absolute top-[80.234px] left-[1093.405px] h-[377.75px] w-[16px] text-foreground">
          <svg
            viewBox="1100.9330546362423 90.93305463624223 18.13389072751553 428.1338907275155"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="1110"
              x2="1110"
              y1="100"
              y2="510"
              strokeWidth="5px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(0.704 0.191 22.216)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-destructive"
            ></line>
          </svg>
        </div>
        <div className="absolute top-[130.965px] left-[1313.986px] h-[126.309px] w-[104.233px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 0.5488395611957302 18.901422516402484 22.904771820601702"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <p className="absolute top-[307.109px] left-[1256.79px] m-0 h-[50.822px] w-[218.625px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"No sign-off"}
        </p>
        <p className="absolute top-[376.105px] left-[1231.438px] m-0 h-[30.705px] w-[269.328px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Availability unconfirmed"}
        </p>
        <p className="absolute top-[486.398px] left-[427.641px] m-0 h-[30.705px] w-[376.969px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Each symbol is one workshop bus"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page3: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The buses are at different repair stages."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The records show repairs, waits for parts and pending inspections."}
    </p>
    <figure
      aria-label="The buses are at different repair stages."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The buses are at different repair stages. The records show repairs, waits for parts and pending inspections."
        className="relative h-full w-full"
      >
        <div className="absolute top-[63.18px] left-[508.092px] h-[443.09px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 62.132799314844206 15.734401370311593 435.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="70"
              y2="490"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[118.256px] left-[360.779px] m-0 h-[35.387px] w-[106.469px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"In repair"}
        </p>
        <div className="absolute top-[106.773px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.773px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[104.745px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"3"}
        </p>
        <p className="absolute top-[270.787px] left-[280.357px] m-0 h-[35.387px] w-[186.891px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Awaiting parts"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[257.276px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"3"}
        </p>
        <p className="absolute top-[423.318px] left-[218.826px] m-0 h-[35.387px] w-[248.422px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Inspection pending"}
        </p>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[583.011px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[409.812px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"2"}
        </p>
        <p className="absolute top-[504.67px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[776.413px] m-0 h-[35.387px] w-[455.563px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Workshop buses by supplied status"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page4: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Evidence gap"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Evidence gap"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"An estimated finish is not a confirmed release."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The eight estimates do not confirm that buses can return to service."}
    </p>
    <figure
      aria-label="An estimated finish is not a confirmed release."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="An estimated finish is not a confirmed release. The eight estimates do not confirm that buses can return to service."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.027px] left-[508.092px] h-[290.555px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 112.1327993148442 15.734401370311593 285.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="120"
              y2="390"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[169.099px] left-[151.482px] m-0 h-[35.387px] w-[315.766px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Expected finish supplied"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1682.87px] m-0 h-[58.572px] w-[35.141px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"8"}
        </p>
        <p className="absolute top-[321.631px] left-[113.779px] m-0 h-[35.387px] w-[353.469px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Confirmed release supplied"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[0px] bg-primary"></div>
        <p className="absolute top-[308.12px] left-[1682.526px] m-0 h-[58.572px] w-[35.484px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"0"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[797.687px] m-0 h-[35.387px] w-[413.016px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Records in the workshop extract"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page5: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Repair estimates do not confirm bus availability"}
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
    aria-label="Repair estimates do not confirm bus availability. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Missing approval records do not prove buses are unavailable."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share signed release records and completed job sheets to confirm when buses could return to service."
      }
    </p>
    <figure
      aria-label="Missing approval records do not prove buses are unavailable."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Missing approval records do not prove buses are unavailable. Share signed release records and completed job sheets to confirm when buses could return to service."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[287.725px] m-0 h-[38.116px] w-[409.75px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 release records are missing"}
        </p>
        <div className="absolute top-[177.289px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 200.93305463624225 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 210H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[135.79px] left-[363.561px] m-0 h-[33.881px] w-[258.078px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Expected completion"}
        </p>
        <div className="absolute top-[278.758px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 315.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 325H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[237.259px] left-[368.584px] m-0 h-[33.881px] w-[248.031px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual completion: ?"}
        </p>
        <div className="absolute top-[380.223px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 430.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 440H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[338.723px] left-[388.686px] m-0 h-[33.881px] w-[207.828px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Signed release: ?"}
        </p>
        <div className="absolute top-[243.461px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
          <svg
            viewBox="790.9330546362422 275.9330546362422 153.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M800 285H935"
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
        <div className="absolute top-[152.289px] left-[1166.932px] h-[163.055px] w-[133.644px] text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.911966556349068 0.9119634569075399 18.17607070199913 22.17607070199913"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[216.168px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1042.381px] m-0 h-[35.999px] w-[400.391px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Signed release dates and times"}
        </p>
        <p className="absolute top-[470.309px] left-[589.391px] m-0 h-[40.234px] w-[565.219px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Bus availability is unconfirmed."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page7: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair status does not show time spent waiting."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts."
      }
    </p>
    <figure
      aria-label="Repair status does not show time spent waiting."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair status does not show time spent waiting. Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[331.428px] m-0 h-[38.116px] w-[322.344px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Current status recorded"}
        </p>
        <div className="absolute top-[177.289px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 200.93305463624225 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 210H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[135.79px] left-[403.553px] m-0 h-[33.881px] w-[178.094px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Part ordered: ?"}
        </p>
        <div className="absolute top-[278.758px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 315.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 325H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[237.259px] left-[398.975px] m-0 h-[33.881px] w-[187.25px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Part received: ?"}
        </p>
        <div className="absolute top-[380.223px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 430.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 440H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[338.723px] left-[371.498px] m-0 h-[33.881px] w-[242.203px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Repair completed: ?"}
        </p>
        <div className="absolute top-[243.461px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
          <svg
            viewBox="790.9330546362422 275.9330546362422 153.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M800 285H935"
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
        <div className="absolute top-[152.289px] left-[1166.932px] h-[163.055px] w-[133.644px] text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.911966556349068 0.9119634569075399 18.17607070199913 22.17607070199913"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[216.168px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1080.007px] m-0 h-[35.999px] w-[325.141px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dates on jobs, orders and"}
        </p>
        <p className="absolute top-[405.047px] left-[1189.53px] m-0 h-[35.999px] w-[106.094px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"receipts"}
        </p>
        <p className="absolute top-[470.309px] left-[585.141px] m-0 h-[40.234px] w-[573.719px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Time waiting for parts is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page8: Page = () => (
  <section
    aria-label="Repair estimates do not confirm bus availability. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Repair estimates do not confirm bus availability"}
      </span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Time in repair does not show replacement costs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share dated bus hire invoices and credits to check the actual charges."}
    </p>
    <figure
      aria-label="Time in repair does not show replacement costs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Time in repair does not show replacement costs. Share dated bus hire invoices and credits to check the actual charges."
        className="relative h-full w-full"
      >
        <div className="absolute top-[136.848px] left-[271.371px] h-[140.996px] w-[115.997px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.7199606545283155 0.7199575550867872 18.560082505640636 22.560082505640636"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[203.758px] left-[489.012px] h-[16px] w-[210.112px] text-muted-foreground">
          <svg
            viewBox="415.9330546362422 230.93305463624225 238.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M425 240H645"
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
        <div className="absolute top-[110.289px] left-[735.24px] h-[194.113px] w-[229.405px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[151.817px] left-[822.786px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[203.758px] left-[1005.172px] h-[16px] w-[218.935px] text-muted-foreground">
          <svg
            viewBox="1000.9330546362422 230.93305463624225 248.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1010 240H1240"
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
        <div className="absolute top-[139.789px] left-[1273.546px] h-[64.527px] w-[96.88px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.021757375180123883 4.021757375180124 23.95648524963975 15.956485249639751"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[142.993px] left-[1427.179px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[329.903px] left-[186.32px] m-0 h-[33.881px] w-[294.922px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 workshop buses listed"}
        </p>
        <p className="absolute top-[329.903px] left-[705.301px] m-0 h-[33.881px] w-[289.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dated bus-hire invoices"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cost is unknown."}
        </p>
        <p className="absolute top-[470.309px] left-[628.188px] m-0 h-[40.234px] w-[487.625px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Replacement bus costs are unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

export default [
  Page1,
  Page2,
  Page3,
  Page4,
  Page5,
  Page6,
  Page7,
  Page8,
] satisfies Page[]
