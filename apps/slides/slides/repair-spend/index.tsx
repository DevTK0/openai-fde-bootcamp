import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Repair costs were higher in the second year" }
export const notes = [
  "More repairs mean both bills and buses off the road.\n\nRepair spending and time under repair are different measures of the same operational burden. The eight selected buses have complete monthly records across two equal twelve-month periods. Time unavailable does not establish cancelled services or passenger delay.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair spending grew much faster than distance travelled.\n\nEarlier year: October 2024–September 2025. Later year: October 2025–September 2026. Repair spend rose from S$13,625 to S$24,880, while distance rose from 131,600 to 146,570 km. These are incurred repair charges, not quotes.\n\nInterpretation: Two years show a difference, not a sustained trend; only eight selected buses are included.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair spending per kilometre was higher in the second year.\n\nDividing repair charges by the distance recorded in the same period makes the comparison more informative than raw bills. The difference remains substantial after allowing for distance. It does not establish whether age, workload, specific faults or other conditions caused the increase.\n\nInterpretation: Distance is accounted for; bus age, workload, prices and one-off repairs are not.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "The number of repair jobs also rose.\n\nThere were 31 corrective jobs in the earlier year and 55 in the later year. The increase is not just a comparison of one expensive invoice with many small ones. Jobs can follow faults found between duties; these counts must not be called cancelled trips or breakdowns.\n\nInterpretation: More jobs may reflect more inspections or changed recording, as well as more faults.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Caveats & data requests\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Two annual totals cannot establish a sustained increase.\n\nTwo annual totals cannot establish a sustained increase. Share earlier monthly repair records to distinguish a persistent increase from an unusual year.\n\nTwo years show a difference, not a sustained trend; only eight selected buses are included.\n\nRequest earlier years of the same monthly maintenance and mileage report, records for the other buses, and the underlying repair invoices or job sheets. Start with records already held; no new study is needed. Older records help distinguish a persistent increase from an unusual year. Wider coverage tests whether the eight selected buses represent the fleet; invoice detail separates price changes and major one-off work.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Costs for eight selected buses may not represent the whole fleet.\n\nCosts for eight selected buses may not represent the whole fleet. Share the same repair and mileage reports for the other buses before estimating fleet-wide costs.\n\nDistance is accounted for; bus age, workload, prices and one-off repairs are not.\n\nRequest earlier years of the same monthly maintenance and mileage report, records for the other buses, and the underlying repair invoices or job sheets. Start with records already held; no new study is needed. Older records help distinguish a persistent increase from an unusual year. Wider coverage tests whether the eight selected buses represent the fleet; invoice detail separates price changes and major one-off work.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Higher repair bills do not tell us what became more expensive.\n\nHigher repair bills do not tell us what became more expensive. Share repair invoices and job sheets to separate parts, labour and major one-off jobs.\n\nMore jobs may reflect more inspections or changed recording, as well as more faults.\n\nRequest earlier years of the same monthly maintenance and mileage report, records for the other buses, and the underlying repair invoices or job sheets. Start with records already held; no new study is needed. Older records help distinguish a persistent increase from an unusual year. Wider coverage tests whether the eight selected buses represent the fleet; invoice detail separates price changes and major one-off work.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Annual repair spending was S$11,255 higher.\n\nThis is the difference between incurred repair charges for October 2025–September 2026 and October 2024–September 2025, for the same eight selected buses. It is not a forecast, a sustained trend, or a quantified saving. Distance, age, job mix and prices need separate analysis; do not extrapolate this increase to the whole fleet.\n\nSource: Monthly maintenance and mileage records · Oct 2024–Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
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
    aria-label="Repair costs were higher in the second year — How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"More repairs mean both bills and buses off the road."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The records separate repair charges from time a bus cannot be used."}
    </p>
    <figure
      aria-label="More repairs mean both bills and buses off the road."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="More repairs mean both bills and buses off the road. The records separate repair charges from time a bus cannot be used."
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
        <div className="absolute top-[244.186px] left-[726.721px] h-[40.405px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[244.186px] left-[1387.693px] h-[40.405px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[192.81px] left-[139.47px] h-[143.14px] w-[143.136px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7407809475879021 0.7375578860263177 22.521662239269386 22.522161964611183"
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
        <p className="absolute top-[387.727px] left-[116.497px] m-0 h-[35.387px] w-[189.063px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Repair needed"}
        </p>
        <div className="absolute top-[218.256px] left-[800.445px] h-[92.266px] w-[143.11px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 4.741247890375073 22.517504219249854 14.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
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
        <p className="absolute top-[387.727px] left-[807.57px] m-0 h-[35.387px] w-[128.859px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Repair bill"}
        </p>
        <div className="absolute top-[192.834px] left-[1461.417px] h-[143.11px] w-[143.11px] text-destructive">
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
        <p className="absolute top-[387.727px] left-[1431.113px] m-0 h-[35.387px] w-[203.719px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Bus unavailable"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair spending grew much faster than distance travelled."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Change between the two complete years, for the same eight buses."}
    </p>
    <figure
      aria-label="Repair spending grew much faster than distance travelled."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair spending grew much faster than distance travelled. Change between the two complete years, for the same eight buses."
        className="relative h-full w-full"
      >
        <div className="absolute top-[97.879px] left-[555.186px] h-[254.228px] w-[16px] text-foreground">
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
        <p className="absolute top-[146.701px] left-[318.695px] m-0 h-[30.705px] w-[202.375px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Distance travelled"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[104.492px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1488.737px] m-0 h-[50.822px] w-[117.594px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"11.4%"}
        </p>
        <p className="absolute top-[279.05px] left-[337.163px] m-0 h-[30.705px] w-[183.906px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair spending"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1476.284px] m-0 h-[50.822px] w-[130.047px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"82.6%"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[780.171px] m-0 h-[30.705px] w-[413.063px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Percentage increase from earlier year"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair spending per kilometre was higher in the second year."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Repair spending per 1,000 km; this accounts for the increase in use."}
    </p>
    <figure
      aria-label="Repair spending per kilometre was higher in the second year."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair spending per kilometre was higher in the second year. Repair spending per 1,000 km; this accounts for the increase in use."
        className="relative h-full w-full"
      >
        <div className="absolute top-[97.879px] left-[555.186px] h-[254.228px] w-[16px] text-foreground">
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
        <p className="absolute top-[146.701px] left-[394.398px] m-0 h-[30.705px] w-[126.672px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[462.81px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1474.424px] m-0 h-[50.822px] w-[131.906px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$104"}
        </p>
        <p className="absolute top-[279.05px] left-[406.992px] m-0 h-[30.705px] w-[114.078px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1477.721px] m-0 h-[50.822px] w-[128.609px] text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$170"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[812.491px] m-0 h-[30.705px] w-[348.422px] text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars per 1,000 km"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The number of repair jobs also rose."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Separate repair visits count as separate jobs; they are not necessarily roadside breakdowns."
      }
    </p>
    <figure
      aria-label="The number of repair jobs also rose."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The number of repair jobs also rose. Separate repair visits count as separate jobs; they are not necessarily roadside breakdowns."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.026px] left-[508.092px] h-[290.558px] w-[16px] text-foreground">
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
        <p className="absolute top-[169.098px] left-[321.873px] m-0 h-[35.387px] w-[145.375px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[492.909px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.59px] left-[1660.495px] m-0 h-[58.572px] w-[57.516px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"31"}
        </p>
        <p className="absolute top-[321.63px] left-[336.389px] m-0 h-[35.387px] w-[130.859px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.122px] left-[1653.729px] m-0 h-[58.572px] w-[64.281px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"55"}
        </p>
        <p className="absolute top-[402.98px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.175px] left-[861.734px] m-0 h-[35.387px] w-[284.922px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Completed repair jobs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Repair costs were higher in the second year"}
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
    aria-label="Repair costs were higher in the second year — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two annual totals cannot establish a sustained increase."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier monthly repair records to distinguish a persistent increase from an unusual year."
      }
    </p>
    <figure
      aria-label="Two annual totals cannot establish a sustained increase."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two annual totals cannot establish a sustained increase. Share earlier monthly repair records to distinguish a persistent increase from an unusual year."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.968px] left-[527.717px] m-0 h-[42.352px] w-[185.641px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier years"}
        </p>
        <p className="absolute top-[61.586px] left-[1134.565px] m-0 h-[38.116px] w-[286.609px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Oct 2024–Sep 2026"}
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
        <div className="absolute top-[186.112px] left-[1066.935px] h-[135.114px] w-[421.87px] text-foreground">
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
        <div className="absolute top-[216.17px] left-[1074.935px] h-[79.409px] w-[405.87px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[227.698px] left-[1210.964px] m-0 h-[50.822px] w-[133.813px] text-[length:42.352px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"2 years"}
        </p>
        <p className="absolute top-[129.76px] left-[593.381px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[343.136px] left-[466.287px] m-0 h-[33.881px] w-[308.5px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"No earlier observations in"}
        </p>
        <p className="absolute top-[378.429px] left-[551.998px] m-0 h-[33.881px] w-[137.078px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"this extract"}
        </p>
        <p className="absolute top-[343.136px] left-[1172.815px] m-0 h-[33.881px] w-[210.109px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Supplied window"}
        </p>
        <p className="absolute top-[470.309px] left-[596.461px] m-0 h-[40.234px] w-[551.078px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Long-term direction remains unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Costs for eight selected buses may not represent the whole fleet."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share the same repair and mileage reports for the other buses before estimating fleet-wide costs."
      }
    </p>
    <figure
      aria-label="Costs for eight selected buses may not represent the whole fleet."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Costs for eight selected buses may not represent the whole fleet. Share the same repair and mileage reports for the other buses before estimating fleet-wide costs."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.968px] left-[372.431px] m-0 h-[42.352px] w-[257.984px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 selected buses"}
        </p>
        <p className="absolute top-[57.968px] left-[1166.458px] m-0 h-[42.352px] w-[187.531px] text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Other buses"}
        </p>
        <div className="absolute top-[169.568px] left-[301.517px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[169.568px] left-[411.808px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[169.568px] left-[522.099px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[169.568px] left-[632.389px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[301.917px] left-[301.517px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[301.917px] left-[411.808px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[301.917px] left-[522.099px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[301.917px] left-[632.389px] h-[75.557px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
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
        <div className="absolute top-[222.14px] left-[855.912px] h-[67.469px] w-[67.469px] text-destructive">
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
        <div className="absolute top-[154.407px] left-[1066.112px] h-[229.404px] w-[388.223px] [border-radius:5.294px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[200.346px] left-[1233.067px] m-0 h-[116.467px] w-[54.313px] text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[391.664px] left-[385.783px] m-0 h-[33.881px] w-[231.281px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Selected examples"}
        </p>
        <p className="absolute top-[391.664px] left-[1090.411px] m-0 h-[33.881px] w-[339.625px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Wider pattern not measured"}
        </p>
        <p className="absolute top-[426.957px] left-[1231.575px] m-0 h-[33.881px] w-[57.297px] text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"here"}
        </p>
        <p className="absolute top-[470.309px] left-[579.922px] m-0 h-[40.234px] w-[584.156px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Fleet-wide repair cost cannot be inferred."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
    aria-label="Repair costs were higher in the second year — Stakeholder data request"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Stakeholder data request"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Higher repair bills do not tell us what became more expensive."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share repair invoices and job sheets to separate parts, labour and major one-off jobs."
      }
    </p>
    <figure
      aria-label="Higher repair bills do not tell us what became more expensive."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Higher repair bills do not tell us what became more expensive. Share repair invoices and job sheets to separate parts, labour and major one-off jobs."
        className="relative h-full w-full"
      >
        <div className="absolute top-[170.671px] left-[380.927px] h-[82.175px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 4.549288741798757 22.901422516402484 14.901422516402485"
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
        <p className="absolute top-[326.284px] left-[297.392px] m-0 h-[38.116px] w-[293.359px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Repair totals supplied"}
        </p>
        <div className="absolute top-[225.816px] left-[652.242px] h-[16px] w-[223.347px] text-muted-foreground">
          <svg
            viewBox="600.9330546362422 255.93305463624225 253.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M610 265H845"
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
        <p className="absolute top-[27.852px] left-[1070.221px] m-0 h-[35.999px] w-[274.125px] text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Invoice detail needed"}
        </p>
        <p className="absolute top-[127.761px] left-[1051.231px] m-0 h-[38.116px] w-[162.109px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Parts prices"}
        </p>
        <p className="absolute top-[114.32px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[181.7px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 205.93305463624225 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 215H1560"
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
        <p className="absolute top-[242.463px] left-[1025.231px] m-0 h-[38.116px] w-[214.109px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Labour charges"}
        </p>
        <p className="absolute top-[229.021px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[296.402px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 335.9330546362422 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 345H1560"
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
        <p className="absolute top-[357.165px] left-[1006.278px] m-0 h-[38.116px] w-[252.016px] text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Major one-off jobs"}
        </p>
        <p className="absolute top-[343.724px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[411.104px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 465.9330546362422 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 475H1560"
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
        <p className="absolute top-[470.309px] left-[540.859px] m-0 h-[40.234px] w-[662.281px] text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cause of higher spending remains unclear."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page9: Page = () => (
  <section
    aria-label="Repair costs were higher in the second year — Impact"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Repair costs were higher in the second year"}</span>
      <span>{"Impact"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Annual repair spending was S$11,255 higher."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Recorded difference for the same eight buses; this is an expense increase, not an avoidable saving."
      }
    </p>
    <figure
      aria-label="Annual repair spending was S$11,255 higher."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Annual repair spending was S$11,255 higher. Recorded difference for the same eight buses; this is an expense increase, not an avoidable saving."
        className="relative h-full w-full"
      >
        <p className="absolute top-[178.418px] left-[124.15px] m-0 h-[104.942px] w-[295.781px] text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"24,880"}
        </p>
        <p className="absolute top-[318.223px] left-[188.814px] m-0 h-[46.37px] w-[166.453px] text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <p className="absolute top-[178.418px] left-[733.242px] m-0 h-[104.942px] w-[277.516px] text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"13,625"}
        </p>
        <p className="absolute top-[318.223px] left-[779.602px] m-0 h-[46.37px] w-[184.797px] text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <p className="absolute top-[178.418px] left-[1340.53px] m-0 h-[104.942px] w-[262.859px] text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"11,255"}
        </p>
        <p className="absolute top-[318.223px] left-[1322.373px] m-0 h-[46.37px] w-[299.172px] text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Extra repair spend"}
        </p>
        <p className="absolute top-[231.855px] left-[554.434px] m-0 h-[58.572px] w-[35.172px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"−"}
        </p>
        <p className="absolute top-[231.855px] left-[1154.394px] m-0 h-[58.572px] w-[35.172px] text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"="}
        </p>
        <p className="absolute top-[514.838px] left-[543.828px] m-0 h-[35.387px] w-[656.344px] text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars · two equal twelve-month periods"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Monthly maintenance and mileage records · Oct 2024–Sep 2026"}
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
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
  Page9,
] satisfies Page[]
