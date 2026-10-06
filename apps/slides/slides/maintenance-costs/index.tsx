import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Maintenance costs" }
export const notes = [
  "Maintenance includes more than repairs.\n\nThese are distinct categories in the canonical monthly ledger. Annual summaries and selected job records overlap the same ledger and cannot be added as extra spending. Supplier quotes are not included because they are proposed purchases, not incurred costs.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Annual maintenance costs rose to S$81,835.\n\nTotal earlier spending is S$65,045; later spending is S$81,835. These include labour and parts recorded in the monthly source. They exclude fuel, wages outside the job charges, financing and unpriced replacement cover.\n\nInterpretation: Two annual totals do not establish a sustained trend; prices and the mix of work may have changed.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repairs drove most of the cost increase.\n\nThe increase is S$16,790 overall. Regular service charges rose S$5,670, repair charges rose S$11,255, and extra preventive charges fell by S$135. A decline in preventive spending does not prove that it caused the rise in repairs.\n\nInterpretation: Changes in spending do not prove that fewer preventive checks caused more repairs.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair costs rose faster than bus use.\n\nEarlier year: October 2024 to September 2025. Later year: October 2025 to September 2026. Repair spend rose from S$13,625 to S$24,880, while distance rose from 131,600 to 146,570 km. These are incurred repair charges, not quotes.\n\nInterpretation: Two years show a difference, not a sustained trend; only eight selected buses are included.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair costs rose per kilometre.\n\nDividing repair charges by the distance recorded in the same period makes the comparison more informative than raw bills. The difference remains substantial after allowing for distance. It does not establish whether age, workload, specific faults or other conditions caused the increase.\n\nInterpretation: Distance is accounted for; bus age, workload, prices and one-off repairs are not.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair jobs rose from 31 to 55.\n\nThere were 31 corrective jobs in the earlier year and 55 in the later year. The increase is not just a comparison of one expensive invoice with many small ones. Jobs can follow faults found between duties; these counts must not be called cancelled trips or breakdowns.\n\nInterpretation: More jobs may reflect more inspections or changed recording, as well as more faults.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Two buses account for almost half the repair costs.\n\nThe highest two buses account for S$19,015 of S$38,505, or 49.4%. The group of six is combined, not an average bus. These raw totals differ in mileage and do not prove vehicle age or a particular component caused the difference.\n\nInterpretation: Two buses may cost more because of heavier use, age or one major job; totals alone cannot explain why.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Two years do not show a cost trend.\n\nTwo years do not show a cost trend. Share earlier monthly maintenance reports using the same cost categories.\n\nTwo annual totals do not establish a sustained trend; prices and the mix of work may have changed.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Eight buses may not represent the fleet.\n\nEight buses may not represent the fleet. Share maintenance costs, mileage and ages for other buses doing similar work.\n\nChanges in spending do not prove that fewer preventive checks caused more repairs.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Totals hide the cost of major one-off jobs.\n\nTotals hide the cost of major one-off jobs. Share invoices and job sheets to separate routine work, major jobs and price changes.\n\nTwo buses may cost more because of heavier use, age or one major job; totals alone cannot explain why.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Annual maintenance costs rose by S$16,790.\n\nThe totals are S$81,835 and S$65,045, giving a difference of S$16,790. This includes the S$11,255 repair increase rather than being additional to it. Repair-job charges overlap these totals too. The difference is recorded expenditure, not a sustained trend, price-adjusted comparison or guaranteed avoidable cost. Fuel, financing and unpriced replacement cover are outside these maintenance categories.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
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
    aria-label="Maintenance costs. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Maintenance includes more than repairs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The records separate regular servicing, extra checks and repairs."}
    </p>
    <figure
      aria-label="Maintenance includes more than repairs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Maintenance includes more than repairs. The records separate regular servicing, extra checks and repairs."
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
        <div className="absolute top-[244.188px] left-[726.721px] h-[40.406px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[244.188px] left-[1387.693px] h-[40.406px] w-[36.338px] text-muted-foreground">
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
        <div className="absolute top-[192.836px] left-[145.828px] h-[136.75px] w-[130.399px] text-foreground">
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
        <p className="absolute top-[387.728px] left-[98.801px] m-0 h-[35.387px] w-[224.453px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[192.813px] left-[800.442px] h-[143.141px] w-[143.136px] text-foreground">
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
        <p className="absolute top-[387.728px] left-[788.563px] m-0 h-[35.387px] w-[166.875px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Extra checks"}
        </p>
        <div className="absolute top-[218.258px] left-[1461.417px] h-[92.266px] w-[143.11px] text-foreground">
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
        <p className="absolute top-[387.728px] left-[1461.402px] m-0 h-[35.387px] w-[143.141px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair bills"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Annual maintenance costs rose to S$81,835."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The same eight buses, compared across two full years."}
    </p>
    <figure
      aria-label="Annual maintenance costs rose to S$81,835."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Annual maintenance costs rose to S$81,835. The same eight buses, compared across two full years."
        className="relative h-full w-full"
      >
        <p className="absolute top-[137.874px] left-[332.635px] m-0 h-[30.705px] w-[126.672px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[114.703px] left-[501.423px] h-[79.406px] w-[479.48px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <div className="absolute top-[114.703px] left-[980.903px] h-[79.406px] w-[41.654px] bg-primary"></div>
        <div className="absolute top-[114.703px] left-[1022.558px] h-[79.406px] w-[138.088px] bg-destructive"></div>
        <p className="absolute top-[126.23px] left-[1405.815px] m-0 h-[50.822px] w-[200.516px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$65,045"}
        </p>
        <p className="absolute top-[305.523px] left-[345.229px] m-0 h-[30.705px] w-[114.078px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[282.344px] left-[501.423px] h-[79.406px] w-[536.945px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <div className="absolute top-[282.344px] left-[1038.368px] h-[79.406px] w-[40.286px] bg-primary"></div>
        <div className="absolute top-[282.344px] left-[1078.654px] h-[79.406px] w-[252.155px] bg-destructive"></div>
        <p className="absolute top-[293.87px] left-[1412.862px] m-0 h-[50.822px] w-[193.469px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$81,835"}
        </p>
        <div className="absolute top-[449.984px] left-[307.311px] h-[24.703px] w-[24.705px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <p className="absolute top-[446.694px] left-[347.663px] m-0 h-[30.705px] w-[195.297px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[449.984px] left-[766.121px] h-[24.703px] w-[24.705px] bg-primary"></div>
        <p className="absolute top-[446.694px] left-[806.473px] m-0 h-[30.705px] w-[145.328px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Extra checks"}
        </p>
        <div className="absolute top-[449.984px] left-[1224.93px] h-[24.703px] w-[24.705px] bg-destructive"></div>
        <p className="absolute top-[446.694px] left-[1265.282px] m-0 h-[30.705px] w-[87.609px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repairs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repairs drove most of the cost increase."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The change in each maintenance cost between the two years."}
    </p>
    <figure
      aria-label="Repairs drove most of the cost increase."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repairs drove most of the cost increase. The change in each maintenance cost between the two years."
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
        <p className="absolute top-[169.095px] left-[242.795px] m-0 h-[35.387px] w-[224.453px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[440.561px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1521.87px] m-0 h-[58.572px] w-[196.141px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$5,670"}
        </p>
        <p className="absolute top-[321.627px] left-[366.889px] m-0 h-[35.387px] w-[100.359px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repairs"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1505.964px] m-0 h-[58.572px] w-[212.047px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$11,255"}
        </p>
        <p className="absolute top-[402.978px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[589.687px] m-0 h-[35.387px] w-[829.016px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {
            "Increase in Singapore dollars · preventive spending fell separately"
          }
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair costs rose faster than bus use."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The same eight buses, compared across two full years."}
    </p>
    <figure
      aria-label="Repair costs rose faster than bus use."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair costs rose faster than bus use. The same eight buses, compared across two full years."
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
        <p className="absolute top-[146.701px] left-[318.695px] m-0 h-[30.705px] w-[202.375px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Distance travelled"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[104.492px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1488.737px] m-0 h-[50.822px] w-[117.594px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"11.4%"}
        </p>
        <p className="absolute top-[279.05px] left-[337.163px] m-0 h-[30.705px] w-[183.906px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair spending"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1476.284px] m-0 h-[50.822px] w-[130.047px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"82.6%"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[780.171px] m-0 h-[30.705px] w-[413.063px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Percentage increase from earlier year"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair costs rose per kilometre."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Costs per 1,000 kilometres account for the increase in bus use."}
    </p>
    <figure
      aria-label="Repair costs rose per kilometre."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair costs rose per kilometre. Costs per 1,000 kilometres account for the increase in bus use."
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
        <p className="absolute top-[146.701px] left-[394.398px] m-0 h-[30.705px] w-[126.672px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[462.81px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1474.424px] m-0 h-[50.822px] w-[131.906px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$104"}
        </p>
        <p className="absolute top-[279.05px] left-[406.992px] m-0 h-[30.705px] w-[114.078px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1477.721px] m-0 h-[50.822px] w-[128.609px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$170"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[812.491px] m-0 h-[30.705px] w-[348.422px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars per 1,000 km"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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

const Page6: Page = () => (
  <section
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair jobs rose from 31 to 55."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Each repair visit counts as one job. A job does not always mean a breakdown."
      }
    </p>
    <figure
      aria-label="Repair jobs rose from 31 to 55."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair jobs rose from 31 to 55. Each repair visit counts as one job. A job does not always mean a breakdown."
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
        <p className="absolute top-[169.098px] left-[321.873px] m-0 h-[35.387px] w-[145.375px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[492.909px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.59px] left-[1660.495px] m-0 h-[58.572px] w-[57.516px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"31"}
        </p>
        <p className="absolute top-[321.63px] left-[336.389px] m-0 h-[35.387px] w-[130.859px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.122px] left-[1653.729px] m-0 h-[58.572px] w-[64.281px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"55"}
        </p>
        <p className="absolute top-[402.98px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.175px] left-[861.734px] m-0 h-[35.387px] w-[284.922px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Completed repair jobs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two buses account for almost half the repair costs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Two years of repair bills for eight buses, ranked by cost."}
    </p>
    <figure
      aria-label="Two buses account for almost half the repair costs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two buses account for almost half the repair costs. Two years of repair bills for eight buses, ranked by cost."
        className="relative h-full w-full"
      >
        <div className="absolute top-[53.766px] left-[555.186px] h-[386.57px] w-[16px] text-foreground">
          <svg
            viewBox="490.9330546362422 60.93305463624223 18.13389072751553 438.1338907275155"
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
        <p className="absolute top-[102.585px] left-[324.554px] m-0 h-[30.705px] w-[196.516px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Highest-cost bus"}
        </p>
        <div className="absolute top-[92.641px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[92.641px] left-[563.186px] h-[60px] w-[400.229px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[90.941px] left-[1412.877px] m-0 h-[50.822px] w-[193.453px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$10,280"}
        </p>
        <p className="absolute top-[234.937px] left-[337.882px] m-0 h-[30.705px] w-[183.188px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Second-highest"}
        </p>
        <div className="absolute top-[224.992px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[224.992px] left-[563.186px] h-[60px] w-[340.078px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[223.284px] left-[1436.518px] m-0 h-[50.822px] w-[169.813px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$8,735"}
        </p>
        <p className="absolute top-[367.28px] left-[301.195px] m-0 h-[30.705px] w-[219.875px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Other six combined"}
        </p>
        <div className="absolute top-[357.344px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[357.344px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[355.636px] left-[1413.987px] m-0 h-[50.822px] w-[192.344px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$19,490"}
        </p>
        <p className="absolute top-[437.866px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.335px] left-[772.343px] m-0 h-[30.705px] w-[428.719px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars · full two-year period"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
    aria-label="Maintenance costs. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Maintenance costs"}
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

const Page9: Page = () => (
  <section
    aria-label="Maintenance costs. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two years do not show a cost trend."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier monthly maintenance reports using the same cost categories."
      }
    </p>
    <figure
      aria-label="Two years do not show a cost trend."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two years do not show a cost trend. Share earlier monthly maintenance reports using the same cost categories."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.965px] left-[527.717px] m-0 h-[42.352px] w-[185.641px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier years"}
        </p>
        <p className="absolute top-[61.582px] left-[1134.565px] m-0 h-[38.116px] w-[286.609px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Oct 2024 to Sep 2026"}
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
        <div className="absolute top-[186.109px] left-[1066.935px] h-[135.117px] w-[421.87px] text-foreground">
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
        <div className="absolute top-[216.172px] left-[1074.935px] h-[79.406px] w-[405.87px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[227.698px] left-[1210.964px] m-0 h-[50.822px] w-[133.813px] text-center text-[length:42.352px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"2 years"}
        </p>
        <p className="absolute top-[129.759px] left-[593.381px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[343.137px] left-[466.287px] m-0 h-[33.881px] w-[308.5px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"No earlier records"}
        </p>
        <p className="absolute top-[378.427px] left-[551.998px] m-0 h-[33.881px] w-[137.078px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"were provided."}
        </p>
        <p className="absolute top-[343.137px] left-[1172.815px] m-0 h-[33.881px] w-[210.109px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Dates provided"}
        </p>
        <p className="absolute top-[470.305px] left-[525.594px] m-0 h-[40.234px] w-[692.813px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We need more years to check the trend."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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

const Page10: Page = () => (
  <section
    aria-label="Maintenance costs. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Eight buses may not represent the fleet."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share maintenance costs, mileage and ages for other buses doing similar work."
      }
    </p>
    <figure
      aria-label="Eight buses may not represent the fleet."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Eight buses may not represent the fleet. Share maintenance costs, mileage and ages for other buses doing similar work."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.965px] left-[372.431px] m-0 h-[42.352px] w-[257.984px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 selected buses"}
        </p>
        <p className="absolute top-[57.965px] left-[1047.598px] m-0 h-[42.352px] w-[425.25px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Other buses and their usage"}
        </p>
        <div className="absolute top-[169.57px] left-[301.517px] h-[75.555px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[169.57px] left-[411.808px] h-[75.555px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[169.57px] left-[522.099px] h-[75.555px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[169.57px] left-[632.389px] h-[75.555px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[301.914px] left-[301.517px] h-[75.563px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[301.914px] left-[411.808px] h-[75.563px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[301.914px] left-[522.099px] h-[75.563px] w-[82.174px] text-foreground">
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
        <div className="absolute top-[301.914px] left-[632.389px] h-[75.563px] w-[82.174px] text-foreground">
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
        <p className="absolute top-[200.345px] left-[1233.067px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[391.661px] left-[385.783px] m-0 h-[33.881px] w-[231.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Selected examples"}
        </p>
        <p className="absolute top-[391.661px] left-[1090.411px] m-0 h-[33.881px] w-[339.625px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"The wider pattern"}
        </p>
        <p className="absolute top-[426.958px] left-[1231.575px] m-0 h-[33.881px] w-[57.297px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"is unknown."}
        </p>
        <p className="absolute top-[470.305px] left-[531.641px] m-0 h-[40.234px] w-[680.719px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Total fleet maintenance costs are unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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

const Page11: Page = () => (
  <section
    aria-label="Maintenance costs. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Totals hide the cost of major one-off jobs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share invoices and job sheets to separate routine work, major jobs and price changes."
      }
    </p>
    <figure
      aria-label="Totals hide the cost of major one-off jobs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Totals hide the cost of major one-off jobs. Share invoices and job sheets to separate routine work, major jobs and price changes."
        className="relative h-full w-full"
      >
        <div className="absolute top-[170.672px] left-[380.927px] h-[82.172px] w-[126.291px] text-foreground">
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
        <p className="absolute top-[326.286px] left-[253.205px] m-0 h-[38.116px] w-[381.734px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Maintenance totals supplied"}
        </p>
        <div className="absolute top-[225.813px] left-[652.242px] h-[16px] w-[223.347px] text-muted-foreground">
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
        <p className="absolute top-[27.852px] left-[1029.62px] m-0 h-[35.999px] w-[355.328px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Invoices and job"}
        </p>
        <p className="absolute top-[65.352px] left-[1162.542px] m-0 h-[35.999px] w-[89.484px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"sheets"}
        </p>
        <p className="absolute top-[127.762px] left-[1042.271px] m-0 h-[38.116px] w-[180.031px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Regular work"}
        </p>
        <p className="absolute top-[114.318px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[181.703px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
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
        <p className="absolute top-[242.465px] left-[976.489px] m-0 h-[38.116px] w-[311.594px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Parts and labour prices"}
        </p>
        <p className="absolute top-[229.021px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[296.406px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
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
        <p className="absolute top-[357.168px] left-[978.864px] m-0 h-[38.116px] w-[306.844px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Major one-off jobs"}
        </p>
        <p className="absolute top-[343.724px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[411.102px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
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
        <p className="absolute top-[470.305px] left-[550.719px] m-0 h-[40.234px] w-[642.563px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Routine costs are not separated."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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

const Page12: Page = () => (
  <section
    aria-label="Maintenance costs. Impact"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance costs"}</span>
      <span>{"Impact"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Annual maintenance costs rose by S$16,790."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "This covers eight buses and includes the S$11,255 repair increase. It is not a measure of possible savings."
      }
    </p>
    <figure
      aria-label="Annual maintenance costs rose by S$16,790."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Annual maintenance costs rose by S$16,790. This covers eight buses and includes the S$11,255 repair increase. It is not a measure of possible savings."
        className="relative h-full w-full"
      >
        <p className="absolute top-[178.42px] left-[131.361px] m-0 h-[104.942px] w-[281.359px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"81,835"}
        </p>
        <p className="absolute top-[318.221px] left-[188.814px] m-0 h-[46.37px] w-[166.453px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <p className="absolute top-[178.42px] left-[724.055px] m-0 h-[104.942px] w-[295.891px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"65,045"}
        </p>
        <p className="absolute top-[318.221px] left-[779.602px] m-0 h-[46.37px] w-[184.797px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <p className="absolute top-[178.42px] left-[1333.647px] m-0 h-[104.942px] w-[276.625px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"16,790"}
        </p>
        <p className="absolute top-[318.221px] left-[1262.811px] m-0 h-[46.37px] w-[418.297px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Extra maintenance spend"}
        </p>
        <p className="absolute top-[231.854px] left-[554.434px] m-0 h-[58.572px] w-[35.172px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"−"}
        </p>
        <p className="absolute top-[231.854px] left-[1154.394px] m-0 h-[58.572px] w-[35.172px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"="}
        </p>
        <p className="absolute top-[514.838px] left-[537.023px] m-0 h-[35.387px] w-[669.953px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars · servicing + extra checks + repairs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
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
  Page10,
  Page11,
  Page12,
] satisfies Page[]
