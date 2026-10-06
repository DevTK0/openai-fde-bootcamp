import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = {
  title: "Workshop bookings conflict with available resources",
}
export const notes = [
  "A bus cannot be serviced and carry passengers at once.\n\nThe supplied plan describes a single workshop space and two mechanics. Two requested jobs require buses that also have scheduled passenger journeys. The evidence is a future planning conflict, not an observed service cancellation.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Two jobs are booked into one workshop space.\n\nOne requested job lasts 09:00–13:00 and the other 09:00–11:00. Both require one space. The workshop has one space continuously available 09:00–17:00. The diagram shows the requested bookings exactly; no alternative schedule is presented.\n\nInterpretation: One requested plan shows a conflict, not how often conflicts occur or whether this plan was carried out.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "The overlapping jobs also need too many mechanics.\n\nThe source lists two mechanics available, versus three required when both jobs run together. Counting total staffing hours would hide this simultaneous resource conflict. The record does not establish overtime costs or an approved staffing change.\n\nInterpretation: Staffing needs and availability are planning inputs; actual work and attendance may differ.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Eight passenger trips depend on the two buses.\n\nThere are 8 protected journeys across the two buses. The single replacement bus has specific morning and afternoon windows and uses the assigned duty drivers. Two windows are not two buses. No other bus is confirmed available in this bounded future roster.\n\nInterpretation: The supplied roster may omit other cover; eight scheduled trips are not eight cancellations.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "Caveats & data requests\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "One proposed schedule cannot show whether workshop clashes happen regularly.\n\nOne proposed schedule cannot show whether workshop clashes happen regularly. Share earlier booking logs and completed job sheets to compare planned overlaps with what actually happened.\n\nOne requested plan shows a conflict, not how often conflicts occur or whether this plan was carried out.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "A planned staffing shortage does not show actual overtime worked.\n\nA planned staffing shortage does not show actual overtime worked. Share mechanic rosters and timesheets to compare scheduled staffing with paid hours.\n\nStaffing needs and availability are planning inputs; actual work and attendance may differ.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "A replacement bus in the plan does not establish an extra expense.\n\nA replacement bus in the plan does not establish an extra expense. Share existing hire and cover invoices to establish whether replacement service incurred additional charges.\n\nThe supplied roster may omit other cover; eight scheduled trips are not eight cancellations.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
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
    aria-label="Workshop bookings conflict with available resources — How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A bus cannot be serviced and carry passengers at once."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Maintenance competes for workshop space, mechanics and replacement buses."
      }
    </p>
    <figure
      aria-label="A bus cannot be serviced and carry passengers at once."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A bus cannot be serviced and carry passengers at once. Maintenance competes for workshop space, mechanics and replacement buses."
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
        <p className="absolute top-[336.401px] left-[213.105px] m-0 h-[30.705px] w-[170.766px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
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
        <p className="absolute top-[336.401px] left-[788.5px] m-0 h-[30.705px] w-[167px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
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
        <p className="absolute top-[336.401px] left-[1355.996px] m-0 h-[30.705px] w-[179.031px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
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

const Page2: Page = () => (
  <section
    aria-label="Workshop bookings conflict with available resources — Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two jobs are booked into one workshop space."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Both requested bookings start at 09:00, creating two hours of overlap."}
    </p>
    <figure
      aria-label="Two jobs are booked into one workshop space."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two jobs are booked into one workshop space. Both requested bookings start at 09:00, creating two hours of overlap."
        className="relative h-full w-full"
      >
        <p className="absolute top-[11.194px] left-[503.195px] m-0 h-[58.572px] w-[737.609px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
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
        <p className="absolute top-[103.002px] left-[443.632px] m-0 h-[35.387px] w-[83.906px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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
        <p className="absolute top-[103.002px] left-[743.09px] m-0 h-[35.387px] w-[74.781px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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
        <p className="absolute top-[103.002px] left-[1035.79px] m-0 h-[35.387px] w-[79.172px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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
        <p className="absolute top-[103.002px] left-[1330.779px] m-0 h-[35.387px] w-[78.984px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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
        <p className="absolute top-[103.002px] left-[1626.479px] m-0 h-[35.387px] w-[77.375px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"17:00"}
        </p>
        <div className="absolute top-[157.617px] left-[485.586px] h-[269.473px] w-[294.895px] [background-color:oklab(0.704_0.176821_0.072217_/_0.1)]"></div>
        <p className="absolute top-[211.806px] left-[174.22px] m-0 h-[35.387px] w-[232.016px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Cooling diagnosis"}
        </p>
        <p className="absolute top-[338.916px] left-[220.22px] m-0 h-[35.387px] w-[186.016px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
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
        <p className="absolute top-[477.213px] left-[749.972px] m-0 h-[35.387px] w-[427.094px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
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

const Page3: Page = () => (
  <section
    aria-label="Workshop bookings conflict with available resources — Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The overlapping jobs also need too many mechanics."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"At 09:00, one job needs two people and the other needs one."}
    </p>
    <figure
      aria-label="The overlapping jobs also need too many mechanics."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The overlapping jobs also need too many mechanics. At 09:00, one job needs two people and the other needs one."
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
        <p className="absolute top-[169.099px] left-[347.904px] m-0 h-[35.387px] w-[119.344px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Available"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[583.011px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"2"}
        </p>
        <p className="absolute top-[321.631px] left-[348.639px] m-0 h-[35.387px] w-[118.609px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Required"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[814.194px] m-0 h-[35.387px] w-[380px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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

const Page4: Page = () => (
  <section
    aria-label="Workshop bookings conflict with available resources — Planning evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Planning evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Eight passenger trips depend on the two buses."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Only one replacement bus is named in the supplied plan."}
    </p>
    <figure
      aria-label="Eight passenger trips depend on the two buses."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Eight passenger trips depend on the two buses. Only one replacement bus is named in the supplied plan."
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
        <p className="absolute top-[169.099px] left-[173.404px] m-0 h-[35.387px] w-[293.844px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Buses requesting work"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[155.589px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"2"}
        </p>
        <p className="absolute top-[321.631px] left-[121.201px] m-0 h-[35.387px] w-[346.047px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Named replacement buses"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[437.258px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[308.12px] left-[1690.901px] m-0 h-[58.572px] w-[27.109px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"1"}
        </p>
        <p className="absolute top-[402.982px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[782.366px] m-0 h-[35.387px] w-[443.656px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
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

const Page5: Page = () => (
  <section
    aria-label="Workshop bookings conflict with available resources — Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Workshop bookings conflict with available resources"}
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
    aria-label="Workshop bookings conflict with available resources — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {
        "One proposed schedule cannot show whether workshop clashes happen regularly."
      }
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier booking logs and completed job sheets to compare planned overlaps with what actually happened."
      }
    </p>
    <figure
      aria-label="One proposed schedule cannot show whether workshop clashes happen regularly."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One proposed schedule cannot show whether workshop clashes happen regularly. Share earlier booking logs and completed job sheets to compare planned overlaps with what actually happened."
        className="relative h-full w-full"
      >
        <p className="absolute top-[26.293px] left-[309.092px] m-0 h-[38.116px] w-[367.016px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"19 Oct: proposed bookings"}
        </p>
        <p className="absolute top-[26.293px] left-[1075.403px] m-0 h-[38.116px] w-[369.641px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier completed bookings"}
        </p>
        <p className="absolute top-[109.321px] left-[241.154px] m-0 h-[33.881px] w-[79.375px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"09:00"}
        </p>
        <p className="absolute top-[109.321px] left-[457.209px] m-0 h-[33.881px] w-[70.781px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"11:00"}
        </p>
        <p className="absolute top-[109.321px] left-[666.874px] m-0 h-[33.881px] w-[74.969px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"13:00"}
        </p>
        <div className="absolute top-[167.641px] left-[280.842px] h-[211.758px] w-[211.758px] [background-color:oklab(0.704_0.176821_0.072217_/_0.1)]"></div>
        <div className="absolute top-[185.289px] left-[280.842px] h-[52.938px] w-[423.516px] bg-destructive"></div>
        <div className="absolute top-[295.578px] left-[280.842px] h-[52.941px] w-[211.758px] bg-destructive"></div>
        <p className="absolute top-[400.489px] left-[322.873px] m-0 h-[33.881px] w-[339.453px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
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
        <p className="absolute top-[182.7px] left-[1241.89px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[382.841px] left-[1114.797px] m-0 h-[33.881px] w-[308.5px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"How often did actual jobs"}
        </p>
        <p className="absolute top-[418.134px] left-[1228.062px] m-0 h-[33.881px] w-[81.969px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"clash?"}
        </p>
        <p className="absolute top-[470.309px] left-[535.633px] m-0 h-[40.234px] w-[672.734px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"One clash does not show how often it happens."}
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
    aria-label="Workshop bookings conflict with available resources — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A planned staffing shortage does not show actual overtime worked."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share mechanic rosters and timesheets to compare scheduled staffing with paid hours."
      }
    </p>
    <figure
      aria-label="A planned staffing shortage does not show actual overtime worked."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A planned staffing shortage does not show actual overtime worked. Share mechanic rosters and timesheets to compare scheduled staffing with paid hours."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[300.412px] m-0 h-[38.116px] w-[384.375px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
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
        <p className="absolute top-[135.79px] left-[399.389px] m-0 h-[33.881px] w-[186.422px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
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
        <p className="absolute top-[237.259px] left-[367.576px] m-0 h-[33.881px] w-[250.047px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
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
        <p className="absolute top-[338.723px] left-[397.717px] m-0 h-[33.881px] w-[189.766px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
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
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1054.022px] m-0 h-[35.999px] w-[377.109px] text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual hours from timesheets"}
        </p>
        <p className="absolute top-[470.309px] left-[571.703px] m-0 h-[40.234px] w-[600.594px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Overtime cannot be inferred from the plan."}
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
    aria-label="Workshop bookings conflict with available resources — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>
        {"LIONLINK · Workshop bookings conflict with available resources"}
      </span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A replacement bus in the plan does not establish an extra expense."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share existing hire and cover invoices to establish whether replacement service incurred additional charges."
      }
    </p>
    <figure
      aria-label="A replacement bus in the plan does not establish an extra expense."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A replacement bus in the plan does not establish an extra expense. Share existing hire and cover invoices to establish whether replacement service incurred additional charges."
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
        <p className="absolute top-[329.903px] left-[186.602px] m-0 h-[33.881px] w-[294.359px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"1 replacement bus listed"}
        </p>
        <p className="absolute top-[329.903px] left-[709.036px] m-0 h-[33.881px] w-[281.813px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Hire and cover invoices"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dollar effect not established"}
        </p>
        <p className="absolute top-[470.309px] left-[609.43px] m-0 h-[40.234px] w-[525.141px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Additional cover spending: unknown."}
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
