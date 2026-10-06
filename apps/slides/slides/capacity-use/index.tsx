import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Bus use varies sharply at the same departure" }
export const notes = [
  "Empty places and long queues can coexist.\n\nThe selected departure uses the same recorded 85-person capacity on each supplied day. A daily boarding record shows how much of that capacity is used at the starting stop. This does not measure occupancy for the entire route.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "Eight departures were full; two were far below capacity.\n\nThe eight busy days each boarded 85 people and left a queue. On 9 October only 18 boarded, and on 16 October 26 boarded. Later stops can fill the bus; the empty capacity shown here is only at this origin departure.\n\nInterpretation: This is one starting stop over ten weekdays; later stops may fill the bus.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "On the quieter days, most places were empty at departure.\n\nThe percentages are about 21% and 31%. Empty places are not equal to avoidable operating cost: the bus may be needed for later stops, accessibility and the timetable. Fuel, driver costs and whole-route revenue are not supplied here.\n\nInterpretation: Empty places at departure do not establish that a bus or its operating cost is avoidable.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "The network average also hides local crowding.\n\nOccupancy is the unweighted average of departing occupancy ratios across stop calls, not a time-weighted or passenger-kilometre load factor. The queue measure counts stops with anyone remaining. The two measures have different meanings and do not add to 100%. Neither proves that spare capacity can be moved freely.\n\nInterpretation: These measures have different denominators; average occupancy is not weighted by distance or time.\n\nSource: Journey and passenger queue records · 5–16 Oct 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "Caveats & data requests\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "Ten weekdays cannot establish typical demand across months and weekends.\n\nTen weekdays cannot establish typical demand across months and weekends. Share earlier operating extracts to distinguish a recurring demand pattern from an unusual fortnight.\n\nThis is one starting stop over ten weekdays; later stops may fill the bus.\n\nComplete-route stop-by-stop counts are already supplied. Request earlier dates of the same extract; do not request other trips already available. Ask for routine fuel, payroll and bus-expense reports at the level already maintained; do not require a new allocation of every cost to every passenger. This extends reporting the operator has already demonstrated it holds. Full-route records distinguish an empty origin from a quiet complete journey, while accounting records provide the cost basis. They do not establish a removable bus or guaranteed saving.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
  "Empty places do not show how much operating cost could be avoided.\n\nEmpty places do not show how much operating cost could be avoided. Share existing fuel, payroll and bus-cost reports to separate costs that change with service from costs that remain.\n\nEmpty places at departure do not establish that a bus or its operating cost is avoidable.\n\nComplete-route stop-by-stop counts are already supplied. Request earlier dates of the same extract; do not request other trips already available. Ask for routine fuel, payroll and bus-expense reports at the level already maintained; do not require a new allocation of every cost to every passenger. This extends reporting the operator has already demonstrated it holds. Full-route records distinguish an empty origin from a quiet complete journey, while accounting records provide the cost basis. They do not establish a removable bus or guaranteed saving.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Same 07:15 departure at Toa Payoh · ten weekdays in October 2026.\nScope: One morning departure · all ten supplied dates. All figures are fictional exercise data, not live business results.",
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
    aria-label="Bus use varies sharply at the same departure — How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Empty places and long queues can coexist."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"An average hides how demand changes from day to day."}
    </p>
    <figure
      aria-label="Empty places and long queues can coexist."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Empty places and long queues can coexist. An average hides how demand changes from day to day."
        className="relative h-full w-full"
      >
        <div className="absolute top-[256.391px] left-[319.969px] h-[16px] w-[426.82px] text-muted-foreground">
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
        <div className="absolute top-[244.188px] left-[726.721px] h-[40.402px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[256.391px] left-[980.941px] h-[16px] w-[426.82px] text-muted-foreground">
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
        <div className="absolute top-[244.188px] left-[1387.693px] h-[40.402px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[199.188px] left-[139.473px] h-[130.402px] w-[143.11px] text-foreground">
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
        <p className="absolute top-[387.728px] left-[90.075px] m-0 h-[35.387px] w-[241.906px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Fixed bus capacity"}
        </p>
        <div className="absolute top-[192.832px] left-[806.8px] h-[136.758px] w-[130.399px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.7412478903750725 0.7412478903750725 20.517504219249854 21.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M8 2v3"></path>
            <path d="M16 2v3"></path>
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M8 13h.01"></path>
            <path d="M12 13h.01"></path>
            <path d="M16 13h.01"></path>
            <path d="M8 17h.01"></path>
            <path d="M12 17h.01"></path>
            <path d="M16 17h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[387.728px] left-[759.102px] m-0 h-[35.387px] w-[225.797px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Different demand"}
        </p>
        <div className="absolute top-[199.188px] left-[1461.417px] h-[130.402px] w-[143.11px] text-destructive">
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
        <p className="absolute top-[387.728px] left-[1455.824px] m-0 h-[35.387px] w-[154.297px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Uneven use"}
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
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
    aria-label="Bus use varies sharply at the same departure — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Eight departures were full; two were far below capacity."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Boardings at the same origin and departure time; the dashed line is bus capacity."
      }
    </p>
    <figure
      aria-label="Eight departures were full; two were far below capacity."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Eight departures were full; two were far below capacity. Boardings at the same origin and departure time; the dashed line is bus capacity."
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
        <p className="absolute top-[371.694px] left-[195.844px] m-0 h-[30.705px] w-[20px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <div className="absolute top-[127.363px] left-[264.607px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[285.106px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[285.028px] m-0 h-[30.705px] w-[35.391px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"05"}
        </p>
        <div className="absolute top-[127.363px] left-[391.662px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[412.161px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[411.895px] m-0 h-[30.705px] w-[35.766px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"06"}
        </p>
        <div className="absolute top-[127.363px] left-[518.717px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[539.216px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[539.888px] m-0 h-[30.705px] w-[33.891px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"07"}
        </p>
        <div className="absolute top-[127.363px] left-[645.772px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[666.271px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[665.974px] m-0 h-[30.705px] w-[35.828px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"08"}
        </p>
        <div className="absolute top-[332.98px] left-[772.827px] h-[55.242px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[291.749px] left-[795.146px] m-0 h-[30.705px] w-[31.594px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"18"}
        </p>
        <p className="absolute top-[411.398px] left-[793.045px] m-0 h-[30.705px] w-[35.797px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"09"}
        </p>
        <div className="absolute top-[127.363px] left-[899.881px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[920.381px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[922.654px] m-0 h-[30.705px] w-[30.688px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"12"}
        </p>
        <div className="absolute top-[127.363px] left-[1026.936px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[1047.436px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[1049.381px] m-0 h-[30.705px] w-[31.344px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"13"}
        </p>
        <div className="absolute top-[127.363px] left-[1153.991px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[1174.491px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[1176.264px] m-0 h-[30.705px] w-[31.687px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"14"}
        </p>
        <div className="absolute top-[127.363px] left-[1281.046px] h-[260.859px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[86.128px] left-[1301.546px] m-0 h-[30.705px] w-[35.234px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"85"}
        </p>
        <p className="absolute top-[411.398px] left-[1303.569px] m-0 h-[30.705px] w-[31.188px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"15"}
        </p>
        <div className="absolute top-[308.43px] left-[1408.101px] h-[79.793px] w-[76.233px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[267.194px] left-[1428.858px] m-0 h-[30.705px] w-[34.719px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"26"}
        </p>
        <p className="absolute top-[411.398px] left-[1430.452px] m-0 h-[30.705px] w-[31.531px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"16"}
        </p>
        <div className="absolute top-[119.363px] left-[228.725px] h-[16px] w-[1286.549px] text-foreground">
          <svg
            viewBox="120.93305463624223 135.28087873292193 1458.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="130"
              x2="1570"
              y1="144.3478260869565"
              y2="144.3478260869565"
              strokeDasharray="10px, 10px"
              strokeWidth="3px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(0.704 0.191 22.216)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-destructive"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[34.648px] left-[1344.677px] m-0 h-[30.705px] w-[113.438px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"85 places"}
        </p>
        <p className="absolute top-[481.983px] left-[692.57px] m-0 h-[30.705px] w-[358.859px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"People boarding · October dates"}
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
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
    aria-label="Bus use varies sharply at the same departure — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"On the quieter days, most places were empty at departure."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"18 and 26 boardings on a bus with room for 85 people."}
    </p>
    <figure
      aria-label="On the quieter days, most places were empty at departure."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="On the quieter days, most places were empty at departure. 18 and 26 boardings on a bus with room for 85 people."
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
        <p className="absolute top-[146.702px] left-[388.96px] m-0 h-[30.705px] w-[132.109px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"09 October"}
        </p>
        <div className="absolute top-[136.762px] left-[563.186px] h-[59.996px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.762px] left-[563.186px] h-[59.996px] w-[525.323px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1520.237px] m-0 h-[50.822px] w-[86.094px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"21%"}
        </p>
        <p className="absolute top-[279.05px] left-[393.242px] m-0 h-[30.705px] w-[127.828px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"16 October"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[267.402px] left-[1519.112px] m-0 h-[50.822px] w-[87.219px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"31%"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.339px] left-[799.601px] m-0 h-[30.705px] w-[374.203px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Origin capacity used · percentage"}
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
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
    aria-label="Bus use varies sharply at the same departure — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The network average also hides local crowding."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Average recorded occupancy was 36%, yet queues remained at 8.8% of stop visits."
      }
    </p>
    <figure
      aria-label="The network average also hides local crowding."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The network average also hides local crowding. Average recorded occupancy was 36%, yet queues remained at 8.8% of stop visits."
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
        <p className="absolute top-[169.099px] left-[210.717px] m-0 h-[35.387px] w-[256.531px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Average occupancy"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1610.432px] m-0 h-[58.572px] w-[107.578px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"36%"}
        </p>
        <p className="absolute top-[321.631px] left-[190.342px] m-0 h-[35.387px] w-[276.906px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Stops leaving queues"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[211.289px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1598.214px] m-0 h-[58.572px] w-[119.797px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"8.8%"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[649.101px] m-0 h-[35.387px] w-[710.188px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Percent · different measures, not complementary shares"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Journey and passenger queue records · 5–16 Oct 2026"}
        <br />
        {
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
    aria-label="Bus use varies sharply at the same departure — Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Bus use varies sharply at the same departure"}
    </header>
    <div className="flex flex-1 items-center justify-between gap-24">
      <div className="max-w-[1200px]">
        <div className="mb-12 h-2 w-32 bg-destructive"></div>
        <h1 className="text-[120px] leading-[1.05] font-semibold tracking-[-0.035em]">
          {"Caveats & data requests"}
        </h1>
        <p className="mt-12 text-[36px] leading-snug text-muted-foreground">
          {"What the evidence cannot yet tell us."}
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
    aria-label="Bus use varies sharply at the same departure — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {
        "Ten weekdays cannot establish typical demand across months and weekends."
      }
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier operating extracts to distinguish a recurring demand pattern from an unusual fortnight."
      }
    </p>
    <figure
      aria-label="Ten weekdays cannot establish typical demand across months and weekends."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Ten weekdays cannot establish typical demand across months and weekends. Share earlier operating extracts to distinguish a recurring demand pattern from an unusual fortnight."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.969px] left-[399.522px] m-0 h-[42.352px] w-[442.031px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier months and weekends"}
        </p>
        <p className="absolute top-[61.586px] left-[1172.167px] m-0 h-[38.116px] w-[211.406px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"5–16 Oct 2026"}
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
        <div className="absolute top-[186.113px] left-[1066.935px] h-[135.113px] w-[421.87px] text-foreground">
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
        <div className="absolute top-[216.168px] left-[1074.935px] h-[79.41px] w-[405.87px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[227.698px] left-[1158.87px] m-0 h-[50.822px] w-[238px] text-[length:42.352px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"10 weekdays"}
        </p>
        <p className="absolute top-[129.759px] left-[593.381px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[343.137px] left-[466.287px] m-0 h-[33.881px] w-[308.5px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"No earlier observations in"}
        </p>
        <p className="absolute top-[378.43px] left-[551.998px] m-0 h-[33.881px] w-[137.078px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"this extract"}
        </p>
        <p className="absolute top-[343.137px] left-[1172.815px] m-0 h-[33.881px] w-[210.109px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Supplied window"}
        </p>
        <p className="absolute top-[470.309px] left-[600.813px] m-0 h-[40.234px] w-[542.375px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Typical demand remains unconfirmed."}
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
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
    aria-label="Bus use varies sharply at the same departure — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Bus use varies sharply at the same departure"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Empty places do not show how much operating cost could be avoided."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share existing fuel, payroll and bus-cost reports to separate costs that change with service from costs that remain."
      }
    </p>
    <figure
      aria-label="Empty places do not show how much operating cost could be avoided."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Empty places do not show how much operating cost could be avoided. Share existing fuel, payroll and bus-cost reports to separate costs that change with service from costs that remain."
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
        <p className="absolute top-[151.817px] left-[822.786px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
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
        <p className="absolute top-[142.993px] left-[1427.179px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[329.903px] left-[170.922px] m-0 h-[33.881px] w-[325.719px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Quiet departures observed"}
        </p>
        <p className="absolute top-[329.903px] left-[690.059px] m-0 h-[33.881px] w-[319.766px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Fuel, payroll and bus costs"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dollar effect not established"}
        </p>
        <p className="absolute top-[470.309px] left-[617.922px] m-0 h-[40.234px] w-[508.156px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Avoidable operating cost: unknown."}
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
          "Fictional exercise data · One morning departure · all ten supplied dates"
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
] satisfies Page[]
