import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Scheduling" }
export const notes = [
  "Passengers need buses to run on time.\n\nDeparture delay and arrival delay describe different parts of the experience. The operating data records both against the published timetable. Five minutes is an analytical threshold for these slides, not a supplied contractual service standard.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "More buses arrived late than left late.\n\nThe departure and arrival counts overlap and must not be added as unique disrupted journeys. A bus can leave near its scheduled time and encounter delay en route. These counts alone do not establish the cause, passenger count or revenue effect.\n\nInterpretation: Ten weekdays may be unusual; five minutes is an analytical threshold, not an agreed service standard.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Three routes had all the late departures.\n\nThe descriptive labels avoid internal route references. These are counts with the trip denominators displayed. The rates differ: 24 of 280, 17 of 280 and 7 of 220. All other supplied routes have no departures beyond the five-minute threshold in this extract.\n\nInterpretation: The route pattern is limited to this extract and does not establish the cause of delays.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "One passenger gave up waiting.\n\nThe passenger expected the 06:20 departure and reported giving up before the bus arrived. This is evidence of an abandoned intended journey. It does not show whether a fare was lost, whether the person was a new customer, or whether they stopped using the operator later.\n\nInterpretation: One abandoned journey does not establish a lost fare or a customer who never returned.\n\nSource: Passenger account · Toa Payoh morning departure · 7 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "A bus cannot carry passengers during maintenance.\n\nThe supplied plan describes a single workshop space and two mechanics. Two requested jobs require buses that also have scheduled passenger journeys. The evidence is a future planning conflict, not an observed service cancellation.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Two jobs need the same workshop space.\n\nOne requested job lasts 09:00 to 13:00 and the other 09:00 to 11:00. Both require one space. The workshop has one space continuously available 09:00 to 17:00. The diagram shows the requested bookings exactly; no alternative schedule is presented.\n\nInterpretation: One requested plan shows a conflict, not how often conflicts occur or whether this plan was carried out.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Three mechanics are needed. Only two are available.\n\nThe source lists two mechanics available, versus three required when both jobs run together. Counting total staffing hours would hide this simultaneous resource conflict. The record does not establish overtime costs or an approved staffing change.\n\nInterpretation: Staffing needs and availability are planning inputs; actual work and attendance may differ.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Eight passenger trips need these two buses.\n\nThere are 8 protected journeys across the two buses. The single replacement bus has specific morning and afternoon windows and uses the assigned duty drivers. Two windows are not two buses. No other bus is confirmed available in this bounded future roster.\n\nInterpretation: The supplied roster may omit other cover; eight scheduled trips are not eight cancellations.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Some festival passengers need two connecting buses.\n\nThe temporary shuttle links the fictional venue to a connecting service. Some people may ride both legs. Counts of boardings or available places on the two legs cannot simply be added as unique people served.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.",
  "Connecting buses have over twice the shuttle capacity.\n\nThe shuttle has three departures of 85 places: 255 total. The onward service has 340 regular places plus 256 provisional places: 596 total. This is an imbalance in the listed plan, not proof of unused seats or unmet demand. Actual attendance and precise passenger flows are absent.\n\nInterpretation: Capacity is not attendance; unequal totals do not prove empty seats or unmet demand.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.",
  "The final shuttle misses the last connecting bus.\n\nThe 35-minute ride is a supplied planning allowance, not a measured travel time. The final arrival is 20 minutes after the last listed onward departure, before even allowing transfer time. No passenger has yet been observed making or missing this future connection.\n\nInterpretation: This gap depends on listed departures and an assumed ride time; transfer time is additional.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.\n\nRelated evidence and caveats:\nThe missed connection affects 85 planned places.\n\nThe final 22:30 shuttle has a capacity of 85. This is capacity exposed to a missing onward connection, not 85 confirmed stranded passengers. Some riders may not need the connection, and the plan supplies no within-hour transfer-demand counts.\n\nInterpretation: Eighty-five places are exposed, not eighty-five confirmed stranded passengers.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.",
  "Queues grow while replacement buses are away.\n\nThe scenario assumes no confirmed train restoration through 19:00. The demand model begins with an existing queue and adds arrivals over four half-hour periods. These are supplied assumptions, not live observations or a forecast.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The plan has 170 places for 292 people.\n\nThe arithmetic is 112 initially waiting plus 180 subsequent arrivals, versus two departures with 85 places each. Both departures have enough waiting demand to fill. The result assumes no abandonment or route switching, and accessible boarding.\n\nInterpretation: Demand is assumed, not observed; restoration, alternative routes and people leaving would change it.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.\n\nRelated evidence and caveats:\nThe plan leaves 122 people waiting.\n\nThis is a scenario balance, not observed abandonment or lost customers. The remaining queue is 122 divided by 292, or 41.8% of the assumed demand. Waiting duration and the monetary consequences require additional calculation and commercial data.\n\nInterpretation: The 122-person queue is conditional arithmetic, not an observed outcome or a forecast.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The plan assumes new arrivals every half-hour.\n\nArrivals are assumed uniformly distributed within each supplied half-hour. This is why a comparison of one initial queue with one bus would understate the pressure. These assumptions are only for this bounded fictional incident.\n\nInterpretation: Arrival rates are scenario inputs and may vary widely between real incidents.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Ten weekdays do not show a yearly pattern.\n\nTen weekdays do not show a yearly pattern. Share more months of trip records, including weekends.\n\nTen weekdays may be unusual; five minutes is an analytical threshold, not an agreed service standard.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Older trips need matching timetables.\n\nOlder trips need matching timetables. Share the timetables used on those dates to measure how late each bus was.\n\nThe route pattern is limited to this extract and does not establish the cause of delays.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "Late trips may not lead to penalties.\n\nLate trips may not lead to penalties. Share contracts and payment deductions to check whether delays reduced income.\n\nOne abandoned journey does not establish a lost fare or a customer who never returned.\n\nRequest more months of the same scheduled and actual departure and arrival records, including weekends, plus timetable versions covering those dates. For financial consequences, request applicable service contracts and actual penalty deductions or invoices already held by finance. These records can show recurring performance and recorded penalties without requiring passenger-level journey matching or estimates of abandoned travel.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Journey and passenger queue records · 5 to 16 Oct 2026.\nScope: Ten supplied weekdays · not a complete month. All figures are fictional exercise data, not live business results.",
  "One plan does not show how often bookings clash.\n\nOne plan does not show how often bookings clash. Share earlier bookings and completed job sheets to check how often clashes occur.\n\nOne requested plan shows a conflict, not how often conflicts occur or whether this plan was carried out.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "A staffing gap does not prove overtime was worked.\n\nA staffing gap does not prove overtime was worked. Share mechanic rosters and timesheets to compare planned and paid hours.\n\nStaffing needs and availability are planning inputs; actual work and attendance may differ.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Some bus bookings are not confirmed.\n\nSome bus bookings are not confirmed. Share the latest timetable and confirmed bookings to check the available capacity.\n\nCapacity is not attendance; unequal totals do not prove empty seats or unmet demand.\n\nRequest the latest confirmed event schedules and bus bookings, previous comparable event operating reports if retained, and the event transport agreement or supplier quotes. These are planning and commercial documents, not a request to predict every passenger destination or transfer decision. Prior event counts provide context only; quotes and agreed fees are not incurred expenses. A future connection gap cannot be priced as an actual loss from the supplied plan.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.",
  "Planned places do not show passenger demand.\n\nPlanned places do not show passenger demand. Share passenger counts from similar events and any existing bookings.\n\nThis gap depends on listed departures and an assumed ride time; transfer time is additional.\n\nRequest the latest confirmed event schedules and bus bookings, previous comparable event operating reports if retained, and the event transport agreement or supplier quotes. These are planning and commercial documents, not a request to predict every passenger destination or transfer decision. Prior event counts provide context only; quotes and agreed fees are not incurred expenses. A future connection gap cannot be priced as an actual loss from the supplied plan.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Festival bus timetable and capacity plan · 9 Nov 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.",
  "The queue estimate depends on assumptions.\n\nThe queue estimate depends on assumptions. Share past incident reports with bus departure and train restart times to check those assumptions.\n\nDemand is assumed, not observed; restoration, alternative routes and people leaving would change it.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Buses and drivers may not stay available.\n\nBuses and drivers may not stay available. Share duty rosters and release records for the full disruption period.\n\nArrival rates are scenario inputs and may vary widely between real incidents.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Neither plan shows the financial effect.\n\nNeither plan shows the financial effect. Share event and replacement service contracts, hire quotes and invoices.\n\nEighty-five places are exposed, not eighty-five confirmed stranded passengers.\n\nRequest the latest confirmed event schedules and bus bookings, previous comparable event operating reports if retained, and the event transport agreement or supplier quotes. These are planning and commercial documents, not a request to predict every passenger destination or transfer decision. Prior event counts provide context only; quotes and agreed fees are not incurred expenses. A future connection gap cannot be priced as an actual loss from the supplied plan.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Festival and disruption plans · October and November 2026.\nScope: Future timetable · not observed attendance. All figures are fictional exercise data, not live business results.\n\nRelated evidence and caveats:\nQueue length does not show replacement service costs.\n\nQueue length does not show replacement service costs. Share replacement service contracts and invoices to compare agreed rates with actual payments.\n\nThe 122-person queue is conditional arithmetic, not an observed outcome or a forecast.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
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
    aria-label="Scheduling. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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
    aria-label="Scheduling. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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
    aria-label="Scheduling. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Three routes had all the late departures."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Departures over five minutes late, out of all departures on each route."
      }
    </p>
    <figure
      aria-label="Three routes had all the late departures."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Three routes had all the late departures. Departures over five minutes late, out of all departures on each route."
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
        <p className="absolute top-[104.745px] left-[1418px] m-0 h-[58.572px] w-[300px] text-center text-[length:42px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"24 of 280"}
        </p>
        <p className="absolute top-[270.787px] left-[220.732px] m-0 h-[35.387px] w-[246.516px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Next most affected"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[619.45px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1418px] m-0 h-[58.572px] w-[300px] text-center text-[length:42px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"17 of 280"}
        </p>
        <p className="absolute top-[423.318px] left-[285.092px] m-0 h-[35.387px] w-[182.156px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Third affected"}
        </p>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[255.067px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1418px] m-0 h-[58.572px] w-[300px] text-center text-[length:42px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"7 of 220"}
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
    aria-label="Scheduling. Passenger evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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
    aria-label="Scheduling. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A bus cannot carry passengers during maintenance."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Repairs need workshop space, mechanics and buses to cover the service."}
    </p>
    <figure
      aria-label="A bus cannot carry passengers during maintenance."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A bus cannot carry passengers during maintenance. Repairs need workshop space, mechanics and buses to cover the service."
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
        <p className="absolute top-[336.401px] left-[213.105px] m-0 h-[30.705px] w-[170.766px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Workshop time"}
        </p>
        <div className="absolute top-[171.773px] left-[819.884px] h-[115.262px] w-[104.233px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 1.5492887417987575 18.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.401px] left-[788.5px] m-0 h-[30.705px] w-[167px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Mechanic time"}
        </p>
        <div className="absolute top-[171.773px] left-[1382.366px] h-[115.262px] w-[126.291px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.401px] left-[1355.996px] m-0 h-[30.705px] w-[179.031px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Bus off the road"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page6: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two jobs need the same workshop space."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Both bookings start at 09:00 and overlap for two hours."}
    </p>
    <figure
      aria-label="Two jobs need the same workshop space."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two jobs need the same workshop space. Both bookings start at 09:00 and overlap for two hours."
        className="relative h-full w-full"
      >
        <p className="absolute top-[11.194px] left-[503.195px] m-0 h-[58.572px] w-[737.609px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"One space · overlapping bookings"}
        </p>
        <div className="absolute top-[149.617px] left-[477.586px] h-[285.473px] w-[16px] text-foreground">
          <svg
            viewBox="462.1327993148442 147.1327993148442 15.734401370311593 280.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="470"
              x2="470"
              y1="155"
              y2="420"
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
        <p className="absolute top-[103.002px] left-[443.632px] m-0 h-[35.387px] w-[83.906px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"09:00"}
        </p>
        <div className="absolute top-[149.617px] left-[772.481px] h-[285.473px] w-[16px] text-foreground">
          <svg
            viewBox="752.1327993148442 147.1327993148442 15.734401370311593 280.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="760"
              x2="760"
              y1="155"
              y2="420"
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
        <p className="absolute top-[103.002px] left-[743.09px] m-0 h-[35.387px] w-[74.781px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"11:00"}
        </p>
        <div className="absolute top-[149.617px] left-[1067.376px] h-[285.473px] w-[16px] text-foreground">
          <svg
            viewBox="1042.1327993148443 147.1327993148442 15.734401370311593 280.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="1050"
              x2="1050"
              y1="155"
              y2="420"
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
        <p className="absolute top-[103.002px] left-[1035.79px] m-0 h-[35.387px] w-[79.172px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"13:00"}
        </p>
        <div className="absolute top-[149.617px] left-[1362.271px] h-[285.473px] w-[16px] text-foreground">
          <svg
            viewBox="1332.1327993148443 147.1327993148442 15.734401370311593 280.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="1340"
              x2="1340"
              y1="155"
              y2="420"
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
        <p className="absolute top-[103.002px] left-[1330.779px] m-0 h-[35.387px] w-[78.984px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"15:00"}
        </p>
        <div className="absolute top-[149.617px] left-[1657.167px] h-[285.473px] w-[16px] text-foreground">
          <svg
            viewBox="1622.1327993148443 147.1327993148442 15.734401370311593 280.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="1630"
              x2="1630"
              y1="155"
              y2="420"
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
        <p className="absolute top-[103.002px] left-[1626.479px] m-0 h-[35.387px] w-[77.375px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"17:00"}
        </p>
        <div className="absolute top-[157.617px] left-[485.586px] h-[269.473px] w-[294.895px] [background-color:oklab(0.704_0.176821_0.072217_/_0.1)]"></div>
        <p className="absolute top-[211.806px] left-[174.22px] m-0 h-[35.387px] w-[232.016px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Cooling diagnosis"}
        </p>
        <p className="absolute top-[338.916px] left-[220.22px] m-0 h-[35.387px] w-[186.016px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Routine check"}
        </p>
        <div className="absolute top-[193.207px] left-[485.586px] h-[71.184px] w-[589.79px] [border-radius:5.084px] bg-destructive"></div>
        <div className="absolute top-[320.316px] left-[485.586px] h-[71.184px] w-[294.895px] [border-radius:5.084px] bg-destructive"></div>
        <div className="absolute top-[459.766px] left-[599.611px] h-[66.844px] w-[66.844px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.1468802740623185 -1.1468802740623185 26.293760548124638 26.293760548124638"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <p className="absolute top-[477.213px] left-[749.972px] m-0 h-[35.387px] w-[427.094px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Both jobs need the space at once"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page7: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Three mechanics are needed. Only two are available."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"At 09:00, one job needs two mechanics and the other needs one."}
    </p>
    <figure
      aria-label="Three mechanics are needed. Only two are available."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Three mechanics are needed. Only two are available. At 09:00, one job needs two mechanics and the other needs one."
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
        <p className="absolute top-[169.099px] left-[347.904px] m-0 h-[35.387px] w-[119.344px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Available"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[583.011px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"2"}
        </p>
        <p className="absolute top-[321.631px] left-[348.639px] m-0 h-[35.387px] w-[118.609px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Required"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[814.194px] m-0 h-[35.387px] w-[380px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Mechanics during the overlap"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page8: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Eight passenger trips need these two buses."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The plan names only one replacement bus."}
    </p>
    <figure
      aria-label="Eight passenger trips need these two buses."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Eight passenger trips need these two buses. The plan names only one replacement bus."
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
        <p className="absolute top-[169.099px] left-[173.404px] m-0 h-[35.387px] w-[293.844px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Buses requesting work"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[155.589px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"2"}
        </p>
        <p className="absolute top-[321.631px] left-[121.201px] m-0 h-[35.387px] w-[346.047px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Named replacement buses"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[437.258px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[308.12px] left-[1690.901px] m-0 h-[58.572px] w-[27.109px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"1"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[782.366px] m-0 h-[35.387px] w-[443.656px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Buses · not the number of journeys"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page9: Page = () => (
  <section
    aria-label="Scheduling. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Some festival passengers need two connecting buses."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"They need space on both the shuttle and the connecting bus."}
    </p>
    <figure
      aria-label="Some festival passengers need two connecting buses."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Some festival passengers need two connecting buses. They need space on both the shuttle and the connecting bus."
        className="relative h-full w-full"
      >
        <div className="absolute top-[221.406px] left-[391.956px] h-[16px] w-[181.289px] text-muted-foreground">
          <svg
            viewBox="305.9330546362422 250.93305463624225 205.4672342333749 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M315 260 H502.33333333333326"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[553.715px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="489.2663981421016 238.93305463624225 38.13386020993741 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M498.33333333333326 248 L518.3333333333333 260 L498.33333333333326 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[221.406px] left-[774.297px] h-[16px] w-[181.289px] text-muted-foreground">
          <svg
            viewBox="739.2663676245235 250.93305463624225 205.46726475095303 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M748.3333333333333 260 H935.6666666666665"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[936.057px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="922.599741647961 238.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M931.6666666666665 248 L951.6666666666665 260 L931.6666666666665 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[221.406px] left-[1156.638px] h-[16px] w-[181.289px] text-muted-foreground">
          <svg
            viewBox="1172.5996806128048 250.93305463624225 205.46726475095303 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1181.6666666666665 260 H1369"
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
        <div className="absolute top-[171.781px] left-[235.343px] h-[115.254px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5505046765521755 22.901422516402484 20.90020562797475"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8"></path>
            <path d="M6 10V8"></path>
            <path d="M6 14v1"></path>
            <path d="M6 19v2"></path>
            <rect x="2" y="8" width="20" height="13" rx="2"></rect>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[254.113px] m-0 h-[30.705px] w-[88.75px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Festival"}
        </p>
        <div className="absolute top-[171.773px] left-[617.684px] h-[115.262px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.401px] left-[639.103px] m-0 h-[30.705px] w-[83.453px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Shuttle"}
        </p>
        <div className="absolute top-[171.773px] left-[1000.025px] h-[115.262px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.401px] left-[994.264px] m-0 h-[30.705px] w-[137.813px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Onward bus"}
        </p>
        <div className="absolute top-[166.258px] left-[1387.881px] h-[120.777px] w-[115.262px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.5492885033801784 0.5488094012454738 20.901422516402484 21.90190126090932"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[1380.152px] m-0 h-[30.705px] w-[130.719px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Destination"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Festival bus timetable and capacity plan · 9 Nov 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page10: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Connecting buses have over twice the shuttle capacity."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Total planned places, including the unconfirmed connecting bus allocation."
      }
    </p>
    <figure
      aria-label="Connecting buses have over twice the shuttle capacity."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Connecting buses have over twice the shuttle capacity. Total planned places, including the unconfirmed connecting bus allocation."
        className="relative h-full w-full"
      >
        <div className="absolute top-[97.879px] left-[555.186px] h-[254.227px] w-[16px] text-foreground">
          <svg
            viewBox="490.9330546362422 110.93305463624223 18.13389072751553 288.1338907275155"
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
        <p className="absolute top-[146.702px] left-[365.429px] m-0 h-[30.705px] w-[155.641px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Venue shuttle"}
        </p>
        <div className="absolute top-[136.762px] left-[563.186px] h-[59.996px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.762px] left-[563.186px] h-[59.996px] w-[324.654px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1524.768px] m-0 h-[50.822px] w-[81.563px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"255"}
        </p>
        <p className="absolute top-[279.05px] left-[300.288px] m-0 h-[30.705px] w-[220.781px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Onward connection"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.402px] left-[1523.58px] m-0 h-[50.822px] w-[82.75px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"596"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.339px] left-[804.96px] m-0 h-[30.705px] w-[363.484px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Passenger places · separate legs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Festival bus timetable and capacity plan · 9 Nov 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page11: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The final shuttle misses the last connecting bus."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "The 85-place shuttle arrives at 23:05. The last connecting bus leaves at 22:45."
      }
    </p>
    <figure
      aria-label="The final shuttle misses the last connecting bus."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The final shuttle misses the last connecting bus. The 85-place shuttle arrives at 23:05. The last connecting bus leaves at 22:45."
        className="relative h-full w-full"
      >
        <p className="absolute top-[111.409px] left-[217.079px] m-0 h-[30.705px] w-[83.453px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Shuttle"}
        </p>
        <p className="absolute top-[318.753px] left-[217.079px] m-0 h-[30.705px] w-[179.563px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Connecting bus"}
        </p>
        <div className="absolute top-[150.82px] left-[466.953px] h-[16px] w-[1016.557px] text-muted-foreground">
          <svg
            viewBox="390.9330546362422 170.93305463624225 1152.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M400 180 H1534"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[140.23px] left-[1463.982px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="1520.9330546362423 158.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1530 168 L1550 180 L1530 192"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[353.754px] left-[466.953px] h-[16px] w-[1016.557px] text-muted-foreground">
          <svg
            viewBox="390.9330546362422 400.9330546362422 1152.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M400 410 H1534"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[343.164px] left-[1463.982px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="1520.9330546362423 388.9330546362422 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1530 398 L1550 410 L1530 422"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[79.133px] left-[494.158px] h-[62.32px] w-[67.469px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.108666981859805 -0.10745104710638698 26.21733396371961 24.216117075291876"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8"></path>
            <path d="M6 10V8"></path>
            <path d="M6 14v1"></path>
            <path d="M6 19v2"></path>
            <rect x="2" y="8" width="20" height="13" rx="2"></rect>
          </svg>
        </div>
        <div className="absolute top-[64.793px] left-[1065.464px] h-[82.172px] w-[89.527px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.1760668873018636 0.8239331126981364 24.35213377460373 22.35213377460373"
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
        <p className="absolute top-[31.999px] left-[1032.845px] m-0 h-[30.705px] w-[154.766px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Arrives 23:05"}
        </p>
        <div className="absolute top-[267.727px] left-[853.706px] h-[82.176px] w-[89.527px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.1760668873018636 0.8239331126981364 24.35213377460373 22.35213377460373"
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
        <p className="absolute top-[398.163px] left-[820.931px] m-0 h-[30.705px] w-[155.078px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Leaves 22:45"}
        </p>
        <div className="absolute top-[172.875px] left-[890.47px] h-[99.824px] w-[227.758px] text-foreground">
          <svg
            viewBox="870.9330546362422 195.93305463624225 258.1338907275155 113.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1120 205 Q1120 285 880 300"
              strokeWidth="5px"
              strokeDasharray="10px, 10px"
              fill="none"
              stroke="oklch(0.704 0.191 22.216)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-destructive"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[219.492px] left-[978.555px] h-[58.648px] w-[58.646px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.7518394608652827 -1.7518394608652827 27.503678921730565 27.503678921730565"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <p className="absolute top-[457.105px] left-[633.531px] m-0 h-[50.822px] w-[476.938px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"Connection already gone"}
        </p>
        <p className="absolute top-[371.694px] left-[1485.653px] m-0 h-[30.705px] w-[60.891px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Later"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Festival bus timetable and capacity plan · 9 Nov 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page12: Page = () => (
  <section
    aria-label="Scheduling. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Queues grow while replacement buses are away."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"When trains stop, people keep arriving while buses make their trips."}
    </p>
    <figure
      aria-label="Queues grow while replacement buses are away."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Queues grow while replacement buses are away. When trains stop, people keep arriving while buses make their trips."
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
        <div className="absolute top-[210.82px] left-[744.886px] h-[37.172px] w-[33.647px] text-muted-foreground">
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
        <div className="absolute top-[210.82px] left-[1318.398px] h-[37.172px] w-[33.646px] text-muted-foreground">
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
        <div className="absolute top-[171.773px] left-[246.372px] h-[120.773px] w-[104.233px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 1.5492887417987575 18.901422516402484 21.901422516402484"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M12 3v8"></path>
            <path d="m8 19-2 3"></path>
            <path d="m18 22-2-3"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[336.398px] left-[211.199px] m-0 h-[30.705px] w-[174.578px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Train disruption"}
        </p>
        <div className="absolute top-[171.773px] left-[808.855px] h-[115.266px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.398px] left-[796.406px] m-0 h-[30.705px] w-[151.188px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Queue grows"}
        </p>
        <div className="absolute top-[171.773px] left-[1382.366px] h-[115.266px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
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
        <p className="absolute top-[336.398px] left-[1339.184px] m-0 h-[30.705px] w-[212.656px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Limited departures"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Disruption plan and assumed passenger arrivals · 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Bounded planning scenario · 16 October 2026"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page13: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The plan has 170 places for 292 people."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The two planned departures leave 122 people waiting at 19:00."}
    </p>
    <figure
      aria-label="The plan has 170 places for 292 people."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The plan has 170 places for 292 people. The two planned departures leave 122 people waiting at 19:00."
        className="relative h-full w-full"
      >
        <div className="absolute top-[124.195px] left-[192.859px] h-[107.516px] w-[117.688px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.42655986296884074 1.4265598629688407 23.14688027406232 21.14688027406232"
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
        <p className="absolute top-[265.705px] left-[176.805px] m-0 h-[35.387px] w-[149.797px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Need a ride"}
        </p>
        <div className="absolute top-[337.742px] left-[192.859px] h-[107.516px] w-[117.688px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.42655986296884074 1.4265598629688407 23.14688027406232 21.14688027406232"
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
        <p className="absolute top-[479.244px] left-[180.305px] m-0 h-[35.387px] w-[142.797px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Bus places"}
        </p>
        <div className="absolute top-[137.281px] left-[475.417px] h-[96.602px] w-[1098.637px] [border-radius:4.068px] bg-primary"></div>
        <div className="absolute top-[355.906px] left-[475.417px] h-[96.602px] w-[639.618px] [border-radius:4.068px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <div className="absolute top-[355.906px] left-[1115.034px] h-[96.602px] w-[459.02px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[64.073px] left-[898.4px] m-0 h-[58.572px] w-[252.672px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"292 people"}
        </p>
        <p className="absolute top-[484.33px] left-[724.022px] m-0 h-[35.387px] w-[142.406px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"170 places"}
        </p>
        <p className="absolute top-[465.737px] left-[1217.396px] m-0 h-[58.572px] w-[254.297px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"122 waiting"}
        </p>
        <div className="absolute top-[241.133px] left-[1107.034px] h-[102.438px] w-[16px] text-foreground">
          <svg
            viewBox="1081.1327993148443 237.1327993148442 15.734401370311593 100.73440137031159"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1089 245 V330"
              strokeWidth="3px"
              strokeDasharray="8px, 8px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Disruption plan and assumed passenger arrivals · 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Bounded planning scenario · 16 October 2026"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page14: Page = () => (
  <section
    aria-label="Scheduling. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The plan assumes new arrivals every half-hour."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "These are arrivals between 17:00 and 19:00, on top of the initial queue."
      }
    </p>
    <figure
      aria-label="The plan assumes new arrivals every half-hour."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The plan assumes new arrivals every half-hour. These are arrivals between 17:00 and 19:00, on top of the initial queue."
        className="relative h-full w-full"
      >
        <div className="absolute top-[439.43px] left-[131.846px] h-[16px] w-[1480.307px] text-foreground">
          <svg
            viewBox="122.1327993148442 432.1327993148442 1455.7344013703116 15.734401370311593"
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
        <p className="absolute top-[428.4px] left-[93.037px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <div className="absolute top-[146.781px] left-[204.927px] h-[300.648px] w-[219.646px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[99.291px] left-[294.422px] m-0 h-[35.387px] w-[40.656px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"60"}
        </p>
        <p className="absolute top-[474.166px] left-[276.062px] m-0 h-[35.387px] w-[77.375px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"17:00"}
        </p>
        <div className="absolute top-[196.891px] left-[571.003px] h-[250.539px] w-[219.646px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[149.392px] left-[660.725px] m-0 h-[35.387px] w-[40.203px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"50"}
        </p>
        <p className="absolute top-[474.166px] left-[642.397px] m-0 h-[35.387px] w-[76.859px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"17:30"}
        </p>
        <div className="absolute top-[247px] left-[937.08px] h-[200.43px] w-[219.646px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[199.502px] left-[1026.513px] m-0 h-[35.387px] w-[40.781px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"40"}
        </p>
        <p className="absolute top-[474.166px] left-[1007.177px] m-0 h-[35.387px] w-[79.453px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"18:00"}
        </p>
        <div className="absolute top-[297.109px] left-[1303.157px] h-[150.32px] w-[219.646px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[249.611px] left-[1392.793px] m-0 h-[35.387px] w-[40.375px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"30"}
        </p>
        <p className="absolute top-[474.166px] left-[1373.511px] m-0 h-[35.387px] w-[78.937px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"18:30"}
        </p>
        <p className="absolute top-[555.509px] left-[619.195px] m-0 h-[35.387px] w-[505.609px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Assumed new arrivals in each half-hour"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Disruption plan and assumed passenger arrivals · 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Bounded planning scenario · 16 October 2026"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page15: Page = () => (
  <section
    aria-label="Scheduling. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Scheduling"}
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

const Page16: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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

const Page17: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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

const Page18: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
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

const Page19: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"One plan does not show how often bookings clash."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier bookings and completed job sheets to check how often clashes occur."
      }
    </p>
    <figure
      aria-label="One plan does not show how often bookings clash."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One plan does not show how often bookings clash. Share earlier bookings and completed job sheets to check how often clashes occur."
        className="relative h-full w-full"
      >
        <p className="absolute top-[26.293px] left-[309.092px] m-0 h-[38.116px] w-[367.016px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"19 Oct: proposed bookings"}
        </p>
        <p className="absolute top-[26.293px] left-[1075.403px] m-0 h-[38.116px] w-[369.641px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier completed bookings"}
        </p>
        <p className="absolute top-[109.321px] left-[241.154px] m-0 h-[33.881px] w-[79.375px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"09:00"}
        </p>
        <p className="absolute top-[109.321px] left-[457.209px] m-0 h-[33.881px] w-[70.781px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"11:00"}
        </p>
        <p className="absolute top-[109.321px] left-[666.874px] m-0 h-[33.881px] w-[74.969px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"13:00"}
        </p>
        <div className="absolute top-[167.641px] left-[280.842px] h-[211.758px] w-[211.758px] [background-color:oklab(0.704_0.176821_0.072217_/_0.1)]"></div>
        <div className="absolute top-[185.289px] left-[280.842px] h-[52.938px] w-[423.516px] bg-destructive"></div>
        <div className="absolute top-[295.578px] left-[280.842px] h-[52.941px] w-[211.758px] bg-destructive"></div>
        <p className="absolute top-[400.489px] left-[322.873px] m-0 h-[33.881px] w-[339.453px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Two jobs overlap in this plan"}
        </p>
        <div className="absolute top-[146.406px] left-[1031.642px] h-[218.938px] w-[474.809px] text-foreground">
          <svg
            viewBox="1030.9330546362423 165.93305463624225 538.1338907275156 248.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1040 175V405H1560"
              fill="none"
              strokeWidth="4px"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[182.7px] left-[1241.89px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[382.841px] left-[1114.797px] m-0 h-[33.881px] w-[308.5px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"How often did actual jobs"}
        </p>
        <p className="absolute top-[418.134px] left-[1228.062px] m-0 h-[33.881px] w-[81.969px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"clash?"}
        </p>
        <p className="absolute top-[470.309px] left-[535.633px] m-0 h-[40.234px] w-[672.734px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We do not know how often jobs clash."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page20: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A staffing gap does not prove overtime was worked."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share mechanic rosters and timesheets to compare planned and paid hours."
      }
    </p>
    <figure
      aria-label="A staffing gap does not prove overtime was worked."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A staffing gap does not prove overtime was worked. Share mechanic rosters and timesheets to compare planned and paid hours."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[300.412px] m-0 h-[38.116px] w-[384.375px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"3 needed; 2 available in plan"}
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
        <p className="absolute top-[135.79px] left-[399.389px] m-0 h-[33.881px] w-[186.422px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Rostered hours"}
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
        <p className="absolute top-[237.259px] left-[367.576px] m-0 h-[33.881px] w-[250.047px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual hours worked"}
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
        <p className="absolute top-[338.723px] left-[397.717px] m-0 h-[33.881px] w-[189.766px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Overtime hours"}
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
        <p className="absolute top-[367.547px] left-[1054.022px] m-0 h-[35.999px] w-[377.109px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual hours from timesheets"}
        </p>
        <p className="absolute top-[470.309px] left-[571.703px] m-0 h-[40.234px] w-[600.594px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The plan does not record overtime."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Requested workshop bookings and service schedule · 19 Oct 2026"
        }
        <br />
        {"Fictional exercise data · Future planning records · 19 October 2026"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page21: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Some bus bookings are not confirmed."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share the latest timetable and confirmed bookings to check the available capacity."
      }
    </p>
    <figure
      aria-label="Some bus bookings are not confirmed."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Some bus bookings are not confirmed. Share the latest timetable and confirmed bookings to check the available capacity."
        className="relative h-full w-full"
      >
        <p className="absolute top-[43.176px] left-[660.727px] m-0 h-[44.469px] w-[422.547px] text-center text-[length:37.058px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"596 connecting bus"}
        </p>
        <p className="absolute top-[89.496px] left-[818.586px] m-0 h-[44.469px] w-[106.828px] text-center text-[length:37.058px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"places"}
        </p>
        <div className="absolute top-[176.465px] left-[280.842px] h-[132.348px] w-[674.476px] bg-primary"></div>
        <div className="absolute top-[176.465px] left-[955.318px] h-[132.348px] w-[507.841px] [border-width:4.412px] [border-style:solid] border-destructive"></div>
        <p className="absolute top-[204.904px] left-[554.224px] m-0 h-[67.763px] w-[106.156px] text-center text-[length:56.469px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"340"}
        </p>
        <p className="absolute top-[204.904px] left-[1144.795px] m-0 h-[67.763px] w-[142.625px] text-center text-[length:56.469px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"256 ?"}
        </p>
        <p className="absolute top-[337.961px] left-[500.591px] m-0 h-[40.234px] w-[213.422px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Regular places"}
        </p>
        <p className="absolute top-[337.961px] left-[1087.17px] m-0 h-[40.234px] w-[257.875px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Unconfirmed places"}
        </p>
        <p className="absolute top-[470.309px] left-[613.016px] m-0 h-[40.234px] w-[517.969px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"256 places are not confirmed."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Festival bus timetable and capacity plan · 9 Nov 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page22: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Planned places do not show passenger demand."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share passenger counts from similar events and any existing bookings."}
    </p>
    <figure
      aria-label="Planned places do not show passenger demand."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Planned places do not show passenger demand. Share passenger counts from similar events and any existing bookings."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[313.85px] m-0 h-[38.116px] w-[357.5px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Future event capacity plan"}
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
        <p className="absolute top-[135.79px] left-[404.686px] m-0 h-[33.881px] w-[175.828px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Seats planned"}
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
        <p className="absolute top-[237.259px] left-[378.998px] m-0 h-[33.881px] w-[227.203px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Bookings, if held: ?"}
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
        <p className="absolute top-[338.723px] left-[375.319px] m-0 h-[33.881px] w-[234.563px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Past event usage: ?"}
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
        <p className="absolute top-[367.547px] left-[1073.53px] m-0 h-[35.999px] w-[338.094px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Previous event counts and"}
        </p>
        <p className="absolute top-[405.047px] left-[1181.78px] m-0 h-[35.999px] w-[121.594px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"bookings"}
        </p>
        <p className="absolute top-[470.309px] left-[550.047px] m-0 h-[40.234px] w-[643.906px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Planned places do not show demand."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Festival bus timetable and capacity plan · 9 Nov 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page23: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The queue estimate depends on assumptions."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share past incident reports with bus departure and train restart times to check those assumptions."
      }
    </p>
    <figure
      aria-label="The queue estimate depends on assumptions."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The queue estimate depends on assumptions. Share past incident reports with bus departure and train restart times to check those assumptions."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.707px] left-[311.998px] m-0 h-[38.116px] w-[361.203px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"122 waiting in the scenario"}
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
        <p className="absolute top-[135.786px] left-[387.576px] m-0 h-[33.881px] w-[210.047px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Assumed arrivals"}
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
        <p className="absolute top-[237.255px] left-[365.123px] m-0 h-[33.881px] w-[254.953px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Assumed departures"}
        </p>
        <div className="absolute top-[380.227px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
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
        <p className="absolute top-[338.723px] left-[319.459px] m-0 h-[33.881px] w-[346.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"No train restart is assumed"}
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
        <div className="absolute top-[216.172px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1055.968px] m-0 h-[35.999px] w-[373.219px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Past bus departures and"}
        </p>
        <p className="absolute top-[405.047px] left-[1213.796px] m-0 h-[35.999px] w-[57.563px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"train restart times"}
        </p>
        <p className="absolute top-[470.305px] left-[561.398px] m-0 h-[40.234px] w-[621.203px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The queue is calculated, not measured."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Disruption plan and assumed passenger arrivals · 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Bounded planning scenario · 16 October 2026"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page24: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Buses and drivers may not stay available."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share duty rosters and release records for the full disruption period."}
    </p>
    <figure
      aria-label="Buses and drivers may not stay available."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Buses and drivers may not stay available. Share duty rosters and release records for the full disruption period."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.707px] left-[322.139px] m-0 h-[38.116px] w-[340.922px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"One availability snapshot"}
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
        <p className="absolute top-[135.786px] left-[379.076px] m-0 h-[33.881px] w-[227.047px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Current availability"}
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
        <p className="absolute top-[237.255px] left-[406.389px] m-0 h-[33.881px] w-[172.422px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Later duties: ?"}
        </p>
        <div className="absolute top-[380.227px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
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
        <p className="absolute top-[338.723px] left-[374.85px] m-0 h-[33.881px] w-[235.5px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Release changes: ?"}
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
        <div className="absolute top-[216.172px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1046.772px] m-0 h-[35.999px] w-[391.609px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Duties and releases across the"}
        </p>
        <p className="absolute top-[405.047px] left-[1199.866px] m-0 h-[35.999px] w-[85.422px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"period"}
        </p>
        <p className="absolute top-[470.305px] left-[511.336px] m-0 h-[40.234px] w-[721.328px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Later availability is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Disruption plan and assumed passenger arrivals · 16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Bounded planning scenario · 16 October 2026"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page25: Page = () => (
  <section
    aria-label="Scheduling. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Scheduling"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Neither plan shows the financial effect."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share event and replacement service contracts, hire quotes and invoices."
      }
    </p>
    <figure
      aria-label="Neither plan shows the financial effect."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Neither plan shows the financial effect. Share event and replacement service contracts, hire quotes and invoices."
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
        <p className="absolute top-[329.903px] left-[167.094px] m-0 h-[33.881px] w-[333.375px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Two proposed services"}
        </p>
        <p className="absolute top-[329.903px] left-[661.84px] m-0 h-[33.881px] w-[376.203px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Contracts, quotes and invoices"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cost is unknown."}
        </p>
        <p className="absolute top-[470.305px] left-[608.023px] m-0 h-[40.234px] w-[527.953px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The financial effect is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Scheduling · October and November 2026"}
        <br />
        {"Fictional exercise data · Future timetable · not observed attendance"}
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
  Page9,
  Page10,
  Page11,
  Page12,
  Page13,
  Page14,
  Page15,
  Page16,
  Page17,
  Page18,
  Page19,
  Page20,
  Page21,
  Page22,
  Page23,
  Page24,
  Page25,
] satisfies Page[]
