import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Recurring discomfort has a cost" }
export const notes = [
  "Completing the journey does not guarantee a comfortable ride.\n\nPassenger experience includes what happens inside the bus, not only whether it leaves or arrives. The supplied accounts report heat and weak air movement on two journeys. They describe an experience, not a diagnosis of a particular broken part.\n\nSource: Six supplied passenger accounts · October 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "The same bus felt hot on two journeys.\n\nThe two accounts match departures using their stated stop and actual journey time. Both identify heat and weak airflow. These are selected accounts, not a complete complaint history; a wider complaint rate cannot be calculated from them.\n\nInterpretation: Two selected accounts on one bus cannot establish how common discomfort is.\n\nSource: Passenger accounts and matched departures · 5 and 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Three cooling repairs appear within fifteen days.\n\nThe findings were a cooling-fluid hose leak, dirty filter and cooling surfaces, and an intermittent fan-control relay. Similar symptoms do not prove that one fault remained unfixed. The September charge is already included in monthly history and must not be added to it again.\n\nInterpretation: Different findings can produce similar symptoms; repeated visits do not prove unsuccessful repairs.\n\nSource: Selected cooling repair records · 28 Sep–12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "The cooling jobs also took the bus out of use.\n\nDurations are calculated from each job’s opening and confirmed release times. These selected jobs followed duties; no cancelled service is established by these records. Staff labour hours and workshop elapsed hours are also not the same quantity.\n\nInterpretation: Workshop hours are not cancelled trips, passenger delays or staff labour hours.\n\nSource: Selected cooling repair records · 28 Sep–12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Caveats & data requests\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Six supplied passenger accounts · October 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Three cooling repairs on one bus cannot establish a fleet-wide pattern.\n\nThree cooling repairs on one bus cannot establish a fleet-wide pattern. Share earlier cooling job sheets and those for other buses to check how widely faults recur.\n\nTwo selected accounts on one bus cannot establish how common discomfort is.\n\nRequest the existing cooling-repair job cards, invoices and release records for earlier periods and other buses. If a complaint register is maintained, request the already-recorded cooling complaints over the same period. This extends supplied records rather than asking for cabin sensors, passenger follow-up or new customer research. Complaint counts need a service denominator and are not a representative measure of all passenger experiences.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Selected cooling repair records · 28 Sep–12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Two selected complaints cannot show how common uncomfortable rides are.\n\nTwo selected complaints cannot show how common uncomfortable rides are. Share the existing cooling-complaint register for earlier months to establish recorded complaint volumes.\n\nDifferent findings can produce similar symptoms; repeated visits do not prove unsuccessful repairs.\n\nRequest the existing cooling-repair job cards, invoices and release records for earlier periods and other buses. If a complaint register is maintained, request the already-recorded cooling complaints over the same period. This extends supplied records rather than asking for cabin sensors, passenger follow-up or new customer research. Complaint counts need a service denominator and are not a representative measure of all passenger experiences.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Selected cooling repair records · 28 Sep–12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
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
    aria-label="Recurring discomfort has a cost — How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Completing the journey does not guarantee a comfortable ride."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"A bus can run while passengers experience heat and weak airflow."}
    </p>
    <figure
      aria-label="Completing the journey does not guarantee a comfortable ride."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Completing the journey does not guarantee a comfortable ride. A bus can run while passengers experience heat and weak airflow."
        className="relative h-full w-full"
      >
        <div className="absolute top-[221.404px] left-[391.956px] h-[16px] w-[372.46px] text-muted-foreground">
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
        <div className="absolute top-[221.404px] left-[965.468px] h-[16px] w-[372.46px] text-muted-foreground">
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
        <div className="absolute top-[171.773px] left-[235.343px] h-[115.262px] w-[126.291px] text-foreground">
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
        <p className="absolute top-[336.401px] left-[224.613px] m-0 h-[30.705px] w-[147.75px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Journey runs"}
        </p>
        <div className="absolute top-[166.26px] left-[808.855px] h-[126.313px] w-[126.291px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 0.5492887417987575 22.901422516402484 22.905521408614398"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[814.039px] m-0 h-[30.705px] w-[115.922px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Hot inside"}
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
            <path d="M18 21a8 8 0 0 0-16 0"></path>
            <circle cx="10" cy="8" r="5"></circle>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[1336.793px] m-0 h-[30.705px] w-[217.438px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Uncomfortable ride"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Six supplied passenger accounts · October 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
    aria-label="Recurring discomfort has a cost — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The same bus felt hot on two journeys."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Passenger reports one week apart match the same bus in the journey records."
      }
    </p>
    <figure
      aria-label="The same bus felt hot on two journeys."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The same bus felt hot on two journeys. Passenger reports one week apart match the same bus in the journey records."
        className="relative h-full w-full"
      >
        <div className="absolute top-[398.752px] left-[406.404px] h-[87.182px] w-[931.192px] text-foreground">
          <svg
            viewBox="392.1327993148442 392.1327993148442 915.7344013703116 85.73440137031159"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M400 400 Q850 540 1300 400"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="10px, 12px"
              stroke="oklch(1 0 0 / 0.1)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[57.241px] left-[348.029px] m-0 h-[35.387px] w-[132.75px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"5 October"}
        </p>
        <div className="absolute top-[192.834px] left-[313.19px] h-[183.785px] w-[202.428px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.1417599252557311 2.141759925255731 21.71648014948854 19.71648014948854"
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
        <div className="absolute top-[142.837px] left-[511.482px] h-[100.758px] w-[100.74px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.11187183556260893 0.11187183556260893 23.776256328874783 23.780355221086698"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <div className="absolute top-[178.428px] left-[219.976px] h-[70.234px] w-[83.792px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.3601602055467388 1.6398397944532612 24.72032041109348 20.720318503744846"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
          </svg>
        </div>
        <p className="absolute top-[448.74px] left-[347.912px] m-0 h-[35.387px] w-[132.984px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Hot inside"}
        </p>
        <p className="absolute top-[57.241px] left-[1256.729px] m-0 h-[35.387px] w-[145.734px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"12 October"}
        </p>
        <div className="absolute top-[192.834px] left-[1228.382px] h-[183.785px] w-[202.428px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.1417599252557311 2.141759925255731 21.71648014948854 19.71648014948854"
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
        <div className="absolute top-[142.837px] left-[1426.674px] h-[100.758px] w-[100.74px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.11187183556260893 0.11187183556260893 23.776256328874783 23.780355221086698"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <div className="absolute top-[178.428px] left-[1135.168px] h-[70.234px] w-[83.792px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.3601602055467388 1.6398397944532612 24.72032041109348 20.720318503744846"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
          </svg>
        </div>
        <p className="absolute top-[448.74px] left-[1245.674px] m-0 h-[35.387px] w-[167.844px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Weak airflow"}
        </p>
        <p className="absolute top-[526.751px] left-[524.781px] m-0 h-[58.572px] w-[694.438px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"Same bus · repeated discomfort"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Passenger accounts and matched departures · 5 and 12 Oct 2026"
        }
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
    aria-label="Recurring discomfort has a cost — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Three cooling repairs appear within fifteen days."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "One bus, three separate recorded jobs; similar symptoms had different findings."
      }
    </p>
    <figure
      aria-label="Three cooling repairs appear within fifteen days."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Three cooling repairs appear within fifteen days. One bus, three separate recorded jobs; similar symptoms had different findings."
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
        <p className="absolute top-[118.254px] left-[371.139px] m-0 h-[35.387px] w-[96.109px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"28 Sep"}
        </p>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[104.746px] left-[1559.573px] m-0 h-[58.572px] w-[158.438px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$450"}
        </p>
        <p className="absolute top-[270.786px] left-[392.42px] m-0 h-[35.387px] w-[74.828px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"5 Oct"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[544.144px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1560.714px] m-0 h-[58.572px] w-[157.297px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$280"}
        </p>
        <p className="absolute top-[423.318px] left-[379.435px] m-0 h-[35.387px] w-[87.813px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"12 Oct"}
        </p>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[757.914px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1559.87px] m-0 h-[58.572px] w-[158.141px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$390"}
        </p>
        <p className="absolute top-[504.669px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.174px] left-[732.812px] m-0 h-[35.387px] w-[542.766px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Recorded repair charge · Singapore dollars"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep–12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
    aria-label="Recurring discomfort has a cost — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The cooling jobs also took the bus out of use."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Recorded repair holds total 9.7 hours; these are not passenger-delay hours."
      }
    </p>
    <figure
      aria-label="The cooling jobs also took the bus out of use."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The cooling jobs also took the bus out of use. Recorded repair holds total 9.7 hours; these are not passenger-delay hours."
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
        <p className="absolute top-[118.254px] left-[371.139px] m-0 h-[35.387px] w-[96.109px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"28 Sep"}
        </p>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[646.382px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[104.746px] left-[1604.042px] m-0 h-[58.572px] w-[113.969px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"2.8 h"}
        </p>
        <p className="absolute top-[270.786px] left-[392.42px] m-0 h-[35.387px] w-[74.828px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"5 Oct"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[684.404px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1645.495px] m-0 h-[58.572px] w-[72.516px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3 h"}
        </p>
        <p className="absolute top-[423.318px] left-[379.435px] m-0 h-[35.387px] w-[87.813px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"12 Oct"}
        </p>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1603.229px] m-0 h-[58.572px] w-[114.781px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3.8 h"}
        </p>
        <p className="absolute top-[504.669px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.174px] left-[724.976px] m-0 h-[35.387px] w-[558.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Hours from repair opening to signed release"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep–12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
    aria-label="Recurring discomfort has a cost — Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Recurring discomfort has a cost"}
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
    aria-label="Recurring discomfort has a cost — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {
        "Three cooling repairs on one bus cannot establish a fleet-wide pattern."
      }
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier cooling job sheets and those for other buses to check how widely faults recur."
      }
    </p>
    <figure
      aria-label="Three cooling repairs on one bus cannot establish a fleet-wide pattern."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Three cooling repairs on one bus cannot establish a fleet-wide pattern. Share earlier cooling job sheets and those for other buses to check how widely faults recur."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.704px] left-[371.866px] m-0 h-[38.116px] w-[241.469px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"3 jobs on one bus"}
        </p>
        <div className="absolute top-[177.288px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
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
        <p className="absolute top-[135.79px] left-[406.623px] m-0 h-[33.881px] w-[171.953px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"28 Sep: repair"}
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
        <p className="absolute top-[237.257px] left-[416.67px] m-0 h-[33.881px] w-[151.859px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"5 Oct: repair"}
        </p>
        <div className="absolute top-[380.224px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
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
        <p className="absolute top-[338.724px] left-[410.537px] m-0 h-[33.881px] w-[164.125px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"12 Oct: repair"}
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
        <p className="absolute top-[217.992px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1064.819px] m-0 h-[35.999px] w-[355.516px] text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier jobs and other buses"}
        </p>
        <p className="absolute top-[470.309px] left-[595.109px] m-0 h-[40.234px] w-[553.781px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Frequency across the fleet is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep–12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
    aria-label="Recurring discomfort has a cost — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Recurring discomfort has a cost"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {
        "Two selected complaints cannot show how common uncomfortable rides are."
      }
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share the existing cooling-complaint register for earlier months to establish recorded complaint volumes."
      }
    </p>
    <figure
      aria-label="Two selected complaints cannot show how common uncomfortable rides are."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two selected complaints cannot show how common uncomfortable rides are. Share the existing cooling-complaint register for earlier months to establish recorded complaint volumes."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.969px] left-[349.142px] m-0 h-[42.352px] w-[304.563px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"2 selected accounts"}
        </p>
        <p className="absolute top-[57.969px] left-[1094.333px] m-0 h-[42.352px] w-[331.781px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Full complaint register"}
        </p>
        <div className="absolute top-[209.273px] left-[391.956px] h-[75.557px] w-[68.94px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.5821479029979293 0.5821479029979293 20.83570419400414 22.83570419400414"
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
        <div className="absolute top-[209.273px] left-[533.128px] h-[75.557px] w-[68.94px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.5821479029979293 0.5821479029979293 20.83570419400414 22.83570419400414"
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
        <div className="absolute top-[247.875px] left-[802.237px] h-[16px] w-[174.819px] text-muted-foreground">
          <svg
            viewBox="770.9330546362422 280.9330546362422 198.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M780 290H960"
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
        <div className="absolute top-[222.141px] left-[855.912px] h-[67.469px] w-[67.469px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.108666981859805 -1.108666981859805 26.21733396371961 26.21733396371961"
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
        <div className="absolute top-[154.406px] left-[1066.112px] h-[229.406px] w-[388.223px] [border-radius:5.294px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[200.347px] left-[1233.067px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[391.665px] left-[385.783px] m-0 h-[33.881px] w-[231.281px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Selected examples"}
        </p>
        <p className="absolute top-[391.665px] left-[1090.411px] m-0 h-[33.881px] w-[339.625px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Wider pattern not measured"}
        </p>
        <p className="absolute top-[426.958px] left-[1231.575px] m-0 h-[33.881px] w-[57.297px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"here"}
        </p>
        <p className="absolute top-[470.309px] left-[544.414px] m-0 h-[40.234px] w-[655.172px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Selected accounts do not establish frequency."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep–12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
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
