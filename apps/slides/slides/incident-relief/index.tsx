import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = {
  title: "Replacement buses cannot clear the planned queue",
}
export const notes = [
  "Queues grow while replacement buses are away.\n\nThe scenario assumes no confirmed train restoration through 19:00. The demand model begins with an existing queue and adds arrivals over four half-hour periods. These are supplied assumptions, not live observations or a forecast.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The plan has 170 places for 292 people.\n\nThe arithmetic is 112 initially waiting plus 180 subsequent arrivals, versus two departures with 85 places each. Both departures have enough waiting demand to fill. The result assumes no abandonment or route switching, and accessible boarding.\n\nInterpretation: Demand is assumed, not observed; restoration, alternative routes and people leaving would change it.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The plan assumes new arrivals every half-hour.\n\nArrivals are assumed uniformly distributed within each supplied half-hour. This is why a comparison of one initial queue with one bus would understate the pressure. These assumptions are only for this bounded fictional incident.\n\nInterpretation: Arrival rates are scenario inputs and may vary widely between real incidents.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The plan leaves 122 people waiting.\n\nThis is a scenario balance, not observed abandonment or lost customers. The remaining queue is 122 divided by 292, or 41.8% of the assumed demand. Waiting duration and the monetary consequences require additional calculation and commercial data.\n\nInterpretation: The 122-person queue is conditional arithmetic, not an observed outcome or a forecast.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "The queue estimate depends on assumptions.\n\nThe queue estimate depends on assumptions. Share past incident reports with bus departure and train restart times to check those assumptions.\n\nDemand is assumed, not observed; restoration, alternative routes and people leaving would change it.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Buses and drivers may not stay available.\n\nBuses and drivers may not stay available. Share duty rosters and release records for the full disruption period.\n\nArrival rates are scenario inputs and may vary widely between real incidents.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
  "Queue length does not show replacement service costs.\n\nQueue length does not show replacement service costs. Share replacement service contracts and invoices to compare agreed rates with actual payments.\n\nThe 122-person queue is conditional arithmetic, not an observed outcome or a forecast.\n\nRequest previous incident logs with recorded dispatch and restoration times, bus and driver duty rosters, and relief-service contracts and invoices. Use any existing operational counts in those reports but do not ask for passenger abandonment or individual alternatives. These records can test whether the scenario resembles prior operations and show recorded spending. Assumed queue sizes are not observed ridership changes.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Disruption plan and assumed passenger arrivals · 16 Oct 2026.\nScope: Bounded planning scenario · 16 October 2026. All figures are fictional exercise data, not live business results.",
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
    aria-label="Replacement buses cannot clear the planned queue. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
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

const Page2: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The plan has 170 places for 292 people."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "The initial queue and assumed arrivals exceed the two planned departures."
      }
    </p>
    <figure
      aria-label="The plan has 170 places for 292 people."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The plan has 170 places for 292 people. The initial queue and assumed arrivals exceed the two planned departures."
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

const Page3: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
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

const Page4: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The plan leaves 122 people waiting."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"About 42% of the assumed demand remains at 19:00."}
    </p>
    <figure
      aria-label="The plan leaves 122 people waiting."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The plan leaves 122 people waiting. About 42% of the assumed demand remains at 19:00."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.023px] left-[508.092px] h-[290.563px] w-[16px] text-foreground">
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
        <p className="absolute top-[169.095px] left-[138.342px] m-0 h-[35.387px] w-[328.906px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Carried by planned buses"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1632.042px] m-0 h-[58.572px] w-[85.969px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"170"}
        </p>
        <p className="absolute top-[321.627px] left-[205.279px] m-0 h-[35.387px] w-[261.969px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Still waiting at 19:00"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[627.595px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1632.667px] m-0 h-[58.572px] w-[85.344px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"122"}
        </p>
        <p className="absolute top-[402.978px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[804.491px] m-0 h-[35.387px] w-[399.406px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"People in the supplied scenario"}
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

const Page5: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Replacement buses cannot clear the planned queue"}
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
    aria-label="Replacement buses cannot clear the planned queue. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
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

const Page7: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
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

const Page8: Page = () => (
  <section
    aria-label="Replacement buses cannot clear the planned queue. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Replacement buses cannot clear the planned queue"}
      </span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Queue length does not show replacement service costs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share replacement service contracts and invoices to compare agreed rates with actual payments."
      }
    </p>
    <figure
      aria-label="Queue length does not show replacement service costs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Queue length does not show replacement service costs. Share replacement service contracts and invoices to compare agreed rates with actual payments."
        className="relative h-full w-full"
      >
        <div className="absolute top-[136.852px] left-[271.371px] h-[140.992px] w-[115.997px] text-foreground">
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
        <div className="absolute top-[110.289px] left-[735.24px] h-[194.117px] w-[229.405px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[151.821px] left-[822.786px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
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
        <div className="absolute top-[139.789px] left-[1273.546px] h-[64.531px] w-[96.88px] text-foreground">
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
        <p className="absolute top-[329.903px] left-[172.203px] m-0 h-[33.881px] w-[323.156px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"122 waiting in the scenario"}
        </p>
        <p className="absolute top-[329.903px] left-[676.153px] m-0 h-[33.881px] w-[347.578px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Service contracts and invoices"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cost is unknown."}
        </p>
        <p className="absolute top-[470.305px] left-[640.375px] m-0 h-[40.234px] w-[463.25px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Replacement service costs are unknown."}
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
