import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Late buses disrupt journeys" }
export const notes = [
  "Passengers need buses to run on time.\n\nDeparture delay and arrival delay describe different parts of the experience. The operating data records both against the published timetable. Five minutes is an analytical threshold for these slides, not a supplied contractual service standard.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "More buses arrived late than left late.\n\nThe departure and arrival counts overlap and must not be added as unique disrupted journeys. A bus can leave near its scheduled time and encounter delay en route. These counts alone do not establish the cause, passenger count or revenue effect.\n\nInterpretation: Ten weekdays may be unusual; five minutes is an analytical threshold, not an agreed service standard.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Three routes had all the late departures.\n\nThe descriptive labels avoid internal route references. These are counts with the trip denominators displayed. The rates differ: 24 of 280, 17 of 280 and 7 of 220. All other supplied routes have no departures beyond the five-minute threshold in this extract.\n\nInterpretation: The route pattern is limited to this extract and does not establish the cause of delays.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "One passenger gave up waiting.\n\nThe passenger expected the 06:20 departure and reported giving up before the bus arrived. This is evidence of an abandoned intended journey. It does not show whether a fare was lost, whether the person was a new customer, or whether they stopped using the operator later.\n\nInterpretation: One abandoned journey does not establish a lost fare or a customer who never returned.\n\nSource: Passenger account · Toa Payoh morning departure · 7 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Ten weekdays do not show a yearly pattern.\n\nTen weekdays do not show a yearly pattern. Share more months of trip records, including weekends.\n\nTen weekdays may be unusual; five minutes is an analytical threshold, not an agreed service standard.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Older trips need matching timetables.\n\nOlder trips need matching timetables. Share the timetables used on those dates to measure how late each bus was.\n\nThe route pattern is limited to this extract and does not establish the cause of delays.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Late trips may not lead to penalties.\n\nLate trips may not lead to penalties. Share contracts and payment deductions to check whether delays reduced income.\n\nOne abandoned journey does not establish a lost fare or a customer who never returned.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
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
    aria-label="Late buses disrupt journeys. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Passengers need buses to run on time."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Late buses can mean missed work, appointments or connections."}
    </p>
    <figure
      aria-label="Passengers need buses to run on time."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Passengers need buses to run on time. Late buses can mean missed work, appointments or connections."
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
        <div className="absolute top-[192.834px] left-[139.473px] h-[143.109px] w-[143.11px] text-foreground">
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
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6h4"></path>
          </svg>
        </div>
        <p className="absolute top-[387.726px] left-[83.192px] m-0 h-[35.387px] w-[255.672px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Promised departure"}
        </p>
        <div className="absolute top-[192.834px] left-[800.445px] h-[143.109px] w-[143.11px] text-destructive">
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
        <p className="absolute top-[387.726px] left-[788.133px] m-0 h-[35.387px] w-[167.734px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Extra waiting"}
        </p>
        <div className="absolute top-[199.189px] left-[1461.417px] h-[130.398px] w-[143.11px] text-destructive">
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
        <p className="absolute top-[387.726px] left-[1415.363px] m-0 h-[35.387px] w-[235.219px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Journey disrupted"}
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
    aria-label="Late buses disrupt journeys. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"More buses arrived late than left late."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Trips more than five minutes late, out of 6,900 recorded trips."}
    </p>
    <figure
      aria-label="More buses arrived late than left late."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="More buses arrived late than left late. Trips more than five minutes late, out of 6,900 recorded trips."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.025px] left-[508.092px] h-[290.559px] w-[16px] text-foreground">
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
        <p className="absolute top-[169.097px] left-[275.982px] m-0 h-[35.387px] w-[191.266px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Late departure"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.146px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.146px] w-[419.768px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.591px] left-[1651.682px] m-0 h-[58.572px] w-[66.328px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"48"}
        </p>
        <p className="absolute top-[321.631px] left-[323.482px] m-0 h-[35.387px] w-[143.766px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Late arrival"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.122px] left-[1627.948px] m-0 h-[58.572px] w-[90.063px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"100"}
        </p>
        <p className="absolute top-[402.98px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.175px] left-[701.679px] m-0 h-[35.387px] w-[605.031px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"A trip can appear in both counts."}
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
    aria-label="Late buses disrupt journeys. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Three routes had all the late departures."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The worst affected route had 24 late departures out of 280."}
    </p>
    <figure
      aria-label="Three routes had all the late departures."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Three routes had all the late departures. The worst affected route had 24 late departures out of 280."
        className="relative h-full w-full"
      >
        <div className="absolute top-[63.182px] left-[508.092px] h-[443.09px] w-[16px] text-foreground">
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
        <p className="absolute top-[118.254px] left-[286.592px] m-0 h-[35.387px] w-[180.656px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Most affected"}
        </p>
        <div className="absolute top-[106.771px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.771px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[104.745px] left-[1528.073px] m-0 h-[58.572px] w-[189.938px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          <PageNumber />
        </p>
        <p className="absolute top-[270.787px] left-[220.732px] m-0 h-[35.387px] w-[246.516px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Next most affected"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[619.45px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1536.698px] m-0 h-[58.572px] w-[181.313px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          <PageNumber />
        </p>
        <p className="absolute top-[423.318px] left-[285.092px] m-0 h-[35.387px] w-[182.156px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Third affected"}
        </p>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[255.067px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1561.839px] m-0 h-[58.572px] w-[156.172px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          <PageNumber />
        </p>
        <p className="absolute top-[504.668px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.175px] left-[779.46px] m-0 h-[35.387px] w-[449.469px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Late starts · routes ranked by count"}
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

const Page4: Page = () => (
  <section
    aria-label="Late buses disrupt journeys. Passenger evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Passenger evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"One passenger gave up waiting."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"This is one account. It does not measure total customer losses."}
    </p>
    <figure
      aria-label="One passenger gave up waiting."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One passenger gave up waiting. This is one account. It does not measure total customer losses."
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
        <p className="absolute top-[161.885px] left-[605.611px] m-0 h-[75.656px] w-[387.766px] text-center text-[length:63.047px] leading-[1.2] font-[500] whitespace-pre text-foreground">
          {'"I gave up and'}
        </p>
        <p className="absolute top-[258.488px] left-[605.611px] m-0 h-[75.656px] w-[730.891px] text-center text-[length:63.047px] leading-[1.2] font-[500] whitespace-pre text-foreground">
          {'made other arrangements"'}
        </p>
        <p className="absolute top-[428.402px] left-[828.132px] m-0 h-[35.387px] w-[555.5px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Passenger reporting a delayed morning bus"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Passenger account · Toa Payoh morning departure · 7 Oct 2026"}
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
    aria-label="Late buses disrupt journeys. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Late buses disrupt journeys"}
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
    aria-label="Late buses disrupt journeys. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Ten weekdays do not show a yearly pattern."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share more months of trip records, including weekends."}
    </p>
    <figure
      aria-label="Ten weekdays do not show a yearly pattern."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Ten weekdays do not show a yearly pattern. Share more months of trip records, including weekends."
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
        <p className="absolute top-[470.309px] left-[581.898px] m-0 h-[40.234px] w-[580.203px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We do not know if delays persist."}
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

const Page7: Page = () => (
  <section
    aria-label="Late buses disrupt journeys. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Older trips need matching timetables."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share the timetables used on those dates to measure how late each bus was."
      }
    </p>
    <figure
      aria-label="Older trips need matching timetables."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Older trips need matching timetables. Share the timetables used on those dates to measure how late each bus was."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.705px] left-[311.522px] m-0 h-[38.116px] w-[362.156px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Current dates are matched"}
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
        <p className="absolute top-[135.79px] left-[364.006px] m-0 h-[33.881px] w-[257.187px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Scheduled departure"}
        </p>
        <div className="absolute top-[278.756px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
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
        <p className="absolute top-[237.257px] left-[390.342px] m-0 h-[33.881px] w-[204.516px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual departure"}
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
        <p className="absolute top-[338.725px] left-[363.631px] m-0 h-[33.881px] w-[257.938px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Difference = lateness"}
        </p>
        <div className="absolute top-[243.463px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
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
        <div className="absolute top-[216.17px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1071.467px] m-0 h-[35.999px] w-[342.219px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Older timetables and"}
        </p>
        <p className="absolute top-[405.045px] left-[1159.077px] m-0 h-[35.999px] w-[167px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"actual departure times"}
        </p>
        <p className="absolute top-[470.309px] left-[552.352px] m-0 h-[40.234px] w-[639.297px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We need planned and actual times."}
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

const Page8: Page = () => (
  <section
    aria-label="Late buses disrupt journeys. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Late buses disrupt journeys"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Late trips may not lead to penalties."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share contracts and payment deductions to check whether delays reduced income."
      }
    </p>
    <figure
      aria-label="Late trips may not lead to penalties."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Late trips may not lead to penalties. Share contracts and payment deductions to check whether delays reduced income."
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
        <div className="absolute top-[110.291px] left-[735.24px] h-[194.111px] w-[229.405px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
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
        <div className="absolute top-[139.789px] left-[1273.546px] h-[64.529px] w-[96.88px] text-foreground">
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
        <p className="absolute top-[142.995px] left-[1427.179px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[329.901px] left-[237.016px] m-0 h-[33.881px] w-[193.531px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"100 late arrivals"}
        </p>
        <p className="absolute top-[329.901px] left-[661.7px] m-0 h-[33.881px] w-[376.484px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Contract terms and deductions"}
        </p>
        <p className="absolute top-[329.901px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cost is unknown."}
        </p>
        <p className="absolute top-[470.309px] left-[605.75px] m-0 h-[40.234px] w-[532.5px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Penalty costs are not provided."}
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
